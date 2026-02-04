---
name: planning-risk-check
description: Анализ рисков при планировании изменений в коде
---

<input_requirements>
  <required>Краткое описание запроса или задачи</required>
  <optional>Предполагаемый scope и список изменений</optional>
  <optional>Ограничения по срокам, риску и окружению</optional>
  <optional>Критические бизнес-процессы и SLA</optional>
  <optional>Контекст текущей реализации (ключевые модули/файлы)</optional>
  <optional>Известные инциденты и регрессии</optional>
</input_requirements>

<planning_goals>
  <goal>Выявить технические и бизнес-риски</goal>
  <goal>Оценить вероятность и влияние</goal>
  <goal>Определить меры снижения риска</goal>
</planning_goals>

<analysis_steps>
  <step>Определить зоны влияния и критичность</step>
  <step>Собрать потенциальные риски по категориям</step>
  <step>Оценить вероятность и влияние (qualitative)</step>
  <step>Определить mitigation и monitoring</step>
  <step>Зафиксировать остаточные риски и решения</step>
</analysis_steps>

<plan_structure>
  <section>Короткое резюме и контекст</section>
  <section>Критические зоны и зависимости</section>
  <section>Список рисков (категории: tech, data, security, perf, ops, business)</section>
  <section>Оценка вероятности и влияния</section>
  <section>План mitigation и мониторинга</section>
  <section>Остаточные риски и решения</section>
  <section>Открытые вопросы</section>
</plan_structure>

<output_format>
  <note>Формат гибкий, рекомендуется структура, близкая к Plan Mode Claude Code</note>
  <section>Summary</section>
  <section>Critical areas</section>
  <section>Risks list</section>
  <section>Likelihood / impact</section>
  <section>Mitigation / monitoring</section>
  <section>Residual risks</section>
  <section>Open questions</section>
</output_format>

<quality_rules>
  <rule importance="critical">Риски привязаны к конкретным изменениям</rule>
  <rule importance="critical">Указана оценка влияния и вероятности</rule>
  <rule importance="high">Есть меры снижения и мониторинга</rule>
  <rule importance="high">Критические зоны выделены явно</rule>
  <rule importance="medium">Остаточные риски зафиксированы</rule>
</quality_rules>

<do_not>
  <item importance="critical">Не игнорировать бизнес-риски</item>
  <item importance="high">Не оставлять риски без mitigation</item>
  <item importance="high">Не смешивать факты и предположения</item>
</do_not>

<examples>
  <good>
    <case>Риски: деградация производительности (medium/high) — mitigation: кэш и нагрузочные тесты; регрессия платежей (low/high) — mitigation: фича-флаг и мониторинг.</case>
    <why>Риски конкретны, есть оценка и mitigation</why>
  </good>
  <bad>
    <case>Рисков нет.</case>
    <why>Необоснованное утверждение</why>
  </bad>
</examples>
