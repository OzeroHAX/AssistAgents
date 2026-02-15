import { afterEach, beforeAll, expect, mock, test } from "bun:test"
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import path from "node:path"

let hashedit: { execute: (args: any, context: any) => Promise<string>; args: Record<string, unknown> }
let hashgrep: { execute: (args: any, context: any) => Promise<string>; args: Record<string, unknown> }
let hashread: { execute: (args: any, context: any) => Promise<string>; args: Record<string, unknown> }

const worktree = process.cwd()
const context = { worktree } as const
const tempDirs: string[] = []

function toRelative(filePath: string): string {
  return path.relative(worktree, filePath)
}

async function createTempFile(content: string): Promise<string> {
  const tempDir = await mkdtemp(path.join(worktree, ".tmp-hash-tools-test-"))
  tempDirs.push(tempDir)
  const filePath = path.join(tempDir, "sample.txt")
  await writeFile(filePath, content, "utf8")
  return filePath
}

function makeNumberedLines(count: number, prefix = "line"): string {
  return Array.from({ length: count }, (_, index) => `${prefix}-${index + 1}`).join("\n") + "\n"
}

async function runRead(args: Record<string, unknown>) {
  return hashread.execute(args as any, context as any)
}

async function runApply(args: Record<string, unknown>) {
  return hashedit.execute(args as any, context as any)
}

async function runGrep(args: Record<string, unknown>) {
  return hashgrep.execute(args as any, context as any)
}

function extractLineRecords(payload: string): Array<{ n: number; h: string; t: string }> {
  const records: Array<{ n: number; h: string; t: string }> = []
  for (const line of payload.split("\n")) {
    const match = line.match(/^(\d+)L:([a-f0-9]{10,16})\s(.*)$/)
    if (!match) {
      continue
    }
    records.push({
      n: Number(match[1]),
      h: match[2],
      t: match[3] ?? "",
    })
  }
  return records
}

function headerValue(payload: string, key: string): string | null {
  const line = payload.split("\n").find((item) => item.startsWith(`${key} `))
  return line ? line.slice(key.length + 1) : null
}

beforeAll(async () => {
  const makeChain = () => {
    const chain: Record<string, (...args: unknown[]) => unknown> = {}
    const methods = [
      "optional",
      "describe",
      "int",
      "min",
      "max",
      "positive",
      "regex",
      "strict",
      "default",
      "transform",
      "refine",
      "superRefine",
      "catch",
    ]

    for (const method of methods) {
      chain[method] = () => chain
    }

    chain.parse = (value: unknown) => value
    chain.safeParse = (value: unknown) => {
      if (Array.isArray(value)) {
        const invalidIndex = value.findIndex((item) => {
          if (!item || typeof item !== "object") return false
          if (!("lines" in item)) return false
          const maybeLines = (item as { lines?: unknown }).lines
          return maybeLines !== undefined && !Array.isArray(maybeLines)
        })

        if (invalidIndex !== -1) {
          return {
            success: false,
            error: {
              issues: [{ path: [invalidIndex, "lines"], message: "Expected array" }],
            },
          }
        }
      }

      return { success: true, data: value }
    }
    return chain
  }

  const schema = {
    string: () => makeChain(),
    number: () => makeChain(),
    boolean: () => makeChain(),
    object: () => makeChain(),
    array: () => makeChain(),
    enum: () => makeChain(),
    literal: () => makeChain(),
    union: () => makeChain(),
    discriminatedUnion: () => makeChain(),
    unknown: () => makeChain(),
    any: () => makeChain(),
  }

  mock.module("@opencode-ai/plugin", () => ({
    tool: Object.assign((definition: unknown) => definition, { schema }),
  }))

  ;({ default: hashedit } = await import("../templates/tools/hashedit.ts"))
  ;({ default: hashgrep } = await import("../templates/tools/hashgrep.ts"))
  ;({ default: hashread } = await import("../templates/tools/hashread.ts"))
})

afterEach(async () => {
  while (tempDirs.length > 0) {
    const tempDir = tempDirs.pop()
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true })
    }
  }
})

