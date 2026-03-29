# Project Skills Guide

This guide is only for project-local skills that live inside a real project under:

```text
.opencode/skills/<skill-name>/
```

Do not use this guide for package templates in `templates/skills/**`.

## What `skill-authoring` manages

For project-local skills, `skill-authoring` is responsible for:

- creating a new skill from project requirements
- validating an existing skill against realistic project tasks
- refining the skill until content quality and trigger quality are acceptable
- persisting eval inputs, metrics, diagnoses, and iteration history under `ai-docs/skill-authoring/**`

Source of truth for the skill is the project-local folder:

```text
.opencode/skills/<skill-name>/
```

Do not treat `~/.opencode` as the edit target for project-local refinement.

## Required directories

Assume the project root contains:

```text
<project-root>/
  .opencode/
    skills/
      <skill-name>/
        SKILL.md
  ai-docs/
    skill-authoring/
      workspaces/
      runs/
```

`skill-authoring` should keep durable artifacts here:

- workspace spec:
  `ai-docs/skill-authoring/workspaces/<skill-slug>/`
- run outputs:
  `ai-docs/skill-authoring/runs/<run-id>/`

## What goes into a workspace

Each skill should have one stable workspace:

```text
ai-docs/skill-authoring/workspaces/<skill-slug>/
  request.md
  evals/
    content-evals.json
    trigger-evals.json
    prompts/
    fixtures/
```

Purpose of each file:

- `request.md`
  Human-readable contract for the skill: target behavior, non-trigger behavior, expected artifacts, risks, assumptions.
- `content-evals.json`
  Behavior checks for the skill body.
- `trigger-evals.json`
  Positive and negative trigger checks for the frontmatter `description`.
- `prompts/`
  Concrete task prompts fed into OpenCode during content eval.
- `fixtures/`
  Small project snapshots copied for each eval case.

## Where fixtures come from

For project-local skills, fixtures should come from the real project, not from a generic template repo.

Use one of these approaches:

1. Minimal project slice
   Copy only the files needed to make the task realistic.

2. Synthetic mini-project
   Create a tiny project that matches the real project conventions.

3. Multiple focused fixtures
   Use different fixtures for different flows if one workspace cannot represent them cleanly.

### Fixture rules

- Keep fixtures small enough to copy quickly.
- Include only files relevant to the skill behavior.
- Keep paths realistic.
- Exclude `node_modules`, build outputs, secrets, credentials, and unrelated large assets.
- If the skill depends on repo conventions, include the relevant config files.

### Angular example

For a project skill like `angular-component`, a useful fixture often includes:

```text
fixtures/angular-app/
  package.json
  angular.json
  tsconfig.json
  src/
    app/
      app.config.ts
      shared/
      features/
```

That is enough to test path selection, file naming, component structure, and local conventions.

## How to create a new project skill

### Step 1: start in the project root

Open OpenCode in the real project root, not in this package repository.

### Step 2: ask for creation

Use `/skill-authoring` and tell it to create the skill inside `.opencode/skills/<skill-name>`.

Example:

```text
/skill-authoring create .opencode/skills/angular-component from requirements: "Create Angular components that follow our standalone-component conventions, file layout, tests, and naming rules. The skill should generate component, template, style, and spec files in the correct feature folder."
```

### Step 3: force workspace preparation

If the first request did not explicitly ask for eval assets, follow with:

```text
/skill-authoring improve .opencode/skills/angular-component. Create or update ai-docs/skill-authoring/workspaces/angular-component/request.md, content-evals.json, trigger-evals.json, prompts, and fixtures before running any refinement loop.
```

### Step 4: verify created files

After the first pass, confirm these exist:

- `.opencode/skills/angular-component/SKILL.md`
- `ai-docs/skill-authoring/workspaces/angular-component/request.md`
- `ai-docs/skill-authoring/workspaces/angular-component/evals/content-evals.json`
- `ai-docs/skill-authoring/workspaces/angular-component/evals/trigger-evals.json`

## How to validate an existing project skill

Use this when the skill already exists under `.opencode/skills/**`.

### Step 1: point to the target skill and workspace

Example:

```text
/skill-authoring check .opencode/skills/angular-component. Use workspace ai-docs/skill-authoring/workspaces/angular-component. Load request from ai-docs/skill-authoring/workspaces/angular-component/request.md. Use content evals from ai-docs/skill-authoring/workspaces/angular-component/evals/content-evals.json and trigger evals from ai-docs/skill-authoring/workspaces/angular-component/evals/trigger-evals.json. Persist all outputs under ai-docs/skill-authoring/runs.
```

### Step 2: inspect the latest run

Open the newest run directory under:

```text
ai-docs/skill-authoring/runs/<run-id>/
```

Important files:

- `run.json`
- `timeline.md`
- `iteration-*/candidate-summary.json`
- `iteration-*/diagnosis.json`
- `iteration-*/trigger-loop/results.json`

### Step 3: judge the outcome

Use these meanings:

- `passed_threshold`
  The current skill passed the configured checks.
- `needs_another_refinement_cycle`
  The skill improved, but quality is still not good enough.
- `no_meaningful_progress`
  The loop stalled; the next fix likely needs better evals, better requirements, or a routing-level change.

## How to improve an existing project skill

Use this when the skill exists and the previous run found weaknesses.

