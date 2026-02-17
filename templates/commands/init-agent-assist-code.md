---
description: Initialize project-local coder skills per language
agent: build-dev
---
You are implementing a project bootstrap command: /init-agent-assist-code.

Goal: create or update project-local coder skill groups in `.opencode/skills/coder/<lang>/<skill-name>/SKILL.md` for each programming language used in this repository.

Inputs:
- `$ARGUMENTS`: optional comma-separated list of languages to initialize (example: `typescript,csharp`). If empty, auto-detect languages from repository evidence.

Hard requirements:
- Do not reference internal repository examples or templates in your output.
- Do not reference external example repositories or templates in your output.
- Create only project-local artifacts under `.opencode/skills/`.
- Skills must be written as `SKILL.md` with YAML frontmatter + structured tag sections.
- Each skill `name` must match its directory name (`<skill-name>`) and satisfy `^[a-z0-9]+(-[a-z0-9]+)*$`.
- Keep edits minimal and deterministic.

Process:

1) Multi-pass code research (multiple focused scans)
   - Pass A (Language detection): detect languages by file extensions and manifests.
     - `**/*.ts`, `**/*.tsx` => `typescript`
     - `**/*.cs`, `**/*.csproj`, `**/*.sln` => `csharp`
     - `**/*.go` => `go`
     - `**/*.py` => `python`
     - `**/*.java` => `java`
     - `**/*.kt` => `kotlin`
     - `**/*.rs` => `rust`
     - `**/*.php` => `php`
     - `**/*.rb` => `ruby`
   - Pass B (Stack detection): per language, detect frameworks/libs/build/test/runtime/infra from manifests and configs.
   - Pass C (Code style & conventions): detect formatters/linters/codegen/naming rules/strictness from configs.
   - Pass D (Repository conventions): detect folder structure conventions, layering, module boundaries, and local guidelines docs.
   - Pass E (Verification commands): detect canonical lint/typecheck/test/build commands.
   - For each pass, record evidence as file paths with short notes; do not paste large file contents.

2) Technology/config scan targets
   - Node/TS ecosystem: `package.json`, `pnpm-lock.yaml`, `bun.lockb`, `tsconfig.json`, `.eslintrc*`, `eslint.config.*`, `prettier*`, `vitest*`, `jest*`.
   - .NET ecosystem: `*.csproj`, `Directory.Build.props`, `global.json`, `NuGet.config`, `appsettings*.json`.
   - Infra/CI: `Dockerfile*`, `.github/workflows/*`, `gitlab-ci.yml`.

3) Web research (official primary sources only)
   - For each detected language and key technology, gather best practices from official docs/standards/official repositories.
   - For each language/technology area, produce 3-7 practices labeled as `must`, `should`, `must not`.
   - Provide source links in each skill `<sources>` section.

4) Write skills
   - For each language, create or update skills under `.opencode/skills/coder/<lang>/<skill-name>/SKILL.md`.
   - Minimum baseline skills per language:
     - `coder-<lang>-stack`
     - `coder-<lang>-conventions`
     - `coder-<lang>-error-handling`
     - `coder-<lang>-logging`
     - `coder-<lang>-security`
     - `coder-<lang>-performance`
     - `coder-<lang>-testing`
     - `coder-<lang>-async-concurrency`
   - Add framework/library-specific skills when justified by detected stack.

5) Required SKILL.md structure
   - YAML frontmatter:
     - `name: <skill-name>`
     - `description: <short description>`
   - Body must begin with `<skill_overview>` and include:
     - `<purpose>`
     - `<triggers>` with one or more `<trigger>` items
     - `<sources>` with one or more `<source url="...">...</source>` entries
   - Add 2-6 topic sections relevant to the skill.
   - Include `<anti_patterns>` or `<do_not>` where applicable.
   - Include `<update_checklist>` in every skill.

6) Additional mandatory content for `coder-<lang>-stack`
   - `<tech_inventory>`: language, runtime, frameworks, build, test, lint/format, infra.
   - `<repo_evidence>`: file paths used as evidence for detection (paths only, no large content dumps).
   - `<code_style_and_conventions>`: formatter/linter/naming/strictness and evidence paths.
   - `<verification_commands>`: lint/typecheck/test/build command lines.

7) Skill content quality
   - Include 6-12 prioritized principles (`P0`, `P1`, `P2`) across relevant skills.
   - Include 5-10 checklist items in `<update_checklist>`.
   - Keep rules concrete, actionable, and tied to detected stack evidence.

8) Report
   - List created/updated files.
   - Provide a short rerun note (how to run `/init-agent-assist-code` with and without `$ARGUMENTS`).

Output format expectations:
- Print a concise execution log by research pass and language.
- Print the final file tree for `.opencode/skills/coder/`.
- Print warnings for missing evidence or uncertain detections.
