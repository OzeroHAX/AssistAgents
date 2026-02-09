---
name: project-standart-brief
description: Формирование стартового brief для standard-планирования
---

<purpose>
  <item>Зафиксировать проблему, целевой outcome, границы MVP и критерии успеха</item>
  <item>Подготовить основу для `prd.md` без скрытых предположений</item>
</purpose>

<when_to_use>
  <item importance="critical">Сразу после `status:init`, перед детальным PRD</item>
  <item importance="high">Когда запрос размытый и нужно стабилизировать контекст проекта</item>
</when_to_use>

<required_preload>
  <item>shared-base-rules</item>
  <item>shared-docs-paths</item>
  <item>planning-base</item>
  <item>planning-requirements-extraction</item>
  <item>planning-scope-definition</item>
</required_preload>

<document_target>
  <rule importance="critical">Создать/обновить `brief.md`</rule>
</document_target>

<method>
  <step>Сформулировать проблему и бизнес-цель как измеримый outcome</step>
  <step>Зафиксировать in-scope и out-of-scope на уровне продукта</step>
  <step>Описать критерии успеха и верхнеуровневые ограничения</step>
  <step>Отделить факты от предположений и оформить открытые вопросы</step>
</method>

<output_format>
  <section>Problem statement</section>
  <section>Goal and success metrics</section>
  <section>In scope</section>
  <section>Out of scope</section>
  <section>Constraints</section>
  <section>Assumptions and open questions</section>
</output_format>

<quality_rules>
  <rule importance="critical">Цель выражена как результат, а не список действий</rule>
  <rule importance="high">Границы продукта заданы явно и проверяемо</rule>
  <rule importance="high">Открытые вопросы влияют на следующий шаг (PRD), а не «на потом»</rule>
</quality_rules>
