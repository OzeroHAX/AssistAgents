---
name: planning-monitoring-checks
description: Наблюдаемость: метрики, алерты, дашборды, окна наблюдения после изменений
---

<purpose>
  <item>Определить, по каким сигналам понять «все хорошо» или «нужно остановиться/откатывать»</item>
</purpose>

<inputs>
  <required>Цель изменения + критичные пользовательские сценарии</required>
  <optional>SLA/SLO, существующие метрики/алерты</optional>
  <optional>Риски (особенно high-impact)</optional>
</inputs>

<method>
  <step>Определить 3-7 ключевых сигналов: ошибки, латентность, бизнес-метрики, насыщение ресурсов</step>
  <step>Для каждого сигнала: источник, агрегация, порог, окно, алертинг</step>
  <step>Определить burn-in окно наблюдения после выката (например, 1-24h) и ответственных</step>
  <step>Определить stop/rollback критерии как измеримые условия</step>
</method>

<output_format>
  <section>Key signals</section>
  <section>Alerts + thresholds</section>
  <section>Dashboards / views</section>
  <section>Burn-in window</section>
  <section>Stop / rollback criteria</section>
</output_format>

<quality_rules>
  <rule importance="critical">Сигналы привязаны к целевому поведению и рискам, а не «в целом метрики»</rule>
  <rule importance="high">Пороги и окна определены (иначе это не управляемо)</rule>
</quality_rules>