test("tool contracts do not expose maxBytes argument", () => {
  expect(Object.keys(hashread.args)).not.toContain("maxBytes")
  expect(Object.keys(hashgrep.args)).not.toContain("maxBytes")
  expect(Object.keys(hashedit.args)).not.toContain("maxBytes")
})

test("read returns canonical metadata for empty file", async () => {
  const filePath = await createTempFile("")
  const result = await runRead({ path: toRelative(filePath) })

  expect(result.startsWith("OK\n")).toBe(true)
  expect(headerValue(result, "TOTAL_LINES")).toBe("0")
  expect(headerValue(result, "ENCODING")).toBe("utf-8")
  expect(headerValue(result, "LINE_ENDING")).toBe("LF")
  expect(extractLineRecords(result)).toEqual([])
})

test("read handles UTF-8 and keeps line hashes stable", async () => {
  const filePath = await createTempFile("привет\nмир\n")

  const first = await runRead({ path: toRelative(filePath), offset: 0, limit: 10 })
  const second = await runRead({ path: toRelative(filePath), offset: 0, limit: 10 })

  const firstLines = extractLineRecords(first)
  const secondLines = extractLineRecords(second)

  expect(first.startsWith("OK\n")).toBe(true)
  expect(firstLines).toHaveLength(2)
  expect(firstLines[0]?.h).toMatch(/^[a-f0-9]{10,16}$/)
  expect(firstLines[1]?.h).toMatch(/^[a-f0-9]{10,16}$/)
  expect(firstLines[0]?.h).toBe(secondLines[0]?.h)
  expect(firstLines[1]?.h).toBe(secondLines[1]?.h)
})

test("read is capped to 200 returned lines", async () => {
  const filePath = await createTempFile(makeNumberedLines(350, "row"))
  const byLimit = await runRead({ path: toRelative(filePath), limit: 500 })
  const byRange = await runRead({ path: toRelative(filePath), startLine: 1, endLine: 350 })

  expect(extractLineRecords(byLimit)).toHaveLength(200)
  expect(extractLineRecords(byRange)).toHaveLength(200)
  expect(headerValue(byLimit, "RANGE")).toContain("limit=200")
})

test("apply replace_line updates one line and returns new rev", async () => {
  const filePath = await createTempFile("one\ntwo\n")
  const before = await runRead({ path: toRelative(filePath) })
  const line2 = extractLineRecords(before).find((line) => line.n === 2)

  const applied = await runApply({
    path: toRelative(filePath),
    base_rev: headerValue(before, "REV"),
    ops: [{ op: "replace_line", target: { n: 2, h: line2?.h }, text: "TWO" }],
  })

  expect(applied.startsWith("OK\n")).toBe(true)
  expect(headerValue(applied, "REV_BEFORE")).toBe(headerValue(before, "REV"))
  expect(headerValue(applied, "REV_AFTER")).not.toBe(headerValue(before, "REV"))
  expect(applied).toContain("OP 0 replace_line OK line_delta=0 no_op=false")

  const content = await readFile(filePath, "utf8")
  expect(content).toBe("one\nTWO")
})

test("apply replace_block updates range and reports line_delta", async () => {
  const filePath = await createTempFile("a\nb\nc\nd\n")
  const before = await runRead({ path: toRelative(filePath) })
  const records = extractLineRecords(before)
  const line2 = records.find((line) => line.n === 2)
  const line3 = records.find((line) => line.n === 3)

  const applied = await runApply({
    path: toRelative(filePath),
    base_rev: headerValue(before, "REV"),
    ops: [
      {
        op: "replace_block",
        start: { n: 2, h: line2?.h },
        end: { n: 3, h: line3?.h },
        lines: ["B", "C", "X"],
      },
    ],
  })

  expect(applied.startsWith("OK\n")).toBe(true)
  expect(applied).toContain("OP 0 replace_block OK line_delta=1 no_op=false")

  const content = await readFile(filePath, "utf8")
  expect(content).toBe("a\nB\nC\nX\nd")
})

