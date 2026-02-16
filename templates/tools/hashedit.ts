import { tool } from "@opencode-ai/plugin"
import { promises as fs } from "node:fs"
import { inspect } from "node:util"

import textFile from "./text-file"
const { detectLineEnding, decodeUtf8OrThrow, ensureInsideWorktree, fileRevCanonical, formatLineRecords, joinWithLineEnding, lineHashHexPrefix, linesToRecords, makeFileTooLargeError, resolveEffectiveByteLimit, splitLinesCanonical, toWorkspacePath } = textFile

type LineTarget = {
  n: number
  h: string
}

type BoundaryTarget = {
  kind: "SOF" | "EOF"
}

type BlockRef = LineTarget | BoundaryTarget

type ReplaceLineOp = {
  op: "replace_line"
  target: LineTarget
  text: string
}

type ReplaceBlockOp = {
  op: "replace_block"
  start: BlockRef
  end: BlockRef
  lines: string[]
}

type AppendToFileOp = {
  op: "append_to_file"
  lines: string[]
}

type SetFileOp = {
  op: "set_file"
  lines: string[]
}

type ApplyOp = ReplaceLineOp | ReplaceBlockOp | AppendToFileOp | SetFileOp

type ApplyPlan = {
  sourceIndex: number
  op: ApplyOp
  start: number
  end: number
  replacement: string[]
  lineDelta: number
  didChange: boolean
  safeReapplied: boolean
}
type BaseRevResolution = {
  effectiveBaseRev: string | undefined
  usedAutoBaseRev: boolean
}

const LINE_HASH_REGEX = /^[a-fA-F0-9]{10,16}$/
const SUPPORTED_OPS = ["replace_line", "replace_block", "append_to_file", "set_file"] as const
const MAX_FILE_AFTER_LINES = 200
const OPS_CONTRACT_DESCRIPTION = [
  "Operation list (array or JSON-encoded array string).",
  `Supported ops: ${SUPPORTED_OPS.join(" | ")}.`,
  'replace_line: { op:"replace_line", target:{ n, h }, newText:string (aliases: text|content|line; provide one) }',
  'replace_block: { op:"replace_block", start:{n,h}|{kind:"SOF|EOF|start|end"}, end:{...}, lines?: string[] }',
  'append_to_file: { op:"append_to_file", lines?: string[] }',
  'set_file: { op:"set_file", lines?: string[] | newText:string (aliases: text|content|line; replaces entire file) }',
  'Unsupported op names: insert, append.',
  "Important: return is top-level args.return and must not be inside ops[i].",
].join(" ")

const lineTargetSchema = tool.schema
  .object({
    n: tool.schema.number().int().positive(),
    h: tool.schema.string().regex(LINE_HASH_REGEX),
  })
  .strict()

const boundaryTargetSchema = tool.schema
  .object({
    kind: tool.schema.union([
      tool.schema.literal("SOF"),
      tool.schema.literal("EOF"),
      tool.schema.literal("start"),
      tool.schema.literal("end"),
    ]),
  })
  .strict()

const blockRefSchema = tool.schema.union([lineTargetSchema, boundaryTargetSchema])

const rawReplaceLineSchema = tool.schema
  .object({
    op: tool.schema.literal("replace_line"),
    target: lineTargetSchema,
    newText: tool.schema.string().optional(),
    text: tool.schema.string().optional(),
    content: tool.schema.string().optional(),
    line: tool.schema.string().optional().describe("Legacy alias for newText"),
  })
  .strict()

const rawReplaceBlockSchema = tool.schema
  .object({
    op: tool.schema.literal("replace_block"),
    start: blockRefSchema,
    end: blockRefSchema,
    lines: tool.schema.array(tool.schema.string()).optional(),
  })
  .strict()

const rawAppendToFileSchema = tool.schema
  .object({
    op: tool.schema.literal("append_to_file"),
    lines: tool.schema.array(tool.schema.string()).optional(),
  })
  .strict()

const rawSetFileSchema = tool.schema
  .object({
    op: tool.schema.literal("set_file"),
    lines: tool.schema.array(tool.schema.string()).optional(),
    newText: tool.schema.string().optional(),
    text: tool.schema.string().optional(),
    content: tool.schema.string().optional(),
    line: tool.schema.string().optional().describe("Legacy alias for newText"),
  })
  .strict()

