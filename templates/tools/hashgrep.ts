import { tool } from "@opencode-ai/plugin"
import { promises as fs } from "node:fs"

import textFile from "./text-file"
const {
  decodeUtf8OrThrow,
  ensureInsideWorktree,
  fileRevCanonical,
  formatLineRecords,
  linesToRecords,
  makeFileTooLargeError,
  resolveEffectiveByteLimit,
  splitLinesCanonical,
  toWorkspacePath,
} = textFile

const DEFAULT_MAX_MATCHES = 10
const DEFAULT_CONTEXT_LINES = 0
const MAX_RETURNED_CODE_LINES = 200

type MatchRecord = {
  n: number
  h: string
  t: string
  before?: Array<{ n: number; h: string; t: string }>
  after?: Array<{ n: number; h: string; t: string }>
}

function parseSlashRegex(query: string): { pattern: string; flags: string } | null {
  if (!query.startsWith("/") || query.length < 2) {
    return null
  }

  for (let index = query.length - 1; index > 0; index -= 1) {
    if (query[index] !== "/") {
      continue
    }

    let slashEscapes = 0
    for (let cursor = index - 1; cursor >= 0 && query[cursor] === "\\"; cursor -= 1) {
      slashEscapes += 1
    }

    if (slashEscapes % 2 === 0) {
      return {
        pattern: query.slice(1, index),
        flags: query.slice(index + 1),
      }
    }
  }

  return null
}

function parseRegex(query: string): { pattern: string; flags: string } {
  const slashParsed = parseSlashRegex(query)
  if (slashParsed) {
    return slashParsed
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

function countCodeLines(match: MatchRecord): number {
  return 1 + (match.before?.length ?? 0) + (match.after?.length ?? 0)
}

function trimMatchToBudget(
  match: MatchRecord,
  remainingBudget: number,
): { match: MatchRecord; truncated: boolean } | null {
  if (remainingBudget <= 0) {
    return null
  }

  const limited: MatchRecord = { n: match.n, h: match.h, t: match.t }
  let budget = remainingBudget - 1

  const before = match.before ?? []
  const after = match.after ?? []
  const limitedBefore: Array<{ n: number; h: string; t: string }> = []
  const limitedAfter: Array<{ n: number; h: string; t: string }> = []

  let beforeIndex = before.length - 1
  let afterIndex = 0

  while (budget > 0 && (beforeIndex >= 0 || afterIndex < after.length)) {
    if (beforeIndex >= 0) {
      limitedBefore.unshift(before[beforeIndex])
      beforeIndex -= 1
      budget -= 1
    }

    if (budget <= 0) {
      break
    }

    if (afterIndex < after.length) {
      limitedAfter.push(after[afterIndex])
      afterIndex += 1
      budget -= 1
    }
  }

  if (limitedBefore.length > 0) {
    limited.before = limitedBefore
  }

  if (limitedAfter.length > 0) {
    limited.after = limitedAfter
  }

  return {
    match: limited,
    truncated: beforeIndex >= 0 || afterIndex < after.length,
  }
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
  description: "Search file content and return matches with line tags (ECMAScript regex; max 200 code lines per response)",
  args: {
    filePath: tool.schema.string().describe("Absolute or relative path to file inside worktree"),
    query: tool.schema.string().describe("Search query (literal text, raw regex, or /pattern/flags when mode=regex)"),
    mode: tool.schema.enum(["literal", "regex"]).optional().describe("Search mode (regex uses ECMAScript RegExp semantics)"),
    contextLines: tool.schema.number().int().min(0).max(20).optional().describe("Context lines around each match; total returned code lines are capped at 200 with deterministic truncation"),
    startLine: tool.schema.number().int().positive().optional().describe("Start searching from this 1-based line"),
    endLine: tool.schema.number().int().positive().optional().describe("End searching at this 1-based line"),
    maxMatches: tool.schema.number().int().positive().optional().describe("Maximum number of matching lines; effective output is still capped to 200 code lines"),
    maxResultBytes: tool.schema.number().int().positive().optional().describe("Maximum response size in bytes before truncation"),
    wantTargets: tool.schema.boolean().optional().describe("Return simplified targets for quick apply operations (after line-cap truncation)"),
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

    const byteLimit = resolveEffectiveByteLimit(fileBytes.length)
    if (fileBytes.length > byteLimit.hardCapBytes) {
      return makeFileTooLargeError(safePath, fileBytes.length, byteLimit.hardCapBytes)
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
    const requestedMaxMatches = args.maxMatches ?? DEFAULT_MAX_MATCHES
    const maxMatches = Math.max(1, requestedMaxMatches)
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
          "Use raw pattern (\"foo.*bar\") or slash form (\"/foo.*bar/gi\").",
        )
      }
    }

    const matches: MatchRecord[] = []
    let remainingCodeLineBudget = MAX_RETURNED_CODE_LINES
    let truncatedByCodeCap = false

    for (let index = searchStartIndex; index <= searchEndIndex; index += 1) {
      if (remainingCodeLineBudget <= 0) {
        truncatedByCodeCap = true
        break
      }

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

      const fullMatch: MatchRecord = {
        n: record.n,
        h: record.h,
        t: record.t,
      }

      if (before.length > 0) {
        fullMatch.before = before
      }

      if (after.length > 0) {
        fullMatch.after = after
      }

      const limited = trimMatchToBudget(fullMatch, remainingCodeLineBudget)
      if (!limited) {
        truncatedByCodeCap = true
        break
      }

      matches.push(limited.match)
      remainingCodeLineBudget -= countCodeLines(limited.match)

      if (limited.truncated) {
        truncatedByCodeCap = true
      }

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
        truncatedByCodeCap,
        lines.length,
        contextLines,
        maxMatches,
        mode,
      )
    }

    let truncatedByResultBytes = false
    while (matches.length > 0) {
      const output = formatSuccess(
        safePath,
        rev,
        searchStartLine,
        searchEndLine,
        matches,
        wantTargets,
        contextLines > 0,
        truncatedByCodeCap || truncatedByResultBytes,
        lines.length,
        contextLines,
        maxMatches,
        mode,
      )

      if (output.length <= maxResultBytes) {
        return output
      }

      matches.pop()
      truncatedByResultBytes = true
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