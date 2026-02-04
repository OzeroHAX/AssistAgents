---
name: planning-approach-selection
description: Выбор подхода к реализации: сравнение вариантов и обоснование решения
---

<purpose>
  <item>Сравнить 1-3 реалистичных подхода и выбрать лучший по критериям</item>
</purpose>

<inputs>
  <required>Цель/требования + ограничения</required>
  <optional>Риски и процессные ограничения (релизы, окна, SLA)</optional>
</inputs>

<method>
  <step>Определить 3-6 критериев выбора (риск, скорость, стоимость, поддерживаемость, совместимость)</step>
  <step>Описать 1-3 варианта решения в 2-4 пунктах каждый</step>
  <step>Сравнить trade-offs по критериям и выбрать вариант</step>
  <step>Явно указать, что теряем/получаем выбранным вариантом</step>
</method>

<output_format>
  <section>Decision criteria</section>
  <section>Options</section>
  <section>Chosen approach + rationale</section>
  <section>Trade-offs</section>
</output_format>

<quality_rules>
  <rule importance="critical">Выбор подхода обоснован критериями, а не «кажется лучше»</rule>
  <rule importance="high">Trade-offs сформулированы явно</rule>
</quality_rules>