const opsSchema = tool.schema
  .array(tool.schema.discriminatedUnion("op", [rawReplaceLineSchema, rawReplaceBlockSchema, rawAppendToFileSchema, rawSetFileSchema]))
  .min(1)
const opsInputSchema = tool.schema
  .union([opsSchema, tool.schema.string()])
  .describe(OPS_CONTRACT_DESCRIPTION)

function throwToolError(code: string, message: string): never {
  const error = new Error(message) as Error & { code: string }
  error.code = code
  throw error
}

function throwInvalidOpSchema(opIndex: number, message: string): never {
  const opLabel = opIndex >= 0 ? `ops[${opIndex}]` : "ops"
  throwToolError("INVALID_OP_SCHEMA", `${opLabel}: ${message}`)
}

function parseLineTarget(value: unknown, opIndex: number, field: string): LineTarget {
  if (typeof value !== "object" || value === null) {
    throwInvalidOpSchema(opIndex, `field \"${field}\" must be object`)
  }

  const candidate = value as { n?: unknown; h?: unknown }
  if (!Number.isInteger(candidate.n) || (candidate.n as number) <= 0) {
    throwInvalidOpSchema(opIndex, `field \"${field}.n\" must be positive integer`)
  }

  if (typeof candidate.h !== "string" || !LINE_HASH_REGEX.test(candidate.h)) {
    throwInvalidOpSchema(opIndex, `field \"${field}.h\" must be 10-16 hex chars`)
  }

  return {
    n: candidate.n as number,
    h: candidate.h.toLowerCase(),
  }
}

function parseBlockRef(value: unknown, opIndex: number, field: string): BlockRef {
  if (typeof value !== "object" || value === null) {
    throwInvalidOpSchema(opIndex, `field \"${field}\" must be object`)
  }

  const candidate = value as { kind?: unknown }
  if (candidate.kind === "SOF" || candidate.kind === "start") {
    return { kind: "SOF" }
  }

  if (candidate.kind === "EOF" || candidate.kind === "end") {
    return { kind: "EOF" }
  }

  return parseLineTarget(value, opIndex, field)
}

function parseLinesArray(value: unknown, opIndex: number, field: string): string[] {
  if (value === undefined) {
    return []
  }

  if (!Array.isArray(value)) {
    throwInvalidOpSchema(opIndex, `field \"${field}\" must be string[]`)
  }

  for (const item of value) {
    if (typeof item !== "string") {
      throwInvalidOpSchema(opIndex, `field \"${field}\" must contain only strings`)
    }
  }

  return value
}

