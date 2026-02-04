---
name: planning-impact-analysis
description: Анализ зон влияния изменений: системы, контракты, данные, регрессии
---

<purpose>
  <item>Найти, что реально затрагивают правки, чтобы не пропустить критичные места</item>
</purpose>

<inputs>
  <required>Краткое описание изменения или цели</required>
  <optional>Известные модули/файлы/сервисы</optional>
  <optional>Интеграции и внешние контракты (API, события, очереди)</optional>
</inputs>

<method>
  <step>Определить входные точки и путь данных/запроса</step>
  <step>Выписать затронутые компоненты (UI/API/worker/DB/infra)</step>
  <step>Выписать контракты: публичные API, события, форматы, схемы</step>
  <step>Описать влияние на данные: схема, миграции, индексы, целостность</step>
  <step>Отметить вероятные регрессии и зоны повышенной критичности</step>
</method>

<output_format>
  <section>Affected areas</section>
  <section>Interfaces / contracts</section>
  <section>Data impact</section>
  <section>Regression hotspots</section>
</output_format>

<quality_rules>
  <rule importance="critical">Зоны влияния конкретны и проверяемы</rule>
  <rule importance="high">Внешние контракты перечислены явно</rule>
</quality_rules>
