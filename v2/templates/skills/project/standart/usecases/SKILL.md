---
name: project-standart-usecases
description: Проектирование use cases и пользовательских сценариев с трассировкой к PRD
---

<purpose>
  <item>Описать ключевые пользовательские сценарии в исполнимом и тестируемом виде</item>
  <item>Подготовить основу для архитектуры и разбиения на эпики/задачи</item>
</purpose>

<when_to_use>
  <item importance="critical">После фиксации PRD и персон, до epics/tasks</item>
  <item importance="high">Когда важно согласовать потоки и граничные условия поведения</item>
</when_to_use>

<required_preload>
  <item>shared-base-rules</item>
  <item>shared-docs-paths</item>
  <item>planning-requirements-extraction</item>
  <item>planning-testing-strategy</item>
</required_preload>

<document_target>
  <rule importance="critical">Создать/обновить файлы в `use-cases/{use case key}-{use case number}-{user friendly name}.md`</rule>
</document_target>

<method>
  <step>Определить primary actor, preconditions, main flow, alternate flow, failure flow</step>
  <step>Привязать каждый use case к требованиям и AC из PRD</step>
  <step>Выделить входные/выходные данные и точки интеграции</step>
  <step>Зафиксировать сигналы проверки для тестирования сценария</step>
</method>

<output_format>
  <section>Use case goal</section>
  <section>Actors and preconditions</section>
  <section>Main flow</section>
  <section>Alternate and error flows</section>
  <section>PRD / AC traceability</section>
  <section>Validation signals</section>
</output_format>

<quality_rules>
  <rule importance="critical">У каждого сценария есть явный expected outcome</rule>
  <rule importance="high">Сценарии покрывают критичные ошибки и отклонения</rule>
  <rule importance="high">Есть двусторонняя трассировка: use case -> PRD AC</rule>
</quality_rules>