function parseOps(value: unknown): ApplyOp[] {
  let rawOps = value
  if (typeof rawOps === "string") {
    try {
      rawOps = JSON.parse(rawOps)
    } catch {
      throwInvalidOpSchema(
        -1,
        'ops must be array or JSON-encoded array string (example: [{"op":"replace_line","target":{"n":1,"h":"aaaaaaaaaa"},"newText":"..."}])',
      )
    }
  }

  if (!Array.isArray(rawOps)) {
    throwInvalidOpSchema(
      -1,
      `ops must be an array of operations (supported ops: ${SUPPORTED_OPS.join(" | ")})`,
    )
  }

  for (let index = 0; index < rawOps.length; index += 1) {
    const opCandidate = rawOps[index] as { op?: unknown }
    if (typeof opCandidate !== "object" || opCandidate === null) {
      throwInvalidOpSchema(index, "operation must be an object")
    }

    if (typeof opCandidate.op !== "string" || !SUPPORTED_OPS.includes(opCandidate.op as (typeof SUPPORTED_OPS)[number])) {
      throwInvalidOpSchema(index, `Unsupported operation: ${String(opCandidate.op)} (supported: ${SUPPORTED_OPS.join(" | ")})`)
    }
  }

  const parsed = opsSchema.safeParse(rawOps)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    const opIndex = typeof issue?.path[0] === "number" ? issue.path[0] : -1
    const fieldPath = issue && issue.path.length > 1 ? issue.path.slice(1).join(".") : undefined
    const reason = fieldPath ? `${fieldPath}: ${issue.message}` : issue?.message ?? "Invalid operation payload"
    throwInvalidOpSchema(opIndex, reason)
  }

  const normalized: ApplyOp[] = []

  for (let index = 0; index < parsed.data.length; index += 1) {
    const op = parsed.data[index]

    if (op.op === "replace_line") {
      const target = parseLineTarget(op.target, index, "target")
      const textCandidate = op.newText ?? op.text ?? op.content ?? op.line
      if (typeof textCandidate !== "string") {
        throwInvalidOpSchema(index, 'replace_line requires a string field: newText|text|content|line')
      }

      normalized.push({
        op: "replace_line",
        target,
        text: textCandidate,
      })
      continue
    }

    if (op.op === "replace_block") {
      normalized.push({
        op: "replace_block",
        start: parseBlockRef(op.start, index, "start"),
        end: parseBlockRef(op.end, index, "end"),
        lines: parseLinesArray(op.lines, index, "lines"),
      })
      continue
    }

    if (op.op === "append_to_file") {
      normalized.push({
        op: "append_to_file",
        lines: parseLinesArray(op.lines, index, "lines"),
      })
      continue
    }

    if (op.op === "set_file") {
      const textCandidate = op.newText ?? op.text ?? op.content ?? op.line
      if (textCandidate !== undefined && op.lines !== undefined) {
        throwInvalidOpSchema(index, 'set_file must specify either "lines" or a text field: newText|text|content|line (not both)')
      }

      if (typeof textCandidate === "string") {
        normalized.push({
          op: "set_file",
          lines: splitLinesCanonical(textCandidate),
        })
        continue
      }

      normalized.push({
        op: "set_file",
        lines: parseLinesArray(op.lines, index, "lines"),
      })
      continue
    }

    throwInvalidOpSchema(index, `Unsupported operation: ${(op as { op: string }).op}`)
  }

  return normalized
}

function arraysEqual(left: string[], right: string[]): boolean {
  if (left.length !== right.length) {
    return false
  }

  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) {
      return false
    }
  }

  return true
}

function isLineTarget(value: BlockRef): value is LineTarget {
  return "n" in value && "h" in value
}

function collectCandidatesByHash(lines: string[], expectedHash: string): Array<{ n: number; h: string; t: string }> {
  const candidates: Array<{ n: number; h: string; t: string }> = []

  for (let index = 0; index < lines.length; index += 1) {
    const actualHash = lineHashHexPrefix(lines[index] ?? "")
    if (actualHash.startsWith(expectedHash.toLowerCase())) {
      candidates.push({
        n: index + 1,
        h: actualHash,
        t: lines[index] ?? "",
      })
    }
  }

  return candidates
}

function makeError(
  pathValue: string,
  code: string,
  message: string,
  currentRev: string | null = null,
) {
  return [
    `ERROR ${code}`,
    `PATH ${pathValue || "-"}`,
    `REV ${currentRev ?? "-"}`,
    `MESSAGE ${message}`,
  ].join("\n")
}

function formatDetail(name: string, value: unknown): string {
  if (value === undefined) {
    return ""
  }
  return `${name} ${inspect(value, { depth: 4, breakLength: 120 })}`
}

function makeConflict(
  pathValue: string,
  currentRev: string,
  details: {
    conflict_kind: string
    failed_op_index: number | null
    reason: string
    expected?: unknown
    actual?: unknown
    context?: unknown
    candidates?: unknown
    hint?: string
  },
) {
  const lines = [
    "CONFLICT",
    `PATH ${pathValue}`,
    `REV ${currentRev}`,
    `CONFLICT_KIND ${details.conflict_kind}`,
    `FAILED_OP_INDEX ${details.failed_op_index ?? "-"}`,
    `MESSAGE ${details.reason}`,
    `HINT ${details.hint ?? "Run hashread to refresh current {n,h} line hashes, then retry with updated targets."}`,
  ]

  const expected = formatDetail("EXPECTED", details.expected)
  const actual = formatDetail("ACTUAL", details.actual)
  const context = formatDetail("CONTEXT", details.context)
  const candidates = formatDetail("CANDIDATES", details.candidates)

  if (expected) lines.push(expected)
  if (actual) lines.push(actual)
  if (context) lines.push(context)
  if (candidates) lines.push(candidates)

  return lines.join("\n")
}