test("apply returns CONFLICT when file changes after read", async () => {
  const filePath = await createTempFile("alpha\nbeta\n")
  const before = await runRead({ path: toRelative(filePath) })
  await writeFile(filePath, "alpha\nchanged\n", "utf8")

  const conflict = await runApply({
    path: toRelative(filePath),
    base_rev: headerValue(before, "REV"),
    ops: [{ op: "replace_block", start: { kind: "SOF" }, end: { kind: "EOF" }, lines: ["x"] }],
  })

  expect(conflict.startsWith("CONFLICT\n")).toBe(true)
  expect(headerValue(conflict, "REV")).toMatch(/^[a-f0-9]{64}$/)
  expect(conflict).toContain("CONFLICT_KIND BASE_REV_MISMATCH")
  expect(conflict).toContain("HINT Run hashread")
})

test("invalid op payload still throws INVALID_OP_SCHEMA", async () => {
  const filePath = await createTempFile("one\n")
  const before = await runRead({ path: toRelative(filePath) })

  await expect(
    hashedit.execute(
      {
        path: toRelative(filePath),
        base_rev: headerValue(before, "REV"),
        ops: [{ op: "replace_block", start: { kind: "SOF" }, end: { kind: "EOF" }, lines: "not-array" }],
      } as any,
      context as any,
    ),
  ).rejects.toMatchObject({ code: "INVALID_OP_SCHEMA" })
})

test("grep can return apply-ready targets", async () => {
  const filePath = await createTempFile("foo\nbar\nfoo\n")
  const result = await runGrep({
    filePath: toRelative(filePath),
    query: "foo",
    wantTargets: true,
  })

  expect(result.startsWith("OK\n")).toBe(true)
  expect(headerValue(result, "MATCH_COUNT")).toBe("2")
  const targets = result
    .split("\n")
    .filter((line) => line.startsWith("TARGET n="))
    .map((line) => {
      const match = line.match(/^TARGET n=(\d+) h=([a-f0-9]{10,16})$/)
      return match ? { n: Number(match[1]), h: match[2] } : null
    })
    .filter((item): item is { n: number; h: string } => item !== null)

  expect(targets).toHaveLength(2)
  expect(targets[0]?.n).toBe(1)
  expect(targets[1]?.n).toBe(3)
})

test("grep enforces 200 code-line cap and marks TRUNCATED", async () => {
  const filePath = await createTempFile(makeNumberedLines(260, "foo"))

  const noContext = await runGrep({
    filePath: toRelative(filePath),
    query: "foo-",
    mode: "literal",
    maxMatches: 260,
  })

  const withContext = await runGrep({
    filePath: toRelative(filePath),
    query: "foo-",
    mode: "literal",
    maxMatches: 260,
    contextLines: 2,
  })

  expect(extractLineRecords(noContext)).toHaveLength(200)
  expect(headerValue(noContext, "TRUNCATED")).toBe("true")
  expect(extractLineRecords(withContext).length).toBeLessThanOrEqual(200)
  expect(headerValue(withContext, "TRUNCATED")).toBe("true")
})

test("grep regex supports quantifiers in raw and slash forms", async () => {
  const filePath = await createTempFile("a\naa\naaa\naaaa\nb\n")
  const raw = await runGrep({
    filePath: toRelative(filePath),
    mode: "regex",
    query: "a{2,4}",
    maxMatches: 10,
  })
  const slash = await runGrep({
    filePath: toRelative(filePath),
    mode: "regex",
    query: "/^a{3}$/",
    maxMatches: 10,
  })

  expect(raw.startsWith("OK\n")).toBe(true)
  expect(headerValue(raw, "MATCH_COUNT")).toBe("3")
  expect(slash.startsWith("OK\n")).toBe(true)
  expect(headerValue(slash, "MATCH_COUNT")).toBe("1")
})

test("grep returns INVALID_REGEX with details", async () => {
  const filePath = await createTempFile("abc\n")
  const invalid = await runGrep({
    filePath: toRelative(filePath),
    mode: "regex",
    query: "/a/z",
  })

  expect(invalid.startsWith("ERROR INVALID_REGEX\n")).toBe(true)
  expect(invalid).toContain("MESSAGE Invalid regex")
})

