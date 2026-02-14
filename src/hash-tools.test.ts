import { afterEach, expect, test } from "bun:test"
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import path from "node:path"

import hashedit from "../.opencode/tools/hashedit.js"
import hashgrep from "../.opencode/tools/hashgrep.js"
import hashread from "../.opencode/tools/hashread.js"

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
  return JSON.parse(await hashread.execute(args as any, context as any))
}

async function runApply(args: Record<string, unknown>) {
  return JSON.parse(await hashedit.execute(args as any, context as any))
}

async function runGrep(args: Record<string, unknown>) {
  return JSON.parse(await hashgrep.execute(args as any, context as any))
}

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

  expect(result.status).toBe("OK")
  expect(result.file.total_lines).toBe(0)
  expect(result.lines).toEqual([])
  expect(typeof result.file.rev).toBe("string")
  expect(result.file.encoding).toBe("utf-8")
  expect(result.file.line_ending).toBe("LF")
})

test("read handles UTF-8 and keeps line hashes stable", async () => {
  const filePath = await createTempFile("привет\nмир\n")

  const first = await runRead({ path: toRelative(filePath), offset: 0, limit: 10 })
  const second = await runRead({ path: toRelative(filePath), offset: 0, limit: 10 })

  expect(first.status).toBe("OK")
  expect(first.lines).toHaveLength(2)
  expect(first.lines[0].tag).toMatch(/^1L:[a-f0-9]{12}$/)
  expect(first.lines[1].tag).toMatch(/^2L:[a-f0-9]{12}$/)
  expect(first.lines[0].h).toBe(second.lines[0].h)
  expect(first.lines[1].h).toBe(second.lines[1].h)
})

test("apply replace_line updates one line and returns new_rev", async () => {
  const filePath = await createTempFile("one\ntwo\n")
  const before = await runRead({ path: toRelative(filePath) })
  const line2 = before.lines.find((line: { n: number }) => line.n === 2)

  const applied = await runApply({
    path: toRelative(filePath),
    base_rev: before.file.rev,
    ops: [{ op: "replace_line", target: { n: 2, h: line2.h }, text: "TWO" }],
  })

  expect(applied.status).toBe("OK")
  expect(applied.new_rev).not.toBe(before.file.rev)
  expect(applied.ops[0].line_delta).toBe(0)

  const content = await readFile(filePath, "utf8")
  expect(content).toBe("one\nTWO")
})

test("apply replace_block updates range and reports line_delta", async () => {
  const filePath = await createTempFile("a\nb\nc\nd\n")
  const before = await runRead({ path: toRelative(filePath) })
  const line2 = before.lines.find((line: { n: number }) => line.n === 2)
  const line3 = before.lines.find((line: { n: number }) => line.n === 3)

  const applied = await runApply({
    path: toRelative(filePath),
    base_rev: before.file.rev,
    ops: [
      {
        op: "replace_block",
        start: { n: 2, h: line2.h },
        end: { n: 3, h: line3.h },
        lines: ["B", "C", "X"],
      },
    ],
  })

  expect(applied.status).toBe("OK")
  expect(applied.ops[0].line_delta).toBe(1)

  const content = await readFile(filePath, "utf8")
  expect(content).toBe("a\nB\nC\nX\nd")
})

test("apply returns CONFLICT when file changes after read", async () => {
  const filePath = await createTempFile("alpha\nbeta\n")
  const before = await runRead({ path: toRelative(filePath) })
  await writeFile(filePath, "alpha\nchanged\n", "utf8")

  const conflict = await runApply({
    path: toRelative(filePath),
    base_rev: before.file.rev,
    ops: [{ op: "replace_block", start: { kind: "SOF" }, end: { kind: "EOF" }, lines: ["x"] }],
  })

  expect(conflict.status).toBe("CONFLICT")
  expect(typeof conflict.current_rev).toBe("string")
})

test("invalid op payload still throws INVALID_OP_SCHEMA", async () => {
  const filePath = await createTempFile("one\n")
  const before = await runRead({ path: toRelative(filePath) })

  await expect(
    hashedit.execute(
      {
        path: toRelative(filePath),
        base_rev: before.file.rev,
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

  expect(result.status).toBe("OK")
  expect(result.matches).toHaveLength(2)
  expect(result.targets).toEqual([
    { n: 1, h: result.matches[0].h },
    { n: 3, h: result.matches[1].h },
  ])
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

  expect(applied.status).toBe("OK")
  expect(applied.created).toBe(true)

  const content = await readFile(filePath, "utf8")
  expect(content).toBe("hello")
})