function contextAround(lines: string[], lineNumber: number, contextLines: number) {
  const start = Math.max(1, lineNumber - contextLines)
  const end = Math.min(lines.length, lineNumber + contextLines)
  const chunk = lines.slice(start - 1, end)
  return linesToRecords(chunk, start)
}

function resolveLineTarget(
  target: LineTarget,
  lines: string[],
  pathValue: string,
  currentRev: string,
  opIndex: number,
  contextLines: number,
  label: string,
  safeReapply: boolean,
): { ok: true; index: number; safeReapplied: boolean } | { ok: false; payload: string } {
  const candidates = collectCandidatesByHash(lines, target.h)

  if (target.n < 1 || target.n > lines.length) {
    if (safeReapply && candidates.length === 1) {
      return { ok: true, index: candidates[0].n - 1, safeReapplied: true }
    }

    if (safeReapply && candidates.length > 1) {
      return {
        ok: false,
        payload: makeConflict(pathValue, currentRev, {
          conflict_kind: "AMBIGUOUS_REAPPLY",
          failed_op_index: opIndex,
          reason: `${label} matched multiple candidate lines during safe reapply`,
          expected: { [label]: target },
          actual: { candidate_count: candidates.length },
          candidates,
          hint: "Disable safe_reapply or provide a more specific target hash.",
        }),
      }
    }

    return {
      ok: false,
      payload: makeConflict(pathValue, currentRev, {
        conflict_kind: "TARGET_OUT_OF_RANGE",
        failed_op_index: opIndex,
        reason: `${label} line is out of range`,
        expected: { [label]: target },
        actual: { total_lines: lines.length },
        candidates: safeReapply ? candidates : undefined,
      }),
    }
  }

  const actualText = lines[target.n - 1] ?? ""
  const actualHash = lineHashHexPrefix(actualText)
  if (actualHash.startsWith(target.h.toLowerCase())) {
    return { ok: true, index: target.n - 1, safeReapplied: false }
  }

  if (safeReapply && candidates.length === 1) {
    return { ok: true, index: candidates[0].n - 1, safeReapplied: true }
  }

  if (safeReapply && candidates.length > 1) {
    return {
      ok: false,
      payload: makeConflict(pathValue, currentRev, {
        conflict_kind: "AMBIGUOUS_REAPPLY",
        failed_op_index: opIndex,
        reason: `${label} matched multiple candidate lines during safe reapply`,
        expected: { [label]: target },
        actual: { candidate_count: candidates.length },
        candidates,
        hint: "Disable safe_reapply or provide a more specific target hash.",
      }),
    }
  }

  return {
    ok: false,
    payload: makeConflict(pathValue, currentRev, {
      conflict_kind: "HASH_MISMATCH",
      failed_op_index: opIndex,
      reason: `${label} hash mismatch`,
      expected: { [label]: target },
      actual: {
        actual_at_line: {
          n: target.n,
          h: actualHash,
          tag: `${target.n}L:${actualHash}`,
          t: actualText,
        },
      },
      context: { around_line: contextAround(lines, target.n, contextLines) },
      candidates,
    }),
  }
}

function resolveBlockRef(ref: BlockRef, lines: string[], isStart: boolean): number {
  if (isLineTarget(ref)) {
    return ref.n - 1
  }

  if (ref.kind === "SOF") {
    return 0
  }

  return isStart ? lines.length : lines.length - 1
}

