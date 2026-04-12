# Руководство По Skill-Authoring

Это руководство описывает end-user workflow для `/skill-authoring`: что делает команда, как устроено разделение `command + agent + skill + scripts`, какие файлы создаются, как работают статическая валидация и trigger-тесты, и что именно подтверждает финальный шаг применения.

Это руководство предназначено для конечного пользователя, который работает с project-local skills. Maintainer workflow пакета здесь не рассматривается.

## Установленная структура

Предполагается, что AssistAgents уже установлен в:

```text
~/.opencode/
```

Важные пути:

- project-local skills: `./.opencode/skills/<skill-name>/`
- глобально установленные scripts `skill-authoring`: `~/.opencode/skills/skill-authoring/scripts/`
- артефакты интерактивных прогонов: `./ai-docs/skill-authoring/interactive-runs/`
- артефакты изолированных отчётов: `./ai-docs/skill-authoring/test-runs/`

Обычно вы работаете с локальным skill внутри текущего проекта. А validator и trigger-report scripts берутся из глобально установленного пакета.

## Как устроен `/skill-authoring`

У `/skill-authoring` теперь 4 отдельных слоя:

1. Команда
   `/skill-authoring` — это пользовательская точка входа. Вы вызываете её напрямую в чате. Агент вручную выбирать не нужно.
2. Выделенный агент
   Команда маршрутизирует запрос в специальный `skill-authoring` agent с узким и стабильным runtime path.
3. Skill `skill-authoring`
   Именно он хранит методологию: meaning resolution, quality rules, references policy, preview/apply contract и требования к валидации.
4. Scripts
   Bundled scripts выполняют детерминированные проверки: static validation и isolated trigger reports.

Это разделение важно:

- команда — это только вход;
- агент делает runtime стабильным;
- skill задаёт правила авторинга;
- scripts выполняют повторяемые проверки.

## Режимы работы

### 1. Интерактивный full mode

Это режим по умолчанию.

Используйте его, когда нужны:

- уточнение требований;
- static validation;
- quality rubric review;
- сохранённая interactive history;
- подготовленный proposal package;
- подготовленные trigger-тесты, если они уместны.

### 2. Интерактивный quick mode

Используйте только если вы явно хотите скорость вместо полного цикла.

Quick mode всё ещё:

- читает target skill;
- показывает preview до изменения target skill;
- требует явного финального решения.

Quick mode обычно пропускает:

- interactive run history;
- static validation;
- rubric scoring;
- подготовку trigger-тестов.

Типичные подсказки:

- `quick`
- `fast`
- `skip validation`
- `no tests`
- `without evaluation`

### 3. Terminal isolated report mode

Используйте вне чата, когда нужен воспроизводимый trigger-report.

Этот режим:

- запускает static validation;
- запускает только trigger eval;
- пишет отчёт в `ai-docs/skill-authoring/test-runs/<run-id>/`;
- может создать suggested candidate внутри run directory;
- никогда автоматически не перезаписывает исходный skill.

Фоновая оценка content-result здесь не используется. Это только static validation + trigger evaluation.

## Интерактивный flow

### 1. Запуск команды

Вы вызываете `/skill-authoring` напрямую в чате, например:

```text
/skill-authoring check .opencode/skills/<skill-name>/SKILL.md
```

Команда сама маршрутизирует запрос в выделенный authoring agent.

### 2. Определение action, target, mode и meaning source

Сначала workflow определяет:

- action: `create`, `check`, `improve` или `review`
- target skill path
- mode: `full` или `quick`
- meaning source:
  - `explicit_intended_meaning`
  - `partial_intended_meaning`
  - `no_external_meaning`

Также определяется dominant knowledge form:

- `inline_contract`
- `local_references`
- `project_references`
- `external_on_demand`
- `deterministic_scripts`

### 3. Подтверждение смысла только когда это действительно нужно

Если в `check` или `improve` вы уже сразу описали, что skill должен значить, это описание используется напрямую, и inferred-meaning confirmation не нужен.

Если вы описали intended behavior только частично, `skill-authoring` сначала должен задать узкие уточняющие вопросы.

Только если надёжного внешнего смысла нет, он должен:

- вывести inferred summary по текущему тексту skill;
- показать эту интерпретацию явно;
- спросить, правильно ли она отражает текущий смысл.

Именно этот шаг meaning confirmation остаётся кандидатом для `question` UI.

### 4. Запуск run history в full mode

