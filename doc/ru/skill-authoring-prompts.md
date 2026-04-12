# Шаблоны Prompt-ов Для Skill-Authoring

Используйте эти шаблоны напрямую в OpenCode-чате через `/skill-authoring`.

Полный flow, структура артефактов, static validation, trigger-тесты и финальный контракт `apply / reject / revise: ...` описаны в [Руководстве по skill-authoring](./skill-authoring.md).

Правила:

- Пользовательский чат должен идти на языке пользователя.
- Итоговый `SKILL.md` должен оставаться на английском.
- Diff должен быть показан в видимом сообщении чата до изменения target skill.
- В full mode pre-apply артефакты в `ai-docs/skill-authoring/**` — это нормальное поведение.
- До `apply` реальный target skill должен оставаться неизменным.
- Финальный исход должен быть одним из: `apply`, `reject` или `revise: ...`.

## 1. Создать Новый Project Skill

```text
/skill-authoring create .opencode/skills/<skill-name>. Это goal-driven change. Я хочу skill, который делает следующее: <желаемое поведение>. Используй релевантные project files как references, задай недостающие вопросы, предложи первую версию, покажи diff в чате и закончи preview финальным prompt-ом с apply / reject / revise: ... . До моего apply не меняй реальный target skill. После apply запиши skill и выполни static validation. Итоговый текст skill должен остаться на английском.
```

## 2. Доработать Существующий Project Skill

```text
/skill-authoring improve .opencode/skills/<skill-name>. Это <instruction-driven или goal-driven> изменение. Я хочу изменить skill так: <запрос>. Используй релевантные project files как контекст. Сначала покажи предлагаемый diff с обоснованием, не меняй реальный target skill до моего apply, и закончи preview строкой с apply / reject / revise: ... . Затем примени одобренное изменение и выполни static validation. Итоговый текст skill должен остаться на английском.
```

## 3. Проверить Существующий Project Skill

```text
/skill-authoring check .opencode/skills/<skill-name>/SKILL.md. Проведи валидацию текущего skill, при необходимости сначала выведи и согласуй его текущий смысл, укажи слабые места, подготовь non-applied proposal если он нужен, и заверши preview финальным выбором apply / reject / revise: ... .
```

## 4. Проверить Относительно Явно Заданного Intended Meaning

```text
/skill-authoring check .opencode/skills/<skill-name>/SKILL.md. Этот skill должен означать: <intended behavior>. Оцени текущий текст относительно этого смысла, пропусти inferred-meaning confirmation, если оно не нужно, и при необходимости подготовь non-applied proposal, который завершится выбором apply / reject / revise: ... .
```

## 5. Быстрая Правка

```text
/skill-authoring improve .opencode/skills/<skill-name> quick. Внеси только следующее изменение: <точно сформулированная правка>. Сначала покажи diff, не меняй target skill до моего apply, затем примени изменение. Валидацию и тесты пропусти.
```
