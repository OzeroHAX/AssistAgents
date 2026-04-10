# Skill-Authoring 指南

本指南描述终端用户如何使用 `/skill-authoring`：它做什么、`command + agent + skill + scripts` 如何分工、会产生哪些文件、静态验证与 trigger 测试如何工作，以及最终应用步骤到底确认什么。

本指南只面向在当前项目中维护 project-local skills 的终端用户，不包含包维护者工作流。

## 安装后的目录布局

假设 AssistAgents 已安装在：

```text
~/.opencode/
```

相关路径：

- project-local skills：`./.opencode/skills/<skill-name>/`
- 全局安装的 `skill-authoring` 脚本：`~/.opencode/skills/skill-authoring/scripts/`
- 交互式运行工件：`./ai-docs/skill-authoring/interactive-runs/`
- 隔离报告工件：`./ai-docs/skill-authoring/test-runs/`

通常你编辑的是当前项目里的本地 skill，而 validator 和 trigger-report scripts 来自全局安装包。

## `/skill-authoring` 的分层结构

`/skill-authoring` 现在分成 4 层：

1. Command
   `/skill-authoring` 是用户入口。你直接在聊天里调用它，不需要手动选择 agent。
2. 专用 agent
   该命令会路由到专用的 `skill-authoring` agent，它负责稳定、低变动的 runtime flow。
3. `skill-authoring` skill
   这个 skill 保存真正的方法论：meaning resolution、quality rules、references policy、preview/apply contract 和 validation expectations。
4. Scripts
   脚本负责可重复的确定性检查，例如 static validation 和 isolated trigger reports。

这个拆分的意义是：

- command 只是入口；
- agent 负责让运行路径稳定；
- skill 负责定义 authoring 规则；
- scripts 负责重复性检查。

## 支持的模式

### 1. 交互式 full mode

这是默认模式。

适合以下需求：

- 澄清需求；
- static validation；
- quality rubric review；
- 保存 interactive run history；
- 生成 prepared proposal package；
- 在合适时准备 trigger 测试。

### 2. 交互式 quick mode

只有在你明确希望速度优先于完整作者流程时才使用。

Quick mode 仍然会：

- 读取 target skill；
- 在修改 target skill 之前展示 preview；
- 要求一个明确的最终决定。

Quick mode 通常会跳过：

- interactive run history；
- static validation；
- rubric scoring；
- prepared trigger tests。

常见触发词：

- `quick`
- `fast`
- `skip validation`
- `no tests`
- `without evaluation`

### 3. Terminal isolated report mode

当你想在聊天外得到可复现的 trigger 报告时，使用这个模式。

该模式：

- 运行 static validation；
- 只运行 trigger eval；
- 将报告写入 `ai-docs/skill-authoring/test-runs/<run-id>/`；
- 可在 run 目录中生成 suggested candidate；
- 永远不会自动覆盖源 skill。

该模式不做后台 content-result evaluation，只做 static validation + trigger evaluation。

## 交互式流程

### 1. 启动命令

你直接在聊天中运行 `/skill-authoring`，例如：

```text
/skill-authoring check .opencode/skills/<skill-name>/SKILL.md
```

命令会自动把请求路由到专用的 authoring agent。

### 2. 解析 action、target、mode 和 meaning source

流程首先解析：

- action：`create`、`check`、`improve` 或 `review`
- target skill path
- mode：`full` 或 `quick`
- meaning source：
  - `explicit_intended_meaning`
  - `partial_intended_meaning`
  - `no_external_meaning`

同时还会判断主要知识形态：

- `inline_contract`
- `local_references`
- `project_references`
- `external_on_demand`
- `deterministic_scripts`

### 3. 只在需要时确认 skill 的含义

如果你在 `check` 或 `improve` 里已经明确写出了这个 skill 应该表达什么，那么系统会直接使用这个 intended meaning，不再额外做 inferred-meaning confirmation。

如果你只给了部分 intended behavior，`skill-authoring` 应先提出少量窄问题进行澄清。

只有在没有可靠外部意义说明时，它才应该：

- 根据现有 skill 文本推断当前含义；
- 明确显示这段解释；
- 询问这是否符合当前 skill 的真实含义。

这个 meaning confirmation 步骤仍然优先使用 `question` UI。

### 4. 在 full mode 下启动 run history

一旦进入深入分析，full mode 会把工件写到：

```text
ai-docs/skill-authoring/interactive-runs/<run-id>/
```

重要边界：

- 在最终决定前，真实 target skill 不会被修改；
- 但 full mode 可以提前把 proposal artifacts 写入 `ai-docs/skill-authoring/**`。

