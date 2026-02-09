---
name: project-standart-epic
description: Декомпозиция PRD и архитектуры в эпики с трассировкой и приоритетами
---

<purpose>
  <item>Собрать эпики как управляемые блоки ценности с явной связью к требованиям</item>
  <item>Подготовить базу для детальной task-decomposition и delivery-планирования</item>
</purpose>

<when_to_use>
  <item importance="critical">После architecture, перед decomposition в задачи</item>
  <item importance="high">Когда нужно упорядочить реализацию по ценности, риску и зависимостям</item>
</when_to_use>

<required_preload>
  <item>shared-base-rules</item>
  <item>shared-docs-paths</item>
  <item>planning-change-inventory</item>
  <item>planning-scope-minimization</item>
  <item>planning-estimation</item>
</required_preload>

<document_target>
  <rule importance="critical">Создать/обновить файлы в `epics/{epic key}-{epic number}-{user friendly name}.md`</rule>
</document_target>

<method>
  <step>Разбить требования на вертикальные эпики с наблюдаемой пользовательской ценностью</step>
  <step>Привязать каждый эпик к FR/NFR, use cases и архитектурным ограничениям</step>
  <step>Определить зависимости между эпиками и рекомендованную последовательность</step>
  <step>Описать acceptance criteria и definition of done для каждого эпика</step>
</method>

<output_format>
  <section>Epic summary</section>
  <section>Scope and non-goals</section>
  <section>PRD / use-case mapping</section>
  <section>Dependencies and order</section>
  <section>Acceptance criteria and DoD</section>
</output_format>

<quality_rules>
  <rule importance="critical">Нет эпиков без привязки к требованиям или архитектурной необходимости</rule>
  <rule importance="high">Границы эпика достаточно узкие для управляемой поставки</rule>
  <rule importance="high">Порядок выполнения учитывает критичный путь</rule>
</quality_rules>