Command pattern:

```text
/skill-authoring improve .opencode/skills/<skill-name>. Use the existing workspace under ai-docs/skill-authoring/workspaces/<skill-name>. Read the latest run under ai-docs/skill-authoring/runs. If the diagnosis shows real issues, update the project-local skill and rerun the same eval sets until the threshold is reached or there is no meaningful progress.
```

What should change during this loop:

- `SKILL.md` in `.opencode/skills/<skill-name>/`
- possibly new references or helper scripts bundled with that skill
- run artifacts under `ai-docs/skill-authoring/runs/<run-id>/`

What should not be the edit target:

- `~/.opencode`

## How to write `request.md`

`request.md` should answer:

- What should this skill do?
- When should it trigger?
- When must it not trigger?
- What files or outputs should it produce?
- What bad behavior is unacceptable?
- What project conventions must it follow?

Recommended structure:

```md
# Skill Authoring Request: angular-component

## Goal

Create and refine a project-local skill for generating Angular components.

## Target skill

- Path: `.opencode/skills/angular-component/SKILL.md`
- Skill name: `angular-component`

## Intended behavior

- Creates component files in the correct feature folder
- Uses standalone component conventions
- Adds matching template, styles, and tests

## Non-trigger behavior

- Does not trigger for generic Angular explanations
- Does not trigger for backend work

## Seed test values

- Create a user-profile badge component in `src/app/features/profile/`
- Add a standalone audit-log table component
```

## How to write content evals

Use content evals to test the skill body.

Store them here:

```text
ai-docs/skill-authoring/workspaces/<skill-slug>/evals/content-evals.json
```

Each case should define:

- prompt
- fixture
- expected files
- required skills
- forbidden skills
- assertions

Minimal example:

```json
{
  "skill": "angular-component",
  "agent": "build/dev",
  "threshold": 0.9,
  "cases": [
    {
      "id": "create-profile-badge",
      "promptFile": "prompts/create-profile-badge.md",
      "fixtureDir": "fixtures/angular-app",
      "attachments": [],
      "expectedFiles": [
        "src/app/features/profile/profile-badge/profile-badge.component.ts",
        "src/app/features/profile/profile-badge/profile-badge.component.html",
        "src/app/features/profile/profile-badge/profile-badge.component.spec.ts"
      ],
      "requiredSkills": ["angular-component"],
      "forbiddenSkills": [],
      "allowedSkills": ["angular-component"],
      "strictUnexpectedSkills": false,
      "assertions": [
        {
          "id": "mentions_standalone",
          "kind": "regex_any",
          "description": "Response mentions standalone component behavior",
          "patterns": ["standalone"],
          "weight": 1
        }
      ]
    }
  ]
}
```

## How to write trigger evals

Use trigger evals to test whether the `description` loads the skill in the right situations.

Store them here:

```text
ai-docs/skill-authoring/workspaces/<skill-slug>/evals/trigger-evals.json
```

Include both positive and negative queries.

Minimal example:

```json
{
  "skill": "angular-component",
  "threshold": 0.5,
  "runsPerQuery": 3,
  "queries": [
    {
      "query": "Create a standalone Angular component for the profile badge feature.",
      "shouldTrigger": true
    },
    {
      "query": "Explain what Angular standalone components are.",
      "shouldTrigger": false
    }
  ]
}
```

## Recommended project-skill workflow

Use this order every time:

1. Capture requirements in `request.md`.
2. Create or update the project-local skill in `.opencode/skills/<skill-name>/`.
3. Build content and trigger eval sets.
4. Prepare small realistic fixtures.
5. Run `/skill-authoring check ...`.
6. Read `timeline.md`, `diagnosis.json`, and trigger results.
7. Run `/skill-authoring improve ...` if quality is insufficient.
8. Stop when threshold is reached or further rewrites stop helping.

## How to read results

### Content pass but trigger fail

Meaning:

- the skill behavior is useful once loaded
- the description is too broad or too vague

Next step:

- improve frontmatter `description`
- add stronger negative trigger queries

### Trigger pass but content fail

Meaning:

- the skill loads correctly
- the body lacks enough workflow, outputs, constraints, or project detail

Next step:

- strengthen `workflow`
- strengthen `output_requirements`
- add project-specific conventions

### No meaningful progress

Meaning:

- repeated rewrites are not solving the real problem

Next step:

- rewrite the eval set
- improve fixtures
- narrow or split the skill
- check whether the issue is ecosystem routing, not only this skill

## Good prompts for OpenCode

Creation:

```text
/skill-authoring create .opencode/skills/angular-component from requirements: "Create Angular components that follow our project conventions." Also prepare ai-docs/skill-authoring/workspaces/angular-component with request, evals, prompts, and fixtures.
```

Validation:

```text
/skill-authoring check .opencode/skills/angular-component using ai-docs/skill-authoring/workspaces/angular-component and persist all metrics, diagnoses, and summaries under ai-docs/skill-authoring/runs.
```

Refinement:

```text
/skill-authoring improve .opencode/skills/angular-component using the latest run artifacts. Update the project-local skill, rerun the same evals, and stop only when the threshold is reached or progress stalls.
```

## Final rule

For project-local usage, the skill being authored must live in the project itself under `.opencode/skills/**`, and the proof that it works must live under `ai-docs/skill-authoring/**`.
