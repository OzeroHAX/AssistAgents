---
name: project-fast-pulse-scan
description: Экспресс-скан контекста, рисков и внешних ограничений перед быстрым проектным планом
---

<purpose>
  <item>Собрать только критичный контекст для принятия проектных решений в одну итерацию</item>
  <item>Снизить риск неверного плана из-за скрытых ограничений</item>
</purpose>

<when_to_use>
  <item importance="critical">Сразу после fast-init и до выбора стека/архитектурных решений</item>
  <item importance="high">Когда есть интеграции, комплаенс, SLA или зависимость от внешних систем</item>
</when_to_use>

<required_preload>
  <item>task-use/research/web-strategy</item>
  <item>planning-risk-assessment</item>
  <item>planning-impact-analysis</item>
</required_preload>

<inputs>
  <required>Цель, рамки и ограничения из fast-init</required>
  <optional>Текущие технические решения и известные боли проекта</optional>
  <optional>Внешние стандарты/документация/рыночные ограничения</optional>
</inputs>

<method>
  <step>Сформировать 1-3 проверяемых исследовательских вопроса</step>
  <step>Провести экспресс-ресерч по первичным источникам, только по критичным темам</step>
  <step>Выделить top-risks и top-constraints, влияющие на архитектуру и scope</step>
  <step>Отделить факты от гипотез и отметить confidence по ключевым выводам</step>
  <step>Зафиксировать условия эскалации из fast в standard</step>
</method>

<output_format>
  <section>Research questions</section>
  <section>Verified findings</section>
  <section>Top constraints</section>
  <section>Top risks + mitigations</section>
  <section>Escalation triggers</section>
  <section>Sources</section>
</output_format>

<quality_rules>
  <rule importance="critical">Каждый ключевой вывод подтвержден минимум одним надежным источником</rule>
  <rule importance="high">Факты и предположения разделены явно</rule>
  <rule importance="high">Риски приоритизированы по влиянию на fast-план</rule>
</quality_rules>

<do_not>
  <item importance="critical">Не делать широкий ресерч без ограниченного вопроса</item>
  <item importance="high">Не тащить второстепенные риски в fast-план</item>
</do_not>
