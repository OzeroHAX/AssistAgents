---
name: planning-migration-strategy
description: Стратегия миграции данных/схем/контрактов: совместимость, фазы, проверки
---

<purpose>
  <item>Спроектировать миграцию так, чтобы сохранить целостность данных и совместимость</item>
</purpose>

<inputs>
  <required>Что мигрируем (схема/данные/API) и зачем</required>
  <optional>Объем данных, окна, ограничения по downtime</optional>
  <optional>Требования к backward compatibility</optional>
</inputs>

<common_patterns>
  <pattern>expand/contract</pattern>
  <pattern>dual-read / dual-write</pattern>
  <pattern>backfill in background</pattern>
  <pattern>versioned API / events</pattern>
</common_patterns>

<method>
  <step>Определить объекты миграции и зависимости (таблицы, индексы, consumers)</step>
  <step>Выбрать паттерн миграции и обосновать (почему он подходит под ограничения)</step>
  <step>Разбить на фазы: подготовка → совместимость → перенос → переключение → уборка</step>
  <step>Определить проверки целостности/корректности (checksums, counts, sampling)</step>
  <step>Явно описать совместимость на период миграции (какие версии живут вместе)</step>
</method>

<output_format>
  <section>Migration objects</section>
  <section>Chosen pattern + rationale</section>
  <section>Phases</section>
  <section>Compatibility window</section>
  <section>Data verification</section>
</output_format>

<quality_rules>
  <rule importance="critical">Есть проверка целостности данных (не только «прогнали миграцию»)</rule>
  <rule importance="high">Совместимость на период миграции описана явно</rule>
</quality_rules>