export default tool({
  description: "Apply hash-anchored edits (replace_line | replace_block | append_to_file | set_file) with base_rev, conflict diagnostics, and optional safe reapply",
  args: {
    path: tool.schema.string().optional().describe("Absolute or relative path to file inside worktree"),
    filePath: tool.schema.string().optional().describe("Backward-compatible alias for path"),
    base_rev: tool.schema.string().optional().describe("Canonical file revision from hashread. Required unless auto_base_rev/use_current_rev is enabled"),
    auto_base_rev: tool.schema.boolean().optional().describe("Auto-fill base_rev from current file revision when base_rev is omitted"),
    use_current_rev: tool.schema.boolean().optional().describe("Alias for auto_base_rev"),
    create_if_missing: tool.schema.boolean().optional().describe("Create empty file when missing (requires base_rev unset, empty, or NEW)"),
    ops: opsInputSchema,
    safe_reapply: tool.schema.boolean().optional().describe("Opt-in safe reapply by hash anchors; ambiguous matches fail closed with CONFLICT"),
    return: tool.schema
      .object({
        context_lines: tool.schema.number().int().min(0).max(20).optional(),
        include_changed_block: tool.schema.boolean().optional(),
        include_file_after: tool.schema
          .boolean()
          .optional()
          .describe("Include FILE_AFTER preview (first 200 lines max; emits TRUNCATED true when clipped)"),
      })
      .describe("Top-level response options. Do not place this field inside ops items")
      .optional(),
  },
  async execute(args, context) {
    const requestedPath = args.path ?? args.filePath
    if (!requestedPath || requestedPath.trim().length === 0) {
      throwToolError("INVALID_FILE_PATH", "path/filePath must be a non-empty file path")
    }

    const operations = parseOps(args.ops)
    const baseRev = args.base_rev
    const autoBaseRev = args.auto_base_rev ?? args.use_current_rev ?? false
    const createIfMissing = args.create_if_missing ?? false
    const safeReapply = args.safe_reapply ?? false

    let absolutePath: string
    try {
      absolutePath = ensureInsideWorktree(requestedPath, context.worktree)
    } catch (error) {
      const maybeError = error as Error & { code?: string }
      return makeError(requestedPath, maybeError.code ?? "PATH_OUTSIDE_WORKTREE", maybeError.message)
    }

    const safePath = toWorkspacePath(absolutePath, context.worktree)

    let fileBytes: Buffer
    let created = false
    try {
      fileBytes = await fs.readFile(absolutePath)
    } catch (error) {
      const maybeError = error as NodeJS.ErrnoException
      if (maybeError.code === "ENOENT") {
        if (!createIfMissing) {
          return makeError(safePath, "NOT_FOUND", `File not found: ${safePath}`)
        }
        fileBytes = Buffer.from("", "utf8")
        created = true
      } else if (maybeError.code === "EISDIR") {
        return makeError(safePath, "FILEPATH_IS_DIRECTORY", `Path points to a directory, expected file: ${safePath}`)
      } else {
        return makeError(safePath, maybeError.code ?? "READ_FAILED", maybeError.message)
      }
    }

    const byteLimit = resolveEffectiveByteLimit(fileBytes.length)
    if (fileBytes.length > byteLimit.hardCapBytes) {
      return makeFileTooLargeError(safePath, fileBytes.length, byteLimit.hardCapBytes, null, "Split the file or apply edits in smaller chunks, then retry")
    }

    const lineEnding = detectLineEnding(fileBytes)

    let text: string
    try {
      text = decodeUtf8OrThrow(fileBytes)
    } catch (error) {
      const maybeError = error as Error & { code?: string }
      return makeError(safePath, maybeError.code ?? "BINARY_FILE_UNSUPPORTED", maybeError.message)
    }

    const baseLines = splitLinesCanonical(text)
    const currentRev = fileRevCanonical(baseLines)

    const resolveBaseRev = (): BaseRevResolution => {
      if (typeof baseRev === "string" && baseRev.length > 0) {
        return {
          effectiveBaseRev: baseRev,
          usedAutoBaseRev: false,
        }
      }

      if (!autoBaseRev) {
        return {
          effectiveBaseRev: undefined,
          usedAutoBaseRev: false,
        }
      }

      return {
        effectiveBaseRev: created ? "NEW" : currentRev,
        usedAutoBaseRev: true,
      }
    }

    const { effectiveBaseRev, usedAutoBaseRev } = resolveBaseRev()

    if (!effectiveBaseRev && !created) {
      return makeError(safePath, "BASE_REV_MISSING", "base_rev is required", currentRev)
    }

    if (created && effectiveBaseRev && effectiveBaseRev !== "NEW") {
      return makeConflict(safePath, currentRev, {
        conflict_kind: "CREATE_BASE_REV_MISMATCH",
        failed_op_index: null,
        reason: "base_rev mismatch for create_if_missing",
        expected: { base_rev: "NEW" },
        actual: { base_rev: effectiveBaseRev },
      })
    }

    if (!created && effectiveBaseRev && currentRev !== effectiveBaseRev) {
      return makeConflict(safePath, currentRev, {
        conflict_kind: "BASE_REV_MISMATCH",
        failed_op_index: null,
        reason: "base_rev mismatch",
        expected: { base_rev: effectiveBaseRev },
        actual: { current_rev: currentRev },
      })
    }

    const contextLines = args.return?.context_lines ?? 1
    const includeChangedBlock = args.return?.include_changed_block ?? true
    const includeFileAfter = args.return?.include_file_after ?? false

    const plans: ApplyPlan[] = []

    const setFileCount = operations.filter((operation) => operation.op === "set_file").length
    if (setFileCount > 0 && operations.length > 1) {
      return makeError(safePath, "INVALID_OP_COMBINATION", "set_file cannot be combined with other operations", currentRev)
    }

    for (let index = 0; index < operations.length; index += 1) {
      const operation = operations[index]

      if (operation.op === "replace_line") {
        const resolved = resolveLineTarget(
          operation.target,
          baseLines,
          safePath,
          currentRev,
          index,
          contextLines,
          "target",
          safeReapply,
        )
        if (!resolved.ok) {
          return resolved.payload
        }

        plans.push({
          sourceIndex: index,
          op: operation,
          start: resolved.index,
          end: resolved.index,
          replacement: [operation.text],
          lineDelta: 0,
          didChange: (baseLines[resolved.index] ?? "") !== operation.text,
          safeReapplied: resolved.safeReapplied,
        })
        continue
      }

      if (operation.op === "append_to_file") {
        plans.push({
          sourceIndex: index,
          op: operation,
          start: baseLines.length,
          end: baseLines.length - 1,
          replacement: operation.lines,
          lineDelta: operation.lines.length,
          didChange: operation.lines.length > 0,
          safeReapplied: false,
        })
        continue
      }

      if (operation.op === "set_file") {
        plans.push({
          sourceIndex: index,
          op: operation,
          start: 0,
          end: baseLines.length - 1,
          replacement: operation.lines,
          lineDelta: operation.lines.length - baseLines.length,
          didChange: !arraysEqual(baseLines, operation.lines),
          safeReapplied: false,
        })
        continue
      }

      const startLineCheck = isLineTarget(operation.start)
        ? resolveLineTarget(operation.start, baseLines, safePath, currentRev, index, contextLines, "start", safeReapply)
        : null
      if (startLineCheck && !startLineCheck.ok) {
        return startLineCheck.payload
      }

      const endLineCheck = isLineTarget(operation.end)
        ? resolveLineTarget(operation.end, baseLines, safePath, currentRev, index, contextLines, "end", safeReapply)
        : null
      if (endLineCheck && !endLineCheck.ok) {
        return endLineCheck.payload
      }

      const startIndex = startLineCheck && startLineCheck.ok ? startLineCheck.index : resolveBlockRef(operation.start, baseLines, true)
      const endIndex = endLineCheck && endLineCheck.ok ? endLineCheck.index : resolveBlockRef(operation.end, baseLines, false)

      if (endIndex < startIndex - 1) {
        return makeConflict(safePath, currentRev, {
          conflict_kind: "INVALID_BLOCK_RANGE",
          failed_op_index: index,
          reason: "invalid replace_block range",
          expected: { start: operation.start, end: operation.end },
          actual: { start_index: startIndex, end_index: endIndex },
        })
      }

      const deleteCount = Math.max(0, endIndex - startIndex + 1)
      plans.push({
        sourceIndex: index,
        op: operation,
        start: startIndex,
        end: endIndex,
        replacement: operation.lines,
        lineDelta: operation.lines.length - deleteCount,
        didChange: !arraysEqual(baseLines.slice(startIndex, startIndex + deleteCount), operation.lines),
        safeReapplied: Boolean((startLineCheck && startLineCheck.ok && startLineCheck.safeReapplied) || (endLineCheck && endLineCheck.ok && endLineCheck.safeReapplied)),
      })
    }

    const overlappingPlans = [...plans]
      .sort((left, right) => left.start - right.start || left.end - right.end)
      .filter((plan) => plan.end >= plan.start)

    for (let index = 1; index < overlappingPlans.length; index += 1) {
      const prev = overlappingPlans[index - 1]
      const current = overlappingPlans[index]
      if (current.start <= prev.end) {
        return makeError(safePath, "OVERLAPPING_OPS", "Overlapping replace operations are not allowed", currentRev)
      }
    }

    const applyOrder = [...plans].sort((left, right) => right.start - left.start || right.sourceIndex - left.sourceIndex)
    const nextLines = [...baseLines]

    for (const plan of applyOrder) {
      const deleteCount = Math.max(0, plan.end - plan.start + 1)
      nextLines.splice(plan.start, deleteCount, ...plan.replacement)
    }

    try {
      await fs.writeFile(absolutePath, joinWithLineEnding(nextLines, lineEnding), "utf8")
    } catch (error) {
      const maybeError = error as NodeJS.ErrnoException
      if (maybeError.code === "ENOENT") {
        return makeError(safePath, "PARENT_NOT_FOUND", `Parent directory does not exist for: ${safePath}`, currentRev)
      }
      if (maybeError.code === "EISDIR") {
        return makeError(safePath, "FILEPATH_IS_DIRECTORY", `Path points to a directory, expected file: ${safePath}`, currentRev)
      }
      return makeError(safePath, maybeError.code ?? "WRITE_FAILED", `Failed to write file: ${safePath}`, currentRev)
    }

    const newRev = fileRevCanonical(nextLines)

    const sortedPlans = [...plans].sort((left, right) => left.sourceIndex - right.sourceIndex)
    const opLines = sortedPlans.map(
      (plan) => `OP ${plan.sourceIndex} ${plan.op.op} OK line_delta=${plan.lineDelta} no_op=${!plan.didChange} safe_reapplied=${plan.safeReapplied}`,
    )

    const output = [
      "OK",
      `PATH ${safePath}`,
      `REV_BEFORE ${currentRev}`,
      `REV_AFTER ${newRev}`,
      `OPS ${opLines.length}`,
      ...(usedAutoBaseRev ? ["AUTO_BASE_REV true"] : []),
      ...(created ? ["CREATED true"] : []),
      ...(currentRev === newRev ? ["NO_OP true"] : []),
      ...opLines,
    ]

    if (includeChangedBlock) {
      for (const plan of sortedPlans) {
        const beforeStart = Math.max(0, plan.start - contextLines)
        const before = nextLines.slice(beforeStart, plan.start)
        const block = nextLines.slice(plan.start, Math.min(nextLines.length, plan.start + Math.max(plan.replacement.length, 1)))
        const after = nextLines.slice(plan.start + block.length, plan.start + block.length + contextLines)

        output.push("---")
        output.push(`CHANGED_OP ${plan.sourceIndex}`)
        output.push("CHANGED_BEFORE")
        output.push(...formatLineRecords(linesToRecords(before, beforeStart + 1)))
        output.push("CHANGED_BLOCK")
        output.push(...formatLineRecords(linesToRecords(block, plan.start + 1)))
        output.push("CHANGED_AFTER")
        output.push(...formatLineRecords(linesToRecords(after, plan.start + block.length + 1)))
      }
    }

    if (includeFileAfter) {
      output.push("---")
      output.push("FILE_AFTER")
      const fileAfterLines = nextLines.slice(0, MAX_FILE_AFTER_LINES)
      output.push(...formatLineRecords(linesToRecords(fileAfterLines)))
      if (nextLines.length > MAX_FILE_AFTER_LINES) {
        output.push("TRUNCATED true")
        output.push(`HINT FILE_AFTER was truncated to first ${MAX_FILE_AFTER_LINES} lines out of ${nextLines.length}`)
      }
    }

    return output.join("\n")
  },
})