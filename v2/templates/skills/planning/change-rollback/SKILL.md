---
name: planning-change-rollback
description: Планирование отката изменений и безопасного возврата
---

<input_requirements>
  <required>Краткое описание изменений или задачи</required>
  <optional>Критерии остановки и отката</optional>
  <optional>Контекст текущей реализации (ключевые модули/файлы)</optional>
  <optional>Ограничения по срокам, риску и окружению</optional>
  <optional>Инфраструктурные возможности (feature flags, blue-green, canary)</optional>
</input_requirements>

<planning_goals>
  <goal>Сформировать безопасный и быстрый сценарий отката</goal>
  <goal>Снизить риск деградации сервиса</goal>
  <goal>Обеспечить проверяемые критерии возврата</goal>
</planning_goals>

<analysis_steps>
  <step>Определить точки возврата и условия отката</step>
  <step>Выбрать механизм rollback (flags, blue-green, versioned API)</step>
  <step>Оценить влияние на данные и совместимость</step>
  <step>Сформировать план проверки и мониторинга после отката</step>
  <step>Подготовить шаги восстановления сервиса</step>
</analysis_steps>

<plan_structure>
  <section>Короткое резюме изменений и цели rollback</section>
  <section>Критерии отката</section>
  <section>Механизмы rollback и зависимости</section>
  <section>Шаги отката по этапам</section>
  <section>Влияние на данные и совместимость</section>
  <section>План проверки и мониторинга после отката</section>
  <section>Риски и открытые вопросы</section>
</plan_structure>

<output_format>
  <note>Формат гибкий, рекомендуется структура, близкая к Plan Mode Claude Code</note>
  <section>Summary</section>
  <section>Rollback criteria</section>
  <section>Rollback mechanism</section>
  <section>Rollback steps</section>
  <section>Data impact / compatibility</section>
  <section>Verification / monitoring</section>
  <section>Open questions / risks</section>
</output_format>

<quality_rules>
  <rule importance="critical">Критерии отката четкие и измеримые</rule>
  <rule importance="critical">Есть конкретные шаги rollback</rule>
  <rule importance="high">Учитывается влияние на данные</rule>
  <rule importance="high">Есть план проверки после отката</rule>
  <rule importance="medium">Открытые вопросы вынесены отдельно</rule>
</quality_rules>

<do_not>
  <item importance="critical">Не оставлять rollback как "на потом"</item>
  <item importance="high">Не игнорировать влияние на данные</item>
  <item importance="high">Не проводить откат без мониторинга</item>
</do_not>

<examples>
  <good>
    <case>Rollback: выключить feature flag, перевести чтение на старую схему, проверить ключевые метрики, валидировать данные, восстановить сервис.</case>
    <why>Есть критерии, шаги и проверка</why>
  </good>
  <bad>
    <case>Если что, откатим.</case>
    <why>Нет критериев и действий</why>
  </bad>
</examples>
