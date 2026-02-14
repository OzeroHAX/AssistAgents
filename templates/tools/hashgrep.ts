import { tool } from "@opencode-ai/plugin"
import { promises as fs } from "node:fs"

import textFile from "./text-file"
const {
  DEFAULT_MAX_BYTES,
  decodeUtf8OrThrow,
  ensureInsideWorktree,
  fileRevCanonical,
  formatLineRecords,
  linesToRecords,
  splitLinesCanonical,
  toWorkspacePath,
} = textFile

const DEFAULT_MAX_MATCHES = 10
const DEFAULT_CONTEXT_LINES = 0

function parseRegex(query: string): { pattern: string; flags: string } {
  if (query.startsWith("/") && query.lastIndexOf("/") > 0) {
    const lastSlash = query.lastIndexOf("/")
    const pattern = query.slice(1, lastSlash)
    const flags = query.slice(lastSlash + 1)
    return { pattern, flags }
  }

  return { pattern: query, flags: "u" }
}

function makeError(pathValue: string, code: string, message: string, rev: string | null = null, hint: string | null = null) {
  const output = [
    `ERROR ${code}`,
    `PATH ${pathValue || "-"}`,
    `REV ${rev ?? "-"}`,
    `MESSAGE ${message}`,
  ]

  if (hint) {
    output.push(`HINT ${hint}`)
  }

  return output.join("\n")
}

type MatchRecord = {
  n: number
  h: string
  t: string
  before?: Array<{ n: number; h: string; t: string }>
  after?: Array<{ n: number; h: string; t: string }>
}

function formatContextBlocks(matches: MatchRecord[]): string[] {
  const sections: string[] = []

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index]
    const matchIndex = index + 1

    if (match.before && match.before.length > 0) {
      sections.push(`CTX_BEFORE ${matchIndex}`)
      sections.push(...formatLineRecords(match.before))
    }

    if (match.after && match.after.length > 0) {
      sections.push(`CTX_AFTER ${matchIndex}`)
      sections.push(...formatLineRecords(match.after))
    }
  }

  return sections
}

function formatSuccess(
  safePath: string,
  rev: string,
  searchStartLine: number,
  searchEndLine: number,
  matches: MatchRecord[],
  wantTargets: boolean,
  includeContext: boolean,
  truncated: boolean,
  totalLines: number,
  contextLines: number,
  maxMatches: number,
  mode: "literal" | "regex",
) {
  const output = [
    "OK",
    `PATH ${safePath}`,
    `REV ${rev}`,
    `TOTAL_LINES ${totalLines}`,
    `MODE ${mode}`,
    `CONTEXT_LINES ${contextLines}`,
    `MAX_MATCHES ${maxMatches}`,
    `SEARCH_RANGE start=${searchStartLine} end=${searchEndLine}`,
    `MATCH_COUNT ${matches.length}`,
  ]

  if (truncated) {
    output.push("TRUNCATED true")
  }

  output.push("---")
  output.push(...formatLineRecords(matches.map((match) => ({ n: match.n, h: match.h, t: match.t }))))

  if (includeContext) {
    const contextBlocks = formatContextBlocks(matches)
    if (contextBlocks.length > 0) {
      output.push("---")
      output.push(...contextBlocks)
    }
  }

  if (wantTargets) {
    output.push("---")
    output.push("TARGETS")
    output.push(...matches.map((match) => `TARGET n=${match.n} h=${match.h}`))
  }

  return output.join("\n")
}

