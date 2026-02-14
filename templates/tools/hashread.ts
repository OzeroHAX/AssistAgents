import { tool } from "@opencode-ai/plugin"
import { promises as fs } from "node:fs"

import textFile from "./text-file"
const { DEFAULT_MAX_BYTES, detectLineEnding, decodeUtf8OrThrow, ensureInsideWorktree, fileRevCanonical, linesToRecords, splitLinesCanonical, toWorkspacePath } = textFile

const DEFAULT_LIMIT = 200
const MAX_LIMIT = 400

function makeError(
  pathValue: string,
  code: string,
  message: string,
  rev: string | null = null,
  totalLines: number | null = null,
  lineEnding: "LF" | "CRLF" | null = null,
  encoding: "utf-8" | null = "utf-8",
) {
  return JSON.stringify({
    status: "ERROR",
    path: pathValue,
    file: {
      rev,
      encoding,
      line_ending: lineEnding,
      total_lines: totalLines,
    },
    error: {
      code,
      message,
      path: pathValue,
    },
  })
}

export default tool({
  description: "Read text file with canonical line tags and file revision",
  args: {
    path: tool.schema.string().optional().describe("Absolute or relative path to file inside worktree"),
    filePath: tool.schema.string().optional().describe("Backward-compatible alias for path"),
    offset: tool.schema.number().int().min(0).optional().describe("Zero-based line offset"),
    limit: tool.schema.number().int().positive().optional().describe("Max number of lines to return"),
    startLine: tool.schema.number().int().positive().optional().describe("Backward-compatible start line (1-based)"),
    endLine: tool.schema.number().int().positive().optional().describe("Backward-compatible end line (1-based, inclusive)"),
    maxBytes: tool.schema.number().int().positive().optional().describe("Maximum readable file size in bytes"),
    want: tool.schema
      .object({
        line_tags: tool.schema.boolean().optional(),
        file_rev: tool.schema.boolean().optional(),
        encoding: tool.schema.boolean().optional(),
        line_ending: tool.schema.boolean().optional(),
        total_lines: tool.schema.boolean().optional(),
      })
      .optional()
      .describe("Compatibility field; response is always fully populated"),
  },
  async execute(args, context) {
    const requestedPath = args.path ?? args.filePath
    if (!requestedPath) {
      return makeError("", "INVALID_PATH", "Either path or filePath is required", null, null, null, null)
    }

    let absolutePath: string
    try {
      absolutePath = ensureInsideWorktree(requestedPath, context.worktree)
    } catch (error) {
      const maybeError = error as Error & { code?: string }
      return makeError(requestedPath, maybeError.code ?? "PATH_OUTSIDE_WORKTREE", maybeError.message)
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

    const lineEnding = detectLineEnding(fileBytes)
    let text: string
    try {
      text = decodeUtf8OrThrow(fileBytes)
    } catch (error) {
      const maybeError = error as Error & { code?: string }
      return makeError(safePath, maybeError.code ?? "BINARY_FILE_UNSUPPORTED", maybeError.message, null, null, lineEnding)
    }

    const lines = splitLinesCanonical(text)
    const rev = fileRevCanonical(lines)
    const totalLines = lines.length

    let offset = args.offset ?? 0
    let requestedLimit = args.limit ?? DEFAULT_LIMIT

    if (args.startLine !== undefined || args.endLine !== undefined) {
      const startLine = args.startLine ?? 1
      const endLine = args.endLine ?? totalLines
      if (startLine > endLine) {
        return makeError(
          safePath,
          "INVALID_RANGE",
          `Invalid line range: startLine=${startLine}, endLine=${endLine}`,
          rev,
          totalLines,
          lineEnding,
        )
      }
      offset = Math.max(0, startLine - 1)
      requestedLimit = Math.max(0, endLine - startLine + 1)
    }

    if (offset < 0) {
      return makeError(safePath, "INVALID_RANGE", `Invalid offset: ${offset}`, rev, totalLines, lineEnding)
    }

    const limit = Math.min(Math.max(requestedLimit, 0), MAX_LIMIT)
    const selected = limit > 0 ? lines.slice(offset, offset + limit) : []
    const returned = selected.length
    const hasMore = offset + returned < totalLines

    return JSON.stringify({
      status: "OK",
      path: safePath,
      preamble: `Read ${returned} of ${totalLines} lines from ${safePath} (offset=${offset}, limit=${limit}).`,
      file: {
        rev,
        encoding: "utf-8",
        line_ending: lineEnding,
        total_lines: totalLines,
      },
      range: {
        offset,
        limit,
        returned,
        has_more: hasMore,
        next_offset: hasMore ? offset + returned : null,
      },
      lines: linesToRecords(selected, offset + 1),
    })
  },
})