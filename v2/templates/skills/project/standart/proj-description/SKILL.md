---
name: project-standart-prd
description: Полный PRD для standard-потока
---

<purpose>
  <item>Собрать в `prd.md` проверяемые требования и критерии готовности продукта</item>
  <item>Дать однозначную основу для архитектуры, эпиков и задач</item>
</purpose>

<when_to_use>
  <item importance="critical">После brief (и research, если он нужен), до architecture</item>
  <item importance="high">Когда требуется формальная фиксация FR/NFR и AC</item>
</when_to_use>

<required_preload>
  <item>shared-base-rules</item>
  <item>shared-docs-paths</item>
  <item>planning-base</item>
  <item>planning-requirements-extraction</item>
  <item>planning-scope-definition</item>
  <item>planning-testing-strategy</item>
</required_preload>

<document_target>
  <rule importance="critical">Создать/обновить `prd.md`</rule>
</document_target>

<method>
  <step>Зафиксировать FR как наблюдаемое поведение системы</step>
  <step>Добавить релевантные NFR (perf, reliability, security, compliance)</step>
  <step>Сформировать acceptance criteria в формате Given/When/Then</step>
  <step>Определить границы релиза и явно зафиксировать исключения</step>
  <step>Привязать метрики успеха и риски к требованиям</step>
</method>

<output_format>
  <section>Goal</section>
  <section>Functional requirements</section>
  <section>Non-functional requirements</section>
  <section>Acceptance criteria</section>
  <section>In scope / Out of scope</section>
  <section>Dependencies and constraints</section>
  <section>Success metrics</section>
  <section>Open questions</section>
</output_format>

<quality_rules>
  <rule importance="critical">AC проверяемы и не содержат деталей реализации</rule>
  <rule importance="critical">Требования не противоречат brief и исследованиям</rule>
  <rule importance="high">Scope ограничен до deliverable-инкремента без scope creep</rule>
</quality_rules>
