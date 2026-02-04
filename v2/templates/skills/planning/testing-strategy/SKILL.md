---
name: planning-testing-strategy
description: Стратегия тестирования: что проверять, какие типы тестов, какие данные
---

<purpose>
  <item>Сформировать достаточный набор проверок, привязанный к AC и рискам</item>
</purpose>

<inputs>
  <required>AC/Goal + список изменений</required>
  <optional>Критичные сценарии, edge-cases, риски</optional>
  <optional>Доступные окружения и тестовые данные</optional>
</inputs>

<method>
  <step>Связать каждое ключевое AC/риск с проверкой (unit/integration/e2e/manual)</step>
  <step>Выделить регрессионный минимум для смежных зон влияния</step>
  <step>Определить тестовые данные и окружения</step>
  <step>Определить «acceptance signals» (что считаем успешной проверкой)</step>
</method>

<output_format>
  <section>Test scope</section>
  <section>Test types</section>
  <section>Key scenarios + edge-cases</section>
  <section>Data / environments</section>
  <section>Acceptance signals</section>
</output_format>

<quality_rules>
  <rule importance="critical">Проверки привязаны к изменениям/рискам, а не «на всякий случай»</rule>
  <rule importance="high">Есть регрессия вокруг зоны влияния, не только happy-path</rule>
</quality_rules>
