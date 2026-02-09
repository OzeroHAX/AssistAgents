---
name: project-fast-stack-pick
description: Быстрый и обоснованный выбор технологического стека для проекта в one-iteration режиме
---

<purpose>
  <item>Выбрать стек по явным критериям скорости поставки, риска и поддержки</item>
  <item>Зафиксировать решение так, чтобы его можно было проверить и оспорить</item>
</purpose>

<when_to_use>
  <item importance="critical">После pulse-scan и до финализации proto-spec</item>
  <item importance="high">Когда есть 2+ реалистичных стека или платформенных варианта</item>
</when_to_use>

<required_preload>
  <item>planning-approach-selection</item>
  <item>planning-estimation</item>
  <item>planning-risk-assessment</item>
</required_preload>

<inputs>
  <required>Ограничения, риски и критерии успеха из предыдущих шагов</required>
  <optional>Текущая экспертиза команды и доступные ресурсы</optional>
  <optional>Требования по совместимости с текущим ландшафтом</optional>
</inputs>

<method>
  <step>Определить 3-6 критериев выбора (speed, risk, maintainability, cost, compatibility)</step>
  <step>Описать 1-3 реалистичных варианта стека</step>
  <step>Сравнить варианты по критериям и выбрать основной</step>
  <step>Зафиксировать trade-offs и fallback-вариант</step>
  <step>Проверить, что выбор поддерживает поставку MVP в одну итерацию планирования</step>
</method>

<output_format>
  <section>Decision criteria</section>
  <section>Stack options</section>
  <section>Chosen stack + rationale</section>
  <section>Trade-offs</section>
  <section>Fallback option</section>
</output_format>

<quality_rules>
  <rule importance="critical">Выбор стека объяснен критериями, а не предпочтениями</rule>
  <rule importance="high">Зафиксированы потери и ограничения выбранного варианта</rule>
  <rule importance="high">Есть fallback для критичных рисков</rule>
</quality_rules>

<do_not>
  <item importance="critical">Не выбирать стек без явного сравнения хотя бы двух вариантов (если варианты есть)</item>
  <item importance="high">Не игнорировать реальную экспертизу команды</item>
</do_not>
