Ready-made agents and skills for OpenCode, built for developers who want control. You define the goal and constraints, the agent follows rules (skills/Context7/LSP), and you run the loop: generate → run → fix → verify.
Installs into `~/.opencode/`:
- `agents/` — roles
- `skills/` — playbooks
- `keys/` and `opencode.jsonc` — keys + global config

> [!WARNING]
> IMPORTANT: this is an early test version; if something is off, feel free to open an issue/PR.

## Install / update

```bash
npx -g @ozerohax/assistagents@0.1.1
```

In the TUI you:
- choose languages for `skills/coder/*` (currently: TypeScript, Rust, C#)
- enter the preferred response language (default: English)
- decide whether to make a zip backup and where to store it
- enter/update keys (if a key file is empty it asks; if it is filled it asks to keep or overwrite)

### Quickstart
1) State the goal in one sentence: what to build + constraints + done criteria.
2) Run `planning/plan`: ask for a short plan, file list, risks, and what to test.
3) Run `build/dev`: implement the plan with minimal changes, no "fix everything nearby".
4) Run the project/build locally and capture the error/log.
5) Paste the error into `build/dev` (verbatim) and ask for a minimal fix + root cause.
6) Run `test/tester`: ask to cover done criteria with tests/manual checks.
7) Run `review/reviewer`: review correctness/security/tests and risk points.
8) Repeat `build/dev → test → review` in short loops until it is boring.

### Choosing an agent
- `build/dev` — change code
- `planning/plan` — reduce risk before edits
- `review/reviewer` — safety check
- `test/tester` — manual/API/browser verification
- `ask/ask` — quick answers or research

## What gets installed

Target structure:

- `~/.opencode/agents/` — agent definitions (YAML frontmatter + instructions)
- `~/.opencode/skills/` — skills (structured instructions/playbooks)
- `~/.opencode/keys/` — provider keys (files)
- `~/.opencode/opencode.jsonc` — OpenCode global config that references key files

## Agents (templates/agents)

Short list of roles the pack ships:

- `build/dev` — implementation/refactor/fixes, strict skills/Context7/LSP
- `planning/plan` and `planning/project` — read-only planning
- `review/reviewer` — correctness/security/tests review
- `test/tester` — manual/API/browser verification
- `ask/ask` + `assist/research/*` — Q&A and delegated research

## Skills (templates/skills)

Skills are playbooks agents load before work. Main groups: `planning/*`, `research-strategy/*`, `review/*`, `testing/*`, `coder/<language>/*` (selected in the TUI).

Note: if a skill is missing for a technology, the agent should say so and proceed cautiously.
