---
name: planning-risk-assessment
description: Оценка рисков: вероятность/влияние, меры снижения, остаточный риск
---

<purpose>
  <item>Выявить риски, оценить их и сформировать конкретные меры снижения</item>
</purpose>

<inputs>
  <required>Описание изменения + зоны влияния (если есть)</required>
  <optional>Критичные бизнес-процессы и SLA</optional>
  <optional>Ограничения по релизам/окнам/процессу</optional>
</inputs>

<risk_categories>
  <item>data</item>
  <item>security</item>
  <item>performance</item>
  <item>reliability</item>
  <item>ops</item>
  <item>business</item>
</risk_categories>

<method>
  <step>Сформировать список рисков, привязанных к конкретным изменениям</step>
  <step>Оценить вероятность и влияние (qualitative: low/medium/high)</step>
  <step>Для каждого high-impact риска добавить mitigation (тест/флаг/поэтапный rollout/ограничение scope/мониторинг)</step>
  <step>Определить остаточный риск и решение (принимаем/снижаем/избегаем)</step>
</method>

<output_format>
  <section>Risks list</section>
  <section>Likelihood / impact</section>
  <section>Mitigations</section>
  <section>Residual risks / decisions</section>
</output_format>

<quality_rules>
  <rule importance="critical">Риски не общие, а привязаны к планируемым изменениям</rule>
  <rule importance="high">У high-impact рисков есть конкретные mitigation действия</rule>
</quality_rules>
