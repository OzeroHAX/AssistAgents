---
name: planning-migration-strategy
description: Стратегия миграций данных, схем и контрактов
---

<input_requirements>
  <required>Краткое описание запроса или задачи</required>
  <optional>Что мигрируем (данные, схема, API, инфраструктура)</optional>
  <optional>Ограничения по срокам, риску и окружению</optional>
  <optional>Контекст текущей реализации (ключевые модули/файлы)</optional>
  <optional>Объем данных и окна для миграции</optional>
  <optional>Требования к обратной совместимости</optional>
</input_requirements>

<planning_goals>
  <goal>Сохранить доступность и целостность данных</goal>
  <goal>Минимизировать downtime и риск регрессий</goal>
  <goal>Обеспечить обратную совместимость и rollback</goal>
</planning_goals>

<analysis_steps>
  <step>Определить объекты миграции и зависимости</step>
  <step>Выбрать стратегию (expand/contract, dual-write, versioned API)</step>
  <step>Оценить объем, время, окна и риски</step>
  <step>Сформировать этапы миграции и проверки</step>
  <step>Согласовать rollback и критерии успеха</step>
</analysis_steps>

<plan_structure>
  <section>Короткое резюме цели миграции</section>
  <section>Что мигрируем и почему</section>
  <section>Стратегия миграции и обоснование</section>
  <section>Этапы миграции и зависимости</section>
  <section>Обратная совместимость</section>
  <section>План проверки и мониторинга</section>
  <section>Rollback plan</section>
  <section>Риски и открытые вопросы</section>
</plan_structure>

<output_format>
  <note>Формат гибкий, рекомендуется структура, близкая к Plan Mode Claude Code</note>
  <section>Summary</section>
  <section>Migration scope</section>
  <section>Migration strategy</section>
  <section>Phases / dependencies</section>
  <section>Backward compatibility</section>
  <section>Verification / monitoring</section>
  <section>Rollback plan</section>
  <section>Open questions / risks</section>
</output_format>

<quality_rules>
  <rule importance="critical">Стратегия миграции обеспечивает целостность данных</rule>
  <rule importance="critical">Есть план rollback</rule>
  <rule importance="high">Указаны этапы и зависимости</rule>
  <rule importance="high">Есть план проверки и мониторинга</rule>
  <rule importance="high">Обратная совместимость описана явно</rule>
</quality_rules>

<do_not>
  <item importance="critical">Не делать миграцию без rollback плана</item>
  <item importance="high">Не игнорировать окна и объем данных</item>
  <item importance="high">Не ломать контракты без версии</item>
</do_not>

<examples>
  <good>
    <case>Стратегия: expand/contract, dual-write, миграция фонами, verify checksum, rollback через переключение чтения на старую схему.</case>
    <why>Есть стратегия, этапы и rollback</why>
  </good>
  <bad>
    <case>Перенесем таблицу и посмотрим.</case>
    <why>Нет стратегии и проверки</why>
  </bad>
</examples>