也就是说，full mode 在最终应用前写入 `ai-docs/skill-authoring/**` 是正常行为。保持只读的是目标 skill 本身。

### 5. 分析并准备 proposal package

在 full mode 中，`skill-authoring` 可能准备：

- findings；
- validation reports；
- rubric notes；
- 位于 `after/target-skill.md` 的 prepared draft；
- 位于 `after/tests/` 的 prepared trigger tests；
- proposal summary 和 visible diff artifacts。

对于 reusable skills，full interactive `check` 和 `improve` 通常默认会准备 trigger 测试，除非有明确理由说明这不适用。

这些 prepared trigger tests 会一直留在 run 目录中，直到你选择 `apply`。

### 6. 在聊天中展示 preview

在写入任何 target skill 之前，`skill-authoring` 必须在聊天中展示用户可见的 preview：

- 关键 findings 或 weaknesses；
- prepared proposal 的 scope；
- 精确 diff 或 draft；
- supporting files 的 future apply routes，例如 trigger tests。

Diff 必须出现在用户可见的聊天消息里。Hidden reasoning 不算 preview。

### 7. 最终决定现在只在聊天里进行

在 preview 之后，同一条可见聊天消息应以一个明确的 final decision prompt 结束。

合法的最终结果只有：

- `apply`
- `reject`
- `revise: <extra instructions>`

这个 prompt 必须：

- 明确写出 target skill；
- 给出 prepared draft 的 `from -> to` route；
- 说明 scope 中的其他文件，例如 prepared trigger tests；
- 保持简短；
- 不要重复完整 diff 和长篇 rationale。

不再有第二个 `approve` 步骤。
也不再有最终 `question` 对话框。

### 8. 每个最终结果表示什么

- `apply`
  应用当前 scope 中的整个 prepared proposal package。
- `reject`
  保持 target skill 不变。
- `revise: ...`
  保持同一个 run id，沿用当前 proposal context，修改 prepared draft，而不是开启新一轮运行。

如果 scope 中列出了多个文件，`apply` 会应用全部这些文件，除非你显式缩小 scope。

### 9. 应用并结束

只有在 `apply` 之后，`skill-authoring` 才可以：

- 更新目标 `SKILL.md`；
- 将 prepared trigger tests 复制到 `<skill-dir>/assets/tests/`；
- 完成 `approval.md` 和 `final-summary.md`；
- 在应用结果与已验证 draft 完全一致时，复用已有 validation 结果。

## Run id 与工件布局

Run id 格式：

```text
<utc-timestamp>-<action>-<skill-slug>
```

示例：

```text
20260410T130821Z-check-task-use-research-code-strategy
```

只包含时间戳的 run id 是无效的。

### Full interactive run 目录结构

```text
ai-docs/skill-authoring/interactive-runs/<run-id>/
  request.md
  approval.md
  before/
    target-skill.md
    inferred-summary.md
    validation.json
    validation.md
    verdict.md
  proposal/
    summary.md
    skill.diff.md
  after/
    target-skill.md
    validation.json
    validation.md
    change-plan.md
    tests/
      trigger-evals.json
  final-summary.md
```

### 主要文件含义

- `request.md`
  原始请求以及解析后的上下文。
- `approval.md`
  用户最终的决定和 scope。
- `before/target-skill.md`
  修改前的源 skill 快照。
- `before/inferred-summary.md`
  对当前 skill 含义的推断，以及必要时用户给出的修正。
- `before/validation.json` 与 `before/validation.md`
  当前 source skill 的静态验证结果。
- `before/verdict.md`
  对修改前问题点的简短说明。
- `proposal/summary.md`
  对 proposal 的可读摘要。
- `proposal/skill.diff.md`
  在聊天中展示给用户的精确 diff。
- `after/target-skill.md`
  准备用于应用的 draft。
- `after/validation.json` 与 `after/validation.md`
  prepared draft 的验证结果。
- `after/change-plan.md`
  保存下来的 change plan 与 rationale。
- `after/tests/`
  proposal package 的 canonical prepared tests subtree。
- `final-summary.md`
  最终说明：应用了什么，或者这次运行得出了什么结论。

`proposal/tests/` 已不再是 canonical flow 的一部分。Prepared tests 现在统一放在 `after/tests/`。

## 静态验证

Static validation 是默认的确定性 skill 检查方式。

### 验证已有 skill

```bash
node ~/.opencode/skills/skill-authoring/scripts/content/validate-skill.mjs \
  --skill ./.opencode/skills/<skill-name>/SKILL.md \
  --out ai-docs/skill-authoring/manual-validation/report.json \
  --markdown-out ai-docs/skill-authoring/manual-validation/report.md
```

