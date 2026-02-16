import { createHash } from "node:crypto"
import path from "node:path"

const DEFAULT_MAX_BYTES = 2 * 1024 * 1024
const AUTO_BOOST_MAX_BYTES = 8 * 1024 * 1024
const HARD_CAP_BYTES = 16 * 1024 * 1024
const DEFAULT_LINE_HASH_PREFIX = 12

type LineEnding = "LF" | "CRLF"

type ByteLimitPolicy = {
  defaultBytes?: number
  autoBoostBytes?: number
  hardCapBytes?: number
}

type ByteLimitResolution = {
  effectiveLimitBytes: number
  hardCapBytes: number
  autoBoosted: boolean
}

type LineRecord = {
  n: number
  h: string
  t: string
}

type EnsurePathInsideWorktreeError = Error & { code: "PATH_OUTSIDE_WORKTREE" }

function ensureInsideWorktree(filePath: string, worktree: string): string {
  const resolvedWorktree = path.resolve(worktree)
  const candidate = path.resolve(path.isAbsolute(filePath) ? filePath : path.join(resolvedWorktree, filePath))
  const relativePath = path.relative(resolvedWorktree, candidate)

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    const error = new Error(`Path is outside worktree: ${filePath}`) as EnsurePathInsideWorktreeError
    error.code = "PATH_OUTSIDE_WORKTREE"
    throw error
  }

  return candidate
}

function toWorkspacePath(absolutePath: string, worktree: string): string {
  return path.relative(worktree, absolutePath) || path.basename(absolutePath)
}

function detectLineEnding(rawBytes: Uint8Array): LineEnding {
  for (let index = 0; index < rawBytes.length - 1; index += 1) {
    if (rawBytes[index] === 13 && rawBytes[index + 1] === 10) {
      return "CRLF"
    }
  }

  return "LF"
}

function decodeUtf8OrThrow(rawBytes: Uint8Array): string {
  for (const byte of rawBytes) {
    if (byte === 0) {
      const error = new Error("Binary file is not supported") as Error & { code: "BINARY_FILE_UNSUPPORTED" }
      error.code = "BINARY_FILE_UNSUPPORTED"
      throw error
    }
  }

  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(rawBytes)
  } catch {
    const error = new Error("File must be valid UTF-8") as Error & { code: "BINARY_FILE_UNSUPPORTED" }
    error.code = "BINARY_FILE_UNSUPPORTED"
    throw error
  }
}

function splitLinesCanonical(text: string): string[] {
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
  const lines = normalized.split("\n")

  if (lines.length > 0 && lines[lines.length - 1] === "") {
    lines.pop()
  }

  return lines
}

function lineHashHexPrefix(text: string, prefixLen = DEFAULT_LINE_HASH_PREFIX): string {
  const clampedPrefixLen = Math.max(10, Math.min(16, prefixLen))
  return sha256Hex(Buffer.from(text, "utf8")).slice(0, clampedPrefixLen)
}

function fileRevCanonical(lines: string[]): string {
  return sha256Hex(Buffer.from(lines.join("\n"), "utf8"))
}

function makeLineRecord(n: number, text: string, prefixLen = DEFAULT_LINE_HASH_PREFIX): LineRecord {
  const h = lineHashHexPrefix(text, prefixLen)
  return {
    n,
    h,
    t: text,
  }
}

function linesToRecords(lines: string[], startAt = 1, prefixLen = DEFAULT_LINE_HASH_PREFIX): LineRecord[] {
  const records: LineRecord[] = []
  for (let index = 0; index < lines.length; index += 1) {
    records.push(makeLineRecord(startAt + index, lines[index] ?? "", prefixLen))
  }
  return records
}

function formatLineRecord(record: LineRecord): string {
  return `${record.n}L:${record.h} ${record.t}`
}

function formatLineRecords(records: LineRecord[]): string[] {
  return records.map((record) => formatLineRecord(record))
}

function joinWithLineEnding(lines: string[], lineEnding: LineEnding): string {
  const separator = lineEnding === "CRLF" ? "\r\n" : "\n"
  return lines.join(separator)
}

function resolveEffectiveByteLimit(actualBytes: number, policy: ByteLimitPolicy = {}): ByteLimitResolution {
  const defaultBytes = Math.max(1, Math.trunc(policy.defaultBytes ?? DEFAULT_MAX_BYTES))
  const autoBoostBytes = Math.max(defaultBytes, Math.trunc(policy.autoBoostBytes ?? AUTO_BOOST_MAX_BYTES))
  const hardCapBytes = Math.max(autoBoostBytes, Math.trunc(policy.hardCapBytes ?? HARD_CAP_BYTES))

  if (actualBytes <= defaultBytes) {
    return {
      effectiveLimitBytes: defaultBytes,
      hardCapBytes,
      autoBoosted: false,
    }
  }

  return {
    effectiveLimitBytes: Math.min(hardCapBytes, Math.max(autoBoostBytes, actualBytes)),
    hardCapBytes,
    autoBoosted: true,
  }
}

function makeFileTooLargeError(
  pathValue: string,
  actualBytes: number,
  hardCapBytes: number,
  rev: string | null = null,
  recommendedAction = "Split the file or narrow the requested range, then retry",
): string {
  return [
    "ERROR FILE_TOO_LARGE",
    `PATH ${pathValue || "-"}`,
    `REV ${rev ?? "-"}`,
    "MESSAGE File is larger than the hard cap",
    `ACTUAL_BYTES ${actualBytes}`,
    `HARD_CAP_BYTES ${hardCapBytes}`,
    `RECOMMENDED_ACTION ${recommendedAction}`,
  ].join("\n")
}

function sha256Hex(buffer: Uint8Array): string {
  return createHash("sha256").update(buffer).digest("hex")
}

const textFile = {
  DEFAULT_MAX_BYTES,
  AUTO_BOOST_MAX_BYTES,
  HARD_CAP_BYTES,
  DEFAULT_LINE_HASH_PREFIX,
  ensureInsideWorktree,
  toWorkspacePath,
  detectLineEnding,
  decodeUtf8OrThrow,
  splitLinesCanonical,
  lineHashHexPrefix,
  fileRevCanonical,
  makeLineRecord,
  linesToRecords,
  formatLineRecord,
  formatLineRecords,
  joinWithLineEnding,
  resolveEffectiveByteLimit,
  makeFileTooLargeError,
  description: "Internal hash text helpers (not for direct use)",
  args: {},
  async execute() {
    return [
      "ERROR INTERNAL_ONLY",
      "PATH text-file",
      "HINT text-file is an internal helper module and is not callable as a tool",
    ].join("\n")
  },
}

export default textFile