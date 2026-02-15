import { tool } from "@opencode-ai/plugin"
import { promises as fs } from "node:fs"

import textFile from "./text-file"
const {
  detectLineEnding,
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

const DEFAULT_LIMIT = 200
const MAX_LIMIT = 200

function makeError(
  pathValue: string,
  code: string,
  message: string,
  rev: string | null = null,
  totalLines: number | null = null,
  lineEnding: "LF" | "CRLF" | null = null,
  encoding: "utf-8" | null = "utf-8",
) {
  const lines = [
    `ERROR ${code}`,
    `PATH ${pathValue || "-"}`,
    `REV ${rev ?? "-"}`,
    `MESSAGE ${message}`,
  ]

  if (encoding) {
    lines.push(`ENCODING ${encoding}`)
  }

  if (lineEnding) {
    lines.push(`LINE_ENDING ${lineEnding}`)
  }

  if (totalLines !== null) {
    lines.push(`TOTAL_LINES ${totalLines}`)
  }

  return lines.join("\n")
}

export default tool({
  description: "Read text file with canonical line tags and file revision (up to 200 lines per call)",
  args: {
    path: tool.schema.string().optional().describe("Absolute or relative path to file inside worktree"),
    filePath: tool.schema.string().optional().describe("Backward-compatible alias for path"),
    offset: tool.schema.number().int().min(0).optional().describe("Zero-based line offset"),
    limit: tool.schema.number().int().positive().optional().describe("Max number of lines to return (hard-capped at 200)"),
    startLine: tool.schema.number().int().positive().optional().describe("Backward-compatible start line (1-based); response remains capped at 200 lines"),
    endLine: tool.schema.number().int().positive().optional().describe("Backward-compatible end line (1-based, inclusive); response remains capped at 200 lines"),
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

    const byteLimit = resolveEffectiveByteLimit(fileBytes.length)
    if (fileBytes.length > byteLimit.hardCapBytes) {
      return makeFileTooLargeError(safePath, fileBytes.length, byteLimit.hardCapBytes)
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

    const lineRecords = formatLineRecords(linesToRecords(selected, offset + 1))
    const output = [
      "OK",
      `PATH ${safePath}`,
      `REV ${rev}`,
      "ENCODING utf-8",
      `LINE_ENDING ${lineEnding}`,
      `TOTAL_LINES ${totalLines}`,
      `RANGE offset=${offset} limit=${limit} returned=${returned} has_more=${hasMore} next_offset=${hasMore ? offset + returned : "-"}`,
      "---",
      ...lineRecords,
    ]

    return output.join("\n")
  },
})