Как только начинается углублённый анализ в full mode, `skill-authoring` пишет артефакты в:

```text
ai-docs/skill-authoring/interactive-runs/<run-id>/
```

Важная граница:

- до финального решения target skill остаётся неизменным;
- но full mode имеет право заранее писать proposal artifacts в `ai-docs/skill-authoring/**`.

То есть pre-apply записи в `ai-docs/skill-authoring/**` в full mode нормальны. Read-only до `apply` остаётся только реальный subtree целевого skill.

### 5. Анализ и подготовка proposal package

В full mode `skill-authoring` может подготовить:

- findings;
- validation reports;
- rubric notes;
- prepared draft в `after/target-skill.md`;
- prepared trigger tests в `after/tests/`;
- proposal summary и visible diff artifacts.

Для reusable skills full interactive `check` и `improve` обычно подготавливают trigger-тесты по умолчанию, если нет конкретной причины этого не делать.

Подготовленные trigger-тесты остаются в run directory до тех пор, пока вы не выберете `apply`.

### 6. Preview в чате

До любой записи в target skill `skill-authoring` обязан показать видимый preview в чате:

- ключевые findings или weaknesses;
- scope подготовленного proposal;
- точный diff или draft;
- future apply routes для supporting files, например trigger-тестов.

Diff должен быть в видимом сообщении чата. Hidden reasoning не считается preview.

### 7. Финальное решение теперь только в чате

После preview то же видимое сообщение чата должно заканчиваться одним явным final decision prompt.

Допустимые финальные исходы:

- `apply`
- `reject`
- `revise: <extra instructions>`

Этот prompt обязан:

- назвать target skill;
- показать concrete `from -> to` route для prepared draft;
- упомянуть другие файлы в scope, например prepared trigger tests;
- оставаться коротким;
- не повторять весь diff и всё rationale.

Отдельного второго шага `approve` больше нет.
Отдельного финального `question`-окна тоже больше нет.

### 8. Что означает каждый финальный исход

- `apply`
  Применить весь prepared proposal package, который сейчас входит в scope.
- `reject`
  Ничего не менять в target skill.
- `revise: ...`
  Сохранить тот же run id, сохранить текущий proposal context и доработать draft вместо запуска нового прогона.

Если в scope перечислено несколько файлов, `apply` применяет их все, если вы явно не сузите scope.

### 9. Применение и завершение

Только после `apply` `skill-authoring` может:

- обновить target `SKILL.md`;
- скопировать prepared trigger tests в `<skill-dir>/assets/tests/`;
- завершить `approval.md` и `final-summary.md`;
- переиспользовать уже подготовленный validation result, если applied result полностью совпадает с заранее провалидированным draft.

## Run id и структура артефактов

Run id имеет вид:

```text
<utc-timestamp>-<action>-<skill-slug>
```

Пример:

```text
20260410T130821Z-check-task-use-research-code-strategy
```

Timestamp-only run ids недопустимы.

### Дерево full interactive run

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

### Назначение основных файлов

- `request.md`
  Сырой запрос плюс resolved context.
- `approval.md`
  Финальное решение пользователя и scope.
- `before/target-skill.md`
  Снимок исходного skill до изменений.
- `before/inferred-summary.md`
  Inferred current meaning и, если нужно, пользовательская коррекция.
- `before/validation.json` и `before/validation.md`
  Static validation текущего source skill.
- `before/verdict.md`
  Короткое объяснение, что именно было слабым или важным до изменений.
- `proposal/summary.md`
  Человекочитаемое summary proposal.
- `proposal/skill.diff.md`
  Точный diff, который показан в чате.
- `after/target-skill.md`
  Prepared draft для возможного применения.
- `after/validation.json` и `after/validation.md`
  Validation prepared draft-а.
- `after/change-plan.md`
  Сохранённый change plan и rationale.
- `after/tests/`
  Каноническое prepared tests subtree для proposal package.
- `final-summary.md`
  Финальное объяснение того, что применилось или к какому выводу пришёл workflow.

`proposal/tests/` больше не является частью канонического flow. Prepared tests теперь живут в `after/tests/`.

## Статическая валидация

Static validation — это основной детерминированный способ проверить структуру и качество skill.

### Валидация существующего skill

```bash
node ~/.opencode/skills/skill-authoring/scripts/content/validate-skill.mjs \
  --skill ./.opencode/skills/<skill-name>/SKILL.md \
  --out ai-docs/skill-authoring/manual-validation/report.json \
  --markdown-out ai-docs/skill-authoring/manual-validation/report.md
```