test("apply can create missing file with create_if_missing", async () => {
  const tempDir = await mkdtemp(path.join(worktree, ".tmp-hash-tools-test-"))
  tempDirs.push(tempDir)
  const filePath = path.join(tempDir, "new.txt")

  const applied = await runApply({
    path: toRelative(filePath),
    base_rev: "NEW",
    create_if_missing: true,
    ops: [{ op: "replace_block", start: { kind: "EOF" }, end: { kind: "EOF" }, lines: ["hello"] }],
  })

  expect(applied.startsWith("OK\n")).toBe(true)
  expect(applied).toContain("CREATED true")

  const content = await readFile(filePath, "utf8")
  expect(content).toBe("hello")
})

test("large file above 2MB works without extra params", async () => {
  const row = `row-${"x".repeat(700)}`
  const content = Array.from({ length: 4200 }, () => row).join("\n") + "\n"
  const filePath = await createTempFile(content)

  const readResult = await runRead({ path: toRelative(filePath), limit: 1 })
  expect(readResult.startsWith("OK\n")).toBe(true)

  const grepResult = await runGrep({
    filePath: toRelative(filePath),
    query: "row-",
    mode: "literal",
    maxMatches: 1,
  })
  expect(grepResult.startsWith("OK\n")).toBe(true)

  const firstLine = extractLineRecords(readResult)[0]
  const applyResult = await runApply({
    path: toRelative(filePath),
    auto_base_rev: true,
    ops: [{ op: "replace_line", target: { n: 1, h: firstLine?.h }, text: firstLine?.t ?? row }],
  })
  expect(applyResult.startsWith("OK\n")).toBe(true)
})

test("apply safe_reapply can recover when unique hash target moved", async () => {
  const filePath = await createTempFile("one\ntwo\nthree\n")
  const before = await runRead({ path: toRelative(filePath) })
  const oldLineTwo = extractLineRecords(before).find((line) => line.n === 2)
  await writeFile(filePath, "zero\none\ntwo\nthree\n", "utf8")

  const applied = await runApply({
    path: toRelative(filePath),
    auto_base_rev: true,
    safe_reapply: true,
    ops: [{ op: "replace_line", target: { n: 2, h: oldLineTwo?.h }, text: "TWO" }],
  })

  expect(applied.startsWith("OK\n")).toBe(true)
  expect(applied).toContain("safe_reapplied=true")
  const content = await readFile(filePath, "utf8")
  expect(content).toContain("zero\none\nTWO\nthree")
})

test("apply safe_reapply fails closed on ambiguous hash matches", async () => {
  const filePath = await createTempFile("dup\nmid\ndup\n")
  const before = await runRead({ path: toRelative(filePath) })
  const firstDup = extractLineRecords(before).find((line) => line.n === 1)
  await writeFile(filePath, "zzz\ndup\nmid\ndup\n", "utf8")

  const conflict = await runApply({
    path: toRelative(filePath),
    auto_base_rev: true,
    safe_reapply: true,
    ops: [{ op: "replace_line", target: { n: 1, h: firstDup?.h }, text: "DUP" }],
  })

  expect(conflict.startsWith("CONFLICT\n")).toBe(true)
  expect(conflict).toContain("CONFLICT_KIND AMBIGUOUS_REAPPLY")
  expect(conflict).toContain("FAILED_OP_INDEX 0")
})

test("apply include_file_after is capped to 200 lines", async () => {
  const filePath = await createTempFile(makeNumberedLines(260, "line"))
  const before = await runRead({ path: toRelative(filePath) })
  const firstLine = extractLineRecords(before).find((line) => line.n === 1)

  const applied = await runApply({
    path: toRelative(filePath),
    base_rev: headerValue(before, "REV"),
    ops: [{ op: "replace_line", target: { n: 1, h: firstLine?.h }, text: "line-1" }],
    return: { include_changed_block: false, include_file_after: true },
  })

  expect(applied.startsWith("OK\n")).toBe(true)
  expect(applied).toContain("FILE_AFTER")
  expect(extractLineRecords(applied)).toHaveLength(200)
  expect(headerValue(applied, "TRUNCATED")).toBe("true")
})