export default tool({
  description: "Search file content and return matches with line tags",
  args: {
    filePath: tool.schema.string().describe("Absolute or relative path to file inside worktree"),
    query: tool.schema.string().describe("Search query"),
    mode: tool.schema.enum(["literal", "regex"]).optional().describe("Search mode"),
    contextLines: tool.schema.number().int().min(0).max(20).optional().describe("Context lines around each match"),
    startLine: tool.schema.number().int().positive().optional().describe("Start searching from this 1-based line"),
    endLine: tool.schema.number().int().positive().optional().describe("End searching at this 1-based line"),
    maxMatches: tool.schema.number().int().positive().optional().describe("Maximum number of matching lines"),
    maxBytes: tool.schema.number().int().positive().optional().describe("Server-side read guard in bytes before decode"),
    maxResultBytes: tool.schema.number().int().positive().optional().describe("Maximum response size in bytes before truncation"),
    wantTargets: tool.schema.boolean().optional().describe("Return simplified targets for quick apply operations"),
  },
  async execute(args, context) {
    let absolutePath: string
    try {
      absolutePath = ensureInsideWorktree(args.filePath, context.worktree)
    } catch (error) {
      const maybeError = error as Error & { code?: string }
      return makeError(args.filePath, maybeError.code ?? "PATH_OUTSIDE_WORKTREE", maybeError.message)
    }

    const safePath = toWorkspacePath(absolutePath, context.worktree)

    let fileBytes: Buffer
    try {
      fileBytes = await fs.readFile(absolutePath)
    } catch (error) {
      const maybeError = error as NodeJS.ErrnoException
      if (maybeError.code === "ENOENT") {
        return makeError(safePath, "NOT_FOUND", `File not found: ${safePath}`)
      }
      return makeError(safePath, maybeError.code ?? "READ_FAILED", maybeError.message)
    }

    const maxBytes = args.maxBytes ?? DEFAULT_MAX_BYTES
    if (fileBytes.length > maxBytes) {
      return makeError(safePath, "FILE_TOO_LARGE", `File is larger than maxBytes (${maxBytes})`)
    }

    let text: string
    try {
      text = decodeUtf8OrThrow(fileBytes)
    } catch (error) {
      const maybeError = error as Error & { code?: string }
      return makeError(safePath, maybeError.code ?? "BINARY_FILE_UNSUPPORTED", maybeError.message)
    }

    const lines = splitLinesCanonical(text)
    const rev = fileRevCanonical(lines)
    const records = linesToRecords(lines)

    const mode = args.mode ?? "literal"
    const maxMatches = args.maxMatches ?? DEFAULT_MAX_MATCHES
    const contextLines = args.contextLines ?? DEFAULT_CONTEXT_LINES
    const wantTargets = args.wantTargets ?? false
    const maxResultBytes = args.maxResultBytes
    const searchStartLine = args.startLine ?? 1
    const searchEndLine = args.endLine ?? records.length

    if (searchStartLine > searchEndLine) {
      return makeError(safePath, "INVALID_LINE_RANGE", `startLine (${searchStartLine}) cannot be greater than endLine (${searchEndLine})`, rev)
    }

    const searchStartIndex = Math.max(0, searchStartLine - 1)
    const searchEndIndex = Math.min(records.length - 1, searchEndLine - 1)

    let regex: RegExp | null = null
    if (mode === "regex") {
      try {
        const { pattern, flags } = parseRegex(args.query)
        regex = new RegExp(pattern, flags)
      } catch (error) {
        const maybeError = error as Error
        const detail = maybeError?.message ? ` (${maybeError.message})` : ""
        return makeError(
          safePath,
          "INVALID_REGEX",
          `Invalid regex: ${args.query}${detail}. Tip: escape special chars or use mode=\"literal\".`,
          rev,
          "Use raw pattern (\"foo.*bar\") or literal form (\"/foo.*bar/gi\").",
        )
      }
    }

    const matches: MatchRecord[] = []

    for (let index = searchStartIndex; index <= searchEndIndex; index += 1) {
      const record = records[index]

      if (regex) {
        regex.lastIndex = 0
      }

      const isMatch = mode === "literal" ? record.t.includes(args.query) : Boolean(regex && regex.test(record.t))
      if (!isMatch) {
        continue
      }

      const beforeStart = Math.max(searchStartIndex, index - contextLines)
      const afterEnd = Math.min(searchEndIndex, index + contextLines)
      const before = records.slice(beforeStart, index).map((line) => ({ n: line.n, h: line.h, t: line.t }))
      const after = records.slice(index + 1, afterEnd + 1).map((line) => ({ n: line.n, h: line.h, t: line.t }))

      const match: MatchRecord = {
        n: record.n,
        h: record.h,
        t: record.t,
      }

      if (before.length > 0) {
        match.before = before
      }

      if (after.length > 0) {
        match.after = after
      }

      matches.push(match)
      if (matches.length >= maxMatches) {
        break
      }
    }

    if (!maxResultBytes) {
      return formatSuccess(
        safePath,
        rev,
        searchStartLine,
        searchEndLine,
        matches,
        wantTargets,
        contextLines > 0,
        false,
        lines.length,
        contextLines,
        maxMatches,
        mode,
      )
    }

    let truncated = false
    while (matches.length > 0) {
      const output = formatSuccess(
        safePath,
        rev,
        searchStartLine,
        searchEndLine,
        matches,
        wantTargets,
        contextLines > 0,
        truncated,
        lines.length,
        contextLines,
        maxMatches,
        mode,
      )

      if (output.length <= maxResultBytes) {
        return output
      }

      matches.pop()
      truncated = true
    }

    return formatSuccess(
      safePath,
      rev,
      searchStartLine,
      searchEndLine,
      [],
      wantTargets,
      contextLines > 0,
      true,
      lines.length,
      contextLines,
      maxMatches,
      mode,
    )
  },
})