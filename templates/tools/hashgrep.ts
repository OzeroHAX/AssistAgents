import { tool } from "@opencode-ai/plugin"
import { promises as fs } from "node:fs"

import textFile from "./text-file"
const { DEFAULT_MAX_BYTES, decodeUtf8OrThrow, ensureInsideWorktree, fileRevCanonical, linesToRecords, splitLinesCanonical, toWorkspacePath } = textFile

const DEFAULT_MAX_MATCHES = 20
const DEFAULT_CONTEXT_LINES = 1

function parseRegex(query: string): { pattern: string; flags: string } {
  // Accept either raw pattern ("foo.*bar") or a JS literal-style form ("/foo.*bar/gi").
  // We intentionally do not support escaping slashes inside the /.../ form; callers can use raw pattern.
  if (query.startsWith("/") && query.lastIndexOf("/") > 0) {
    const lastSlash = query.lastIndexOf("/")
    const pattern = query.slice(1, lastSlash)
    const flags = query.slice(lastSlash + 1)
    return { pattern, flags }
  }

  // Default to Unicode mode for more predictable character handling.
  return { pattern: query, flags: "u" }
}

function makeError(pathValue: string, code: string, message: string, rev: string | null = null) {
  return JSON.stringify({
    status: "ERROR",
    path: pathValue,
    file: { rev },
    error: {
      code,
      message,
      path: pathValue,
      hint: {
        args: ["filePath", "query", "mode", "contextLines", "startLine", "endLine", "maxMatches", "maxBytes", "maxResultBytes", "wantTargets"],
        mode: {
          literal: "plain substring match",
          regex: "RegExp match; query may be 'foo.*bar' or '/foo.*bar/gi'",
        },
        output: {
          matches: "always returned; includes optional before/after when contextLines>0",
          targets: "returned only when wantTargets=true; condensed [{n,h}]",
        },
      },
    },
  })
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
    maxResultBytes: tool.schema.number().int().positive().optional().describe("Maximum serialized response size in bytes before truncation"),
    wantTargets: tool.schema.boolean().optional().describe("Return simplified targets array [{n,h}] for quick apply operations"),
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
          `Invalid regex: ${args.query}${detail}. Tip: escape special chars like | ( ) [ ] with \\ or use mode=\"literal\". Use raw pattern (\"foo.*bar\") or literal form (\"/foo.*bar/gi\").`,
          rev,
        )
      }
    }

    const matches: Array<{
      n: number
      h: string
      tag: string
      t: string
      before?: Array<{ n: number; h: string; tag: string; t: string }>
      after?: Array<{ n: number; h: string; tag: string; t: string }>
    }> = []

    for (let index = searchStartIndex; index <= searchEndIndex; index += 1) {
      const record = records[index]

      // RegExp#test mutates lastIndex for /g and /y; always reset to keep per-line semantics deterministic.
      if (regex) {
        regex.lastIndex = 0
      }

      const isMatch = mode === "literal" ? record.t.includes(args.query) : Boolean(regex && regex.test(record.t))
      if (!isMatch) {
        continue
      }

      const beforeStart = Math.max(searchStartIndex, index - contextLines)
      const afterEnd = Math.min(searchEndIndex, index + contextLines)

      const before = records.slice(beforeStart, index)
      const after = records.slice(index + 1, afterEnd + 1)

      matches.push({
        ...record,
        ...(before.length > 0 ? { before } : {}),
        ...(after.length > 0 ? { after } : {}),
      })

      if (matches.length >= maxMatches) {
        break
      }
    }

    const responseBase: Record<string, unknown> = {
      status: "OK",
      path: safePath,
      file: {
        rev,
        encoding: "utf-8",
        total_lines: lines.length,
      },
      searched_range: { start_line: searchStartLine, end_line: searchEndLine },
      match_count: matches.length,
      matches,
      ...(wantTargets ? { targets: matches.map((match) => ({ n: match.n, h: match.h })) } : {}),
    }

    if (!maxResultBytes) {
      return JSON.stringify(responseBase)
    }

    let truncated = false
    while (JSON.stringify(responseBase).length > maxResultBytes && matches.length > 0) {
      matches.pop()
      truncated = true
      responseBase.matches = matches
      if (wantTargets) {
        responseBase.targets = matches.map((match) => ({ n: match.n, h: match.h }))
      }
    }

    if (truncated) {
      responseBase.truncated = true
    }

    return JSON.stringify(responseBase)
  },
})