`--skill` принимает и директорию skill, и прямой путь к `SKILL.md`.

### Валидация prepared draft file

```bash
node ~/.opencode/skills/skill-authoring/scripts/content/validate-skill.mjs \
  --text-file ai-docs/skill-authoring/interactive-runs/<run-id>/after/target-skill.md \
  --path-label ./.opencode/skills/<skill-name>/SKILL.md \
  --out ai-docs/skill-authoring/interactive-runs/<run-id>/after/validation.json \
  --markdown-out ai-docs/skill-authoring/interactive-runs/<run-id>/after/validation.md
```

### Валидация draft-текста через stdin

```bash
cat draft-skill.md | node ~/.opencode/skills/skill-authoring/scripts/content/validate-skill.mjs \
  --stdin \
  --path-label ./.opencode/skills/<skill-name>/SKILL.md
```

Static validation возвращает:

- structural status вроде `PASS` или `NEEDS_IMPROVEMENT`;
- детерминированные findings и recommendations;
- quality rubric с оценками `1..10`;
- причины оценок и improvement notes.

## Trigger-тесты

Trigger-тесты проверяют routing behavior:

- загружается ли skill там, где должен;
- не загружается ли он там, где не должен.

### Настоящие trigger-тесты внутри skill

Реальный installed trigger test file должен лежать в:

```text
./.opencode/skills/<skill-name>/assets/tests/trigger-evals.json
```

Минимальная форма:

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

### Prepared trigger-тесты во время interactive работы

Во время full interactive `check` или `improve` `skill-authoring` может подготовить trigger-тесты в:

```text
ai-docs/skill-authoring/interactive-runs/<run-id>/after/tests/trigger-evals.json
```

Это только proposal artifacts.
В реальный `assets/tests/` они копируются только если вы потом выберете `apply`.

### Предпочтительный способ запускать isolated trigger evaluation

Используйте report runner:

```bash
node ~/.opencode/skills/skill-authoring/scripts/content/run-report.mjs \
  --skill ./.opencode/skills/<skill-name>/SKILL.md \
  --install-command "<ваша команда обновления AssistAgents>"
```

Он пишет воспроизводимый отчёт в:

```text
ai-docs/skill-authoring/test-runs/<run-id>/
```

Исходный skill он автоматически не перезаписывает.

### Низкоуровневая trigger-команда

Используйте её только если хотите напрямую отладить один eval set:

```bash
node ~/.opencode/skills/skill-authoring/scripts/trigger/run-trigger-eval.mjs \
  --eval-set ./.opencode/skills/<skill-name>/assets/tests/trigger-evals.json \
  --skill-dir ./.opencode/skills/<skill-name> \
  --runtime-root ai-docs/skill-authoring/test-runs/manual-trigger/runtime \
  --install-command "<ваша команда обновления AssistAgents>"
```

Полезные флаги:

- `--run-dir <dir>`
- `--threshold <number>`
- `--runs-per-query <number>`
- `--timeout-ms <number>`

## Рекомендуемые сценарии

### Проверка существующего project skill

```text
/skill-authoring check .opencode/skills/<skill-name>/SKILL.md
```

### Проверка с явным intended meaning

```text
/skill-authoring check .opencode/skills/<skill-name>/SKILL.md. Этот skill должен означать: <intended behavior>. Оцени текущий текст относительно этого смысла и при необходимости подготовь non-applied proposal.
```

### Доработка существующего project skill

```text
/skill-authoring improve .opencode/skills/<skill-name>. Это <goal-driven или instruction-driven> изменение. <ваш запрос>
```

### Быстрая правка

```text
/skill-authoring improve .opencode/skills/<skill-name> quick. <точная правка>
```

### Создание нового project skill

```text
/skill-authoring create .opencode/skills/<skill-name>. <желаемое поведение>
```

## Практические границы

- Выделенный authoring agent выбирается автоматически через `/skill-authoring`.
- Full mode имеет право писать proposal artifacts в `ai-docs/skill-authoring/**` ещё до финального решения.
- Реальный target skill остаётся неизменным до `apply`.
- Для одного и того же proposal run id должен сохраняться при `revise`, `reject` и `apply`.
- Terminal report mode никогда автоматически не перезаписывает source skill.
- Пользовательские пояснения идут на языке сессии, но итоговый `SKILL.md` остаётся на английском.