`--skill` 既可以接收 skill 目录，也可以接收直接的 `SKILL.md` 路径。

### 验证 prepared draft file

```bash
node ~/.opencode/skills/skill-authoring/scripts/content/validate-skill.mjs \
  --text-file ai-docs/skill-authoring/interactive-runs/<run-id>/after/target-skill.md \
  --path-label ./.opencode/skills/<skill-name>/SKILL.md \
  --out ai-docs/skill-authoring/interactive-runs/<run-id>/after/validation.json \
  --markdown-out ai-docs/skill-authoring/interactive-runs/<run-id>/after/validation.md
```

### 通过 stdin 验证 draft 文本

```bash
cat draft-skill.md | node ~/.opencode/skills/skill-authoring/scripts/content/validate-skill.mjs \
  --stdin \
  --path-label ./.opencode/skills/<skill-name>/SKILL.md
```

Static validation 会返回：

- 结构状态，例如 `PASS` 或 `NEEDS_IMPROVEMENT`；
- 确定性的 findings 与 recommendations；
- `1..10` 的 quality rubric；
- 分数原因与改进建议。

## Trigger 测试

Trigger 测试用于验证 routing behavior：

- 该加载时是否加载；
- 不该加载时是否保持不加载。

### Skill 中真实存在的 trigger 测试

真实的 installed trigger test 文件应位于：

```text
./.opencode/skills/<skill-name>/assets/tests/trigger-evals.json
```

最小形状：

```json
{
  "skill": "project-local-skill",
  "threshold": 0.5,
  "runsPerQuery": 3,
  "queries": [
    {
      "query": "Do the intended trigger behavior here.",
      "shouldTrigger": true
    },
    {
      "query": "Do a near-miss task that should not load the skill.",
      "shouldTrigger": false
    }
  ]
}
```

### 交互过程中准备的 trigger 测试

在 full interactive `check` 或 `improve` 中，`skill-authoring` 可能把 trigger tests 准备到：

```text
ai-docs/skill-authoring/interactive-runs/<run-id>/after/tests/trigger-evals.json
```

这些只是 proposal artifacts。
只有当你之后选择 `apply` 时，它们才会被复制到真实 skill 的 `assets/tests/` 中。

### 推荐的 isolated trigger evaluation 方式

使用 report runner：

```bash
node ~/.opencode/skills/skill-authoring/scripts/content/run-report.mjs \
  --skill ./.opencode/skills/<skill-name>/SKILL.md \
  --install-command "<your AssistAgents refresh command>"
```

它会把可复现报告写入：

```text
ai-docs/skill-authoring/test-runs/<run-id>/
```

它不会自动覆盖源 skill。

### 低层 trigger 命令

仅当你要直接调试某个 eval set 时使用：

```bash
node ~/.opencode/skills/skill-authoring/scripts/trigger/run-trigger-eval.mjs \
  --eval-set ./.opencode/skills/<skill-name>/assets/tests/trigger-evals.json \
  --skill-dir ./.opencode/skills/<skill-name> \
  --runtime-root ai-docs/skill-authoring/test-runs/manual-trigger/runtime \
  --install-command "<your AssistAgents refresh command>"
```

常用可选参数：

- `--run-dir <dir>`
- `--threshold <number>`
- `--runs-per-query <number>`
- `--timeout-ms <number>`

## 推荐使用方式

### 检查已有 project skill

```text
/skill-authoring check .opencode/skills/<skill-name>/SKILL.md
```

### 带明确 intended meaning 的检查

```text
/skill-authoring check .opencode/skills/<skill-name>/SKILL.md. The skill should mean: <intended behavior>. Evaluate the current text against that meaning and prepare a non-applied proposal if needed.
```

### 改进已有 project skill

```text
/skill-authoring improve .opencode/skills/<skill-name>. This is a <goal-driven or instruction-driven> change. <your request>
```

### 快速修改

```text
/skill-authoring improve .opencode/skills/<skill-name> quick. <exact requested change>
```

### 创建新的 project skill

```text
/skill-authoring create .opencode/skills/<skill-name>. <desired behavior>
```

## 实际边界

- 专用 authoring agent 会由 `/skill-authoring` 自动选择。
- Full mode 可以在最终决定前把 proposal artifacts 写入 `ai-docs/skill-authoring/**`。
- 真正的 target skill 在 `apply` 之前不会被改动。
- 对同一个已展示 proposal 进行 `revise`、`reject` 或 `apply` 时，应复用同一个 run id。
- Terminal report mode 永远不会自动覆盖源 skill。
- 面向用户的说明使用会话语言，但最终 `SKILL.md` 文本保持英文。
