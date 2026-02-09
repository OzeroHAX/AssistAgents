---
name: project-standart-decomposition
description: Разложение эпиков в implementation-ready задачи
---

<purpose>
  <item>Преобразовать эпики в задачи, готовые к выполнению без дополнительной аналитики</item>
  <item>Сохранить полную трассировку: задача -> эпик -> PRD/use-case -> архитектурные ограничения</item>
</purpose>

<when_to_use>
  <item importance="critical">После формирования эпиков, перед стартом реализации</item>
  <item importance="high">Когда требуется оценка емкости и последовательный delivery-план</item>
</when_to_use>

<required_preload>
  <item>shared-base-rules</item>
  <item>shared-docs-paths</item>
  <item>task-use/creator/decomposition-strategy</item>
  <item>planning-change-inventory</item>
  <item>planning-estimation</item>
  <item>planning-testing-strategy</item>
</required_preload>

<document_target>
  <rule importance="critical">Создать/обновить файлы в `tasks/{task key}-{task number}-{user friendly name}.md`</rule>
</document_target>

<method>
  <step>Разбить эпик на независимые задачи с четким результатом</step>
  <step>Определить для каждой задачи AC, DoD, и проверочные сигналы</step>
  <step>Зафиксировать зависимости, порядок выполнения и критичный путь</step>
  <step>Добавить обязательные задачи тестирования/наблюдаемости/rollback при необходимости</step>
  <step>Оценить задачи и обозначить варианты среза scope при timebox-давлении</step>
</method>

<output_format>
  <section>Ordered task list</section>
  <section>Task to epic mapping</section>
  <section>Task AC and DoD</section>
  <section>Dependencies and critical path</section>
  <section>Estimation and scope-cut options</section>
</output_format>

<quality_rules>
  <rule importance="critical">Каждая задача тестируема и имеет критерий завершения</rule>
  <rule importance="critical">Нет крупных неопределенных задач без AC/DoD</rule>
  <rule importance="high">Порядок задач учитывает риски и зависимости</rule>
</quality_rules>
