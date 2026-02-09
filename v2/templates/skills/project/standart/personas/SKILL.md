---
name: project-standart-personas
description: Формирование и валидация проектных персон для приоритизации требований
---

<purpose>
  <item>Связать продуктовые решения с реальными пользователями, их болями и мотивацией</item>
  <item>Снизить риск разработки функций без ценности</item>
</purpose>

<when_to_use>
  <item importance="high">После базового PRD, до финализации use cases и эпиков</item>
  <item importance="critical">Когда в требованиях есть разница по ролям или сценариям поведения</item>
</when_to_use>

<required_preload>
  <item>shared-base-rules</item>
  <item>shared-docs-paths</item>
  <item>planning-requirements-extraction</item>
  <item>planning-impact-analysis</item>
</required_preload>

<document_target>
  <rule importance="critical">Создать/обновить `personals.md`</rule>
</document_target>

<method>
  <step>Определить primary и secondary персоны</step>
  <step>Зафиксировать jobs-to-be-done, боли, триггеры и критерии успеха по каждой персоне</step>
  <step>Привязать требования PRD к конкретным персонам</step>
  <step>Отметить конфликты потребностей между персонами и правила приоритизации</step>
</method>

<output_format>
  <section>Persona list</section>
  <section>Goals and pains</section>
  <section>Concerns and objections</section>
  <section>Key scenarios</section>
  <section>PRD requirements mapping</section>
</output_format>

<quality_rules>
  <rule importance="critical">У каждой персоны есть измеримая цель и критерий ценности</rule>
  <rule importance="high">Нет «абстрактных» персон без влияния на решения</rule>
  <rule importance="high">Есть явная связь с use cases и требованиями PRD</rule>
</quality_rules>
