---
description: Initialize project-local coder skills per language
agent: build/dev
---
You are implementing a project bootstrap command: /init-agent-assist-code.

Mandatory first step:
- Load `skill-authoring`. It is the source of truth for runtime skill layout, `SKILL.md` quality, trigger-oriented descriptions, review criteria, and when one request should split into multiple skills.

Goal: create or update project-local coder skills in `.opencode/skills/<skill-name>/SKILL.md` for each programming language used in this repository.

Inputs:
- `$ARGUMENTS`: optional comma-separated list of languages to initialize (example: `typescript,csharp`). If empty, auto-detect languages from repository evidence.

Hard requirements:
- Do not reference internal repository examples or templates in your output.
- Do not reference external example repositories or templates in your output.
- Create only project-local artifacts under `.opencode/skills/`.
- Use flat OpenCode skill layout: `.opencode/skills/<skill-name>/SKILL.md`.
- Baseline skill names must use the `coder-<lang>-...` pattern.
- Every created or updated skill must pass the `skill-authoring` review workflow before completion.
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
   - Provide source links inside each generated skill according to `skill-authoring`.

4) Plan skill set per language
   - For each language, create or update skills under `.opencode/skills/<skill-name>/SKILL.md`.
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

5) Author skills through `skill-authoring`
   - For each planned skill, follow the `skill-authoring` author workflow instead of restating generic skill methodology here.
   - Use repository evidence and official docs to keep rules concrete and stack-specific.
   - If one planned skill becomes too broad, split it according to `skill-authoring`.

6) Additional mandatory content for `coder-<lang>-stack`
   - `<tech_inventory>`: language, runtime, frameworks, build, test, lint/format, infra.
   - `<repo_evidence>`: file paths used as evidence for detection (paths only, no large content dumps).
   - `<code_style_and_conventions>`: formatter/linter/naming/strictness and evidence paths.
   - `<verification_commands>`: lint/typecheck/test/build command lines.

7) Review and fix
   - Run the `skill-authoring` review workflow on every created or updated skill.
   - Resolve all `critical` and `high` findings before finishing.
   - If evidence is missing for a planned rule, remove or downgrade the claim instead of inventing support.

8) Report
   - List created/updated files.
   - Provide a short rerun note (how to run `/init-agent-assist-code` with and without `$ARGUMENTS`).

Output format expectations:
- Print a concise execution log by research pass and language.
- Print the final file tree for `.opencode/skills/`.
- Print warnings for missing evidence or uncertain detections.
