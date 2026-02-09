---
name: project-fast-task-blast
description: Мгновенная декомпозиция proto-spec в implementation-ready задачи проекта
---

<purpose>
  <item>Преобразовать fast-spec в набор задач, готовых к выполнению без дополнительной аналитики</item>
  <item>Сохранить связность: каждая задача должна быть трассируема к AC и архитектурным решениям</item>
</purpose>

<when_to_use>
  <item importance="critical">Сразу после proto-spec, в той же итерации планирования</item>
  <item importance="high">Когда нужно получить короткий, исполнимый backlog под MVP</item>
</when_to_use>

<required_preload>
  <item>task-use/creator/decomposition-strategy</item>
  <item>planning-change-inventory</item>
  <item>planning-scope-minimization</item>
  <item>planning-estimation</item>
</required_preload>

<inputs>
  <required>Proto-spec (requirements, AC, architecture constraints, file map)</required>
  <optional>Приоритеты релиза и доступная емкость команды</optional>
  <optional>Технические зависимости и последовательность внедрения</optional>
</inputs>

<method>
  <step>Разбить требования на вертикальные инкременты (value-first)</step>
  <step>Сопоставить каждую задачу с AC и конкретными изменениями в кодовой базе</step>
  <step>Определить порядок выполнения по зависимостям и рискам</step>
  <step>Добавить обязательные задачи по валидации (tests/observability/review)</step>
  <step>Проверить, что каждая задача независима, тестируема и ограничена по объему</step>
</method>

<output_format>
  <section>Task list (ordered)</section>
  <section>Task to AC mapping</section>
  <section>Dependencies and sequence</section>
  <section>Definition of done per task</section>
  <section>Scope-cut options (if timebox pressure)</section>
</output_format>

<quality_rules>
  <rule importance="critical">Каждая задача имеет проверяемый результат и DoD</rule>
  <rule importance="critical">Нет задач без привязки к AC или явной технической необходимости</rule>
  <rule importance="high">Порядок выполнения учитывает критичные зависимости</rule>
</quality_rules>

<do_not>
  <item importance="critical">Не декомпозировать по слоям без пользовательской ценности</item>
  <item importance="high">Не оставлять большие неопределенные задачи без критериев завершения</item>
</do_not>
