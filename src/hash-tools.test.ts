import { afterEach, beforeAll, expect, mock, test } from "bun:test"
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import path from "node:path"

let hashedit: { execute: (args: any, context: any) => Promise<string> }
let hashgrep: { execute: (args: any, context: any) => Promise<string> }
let hashread: { execute: (args: any, context: any) => Promise<string> }

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