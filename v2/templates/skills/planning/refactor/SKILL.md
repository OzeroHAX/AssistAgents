---
name: planning-refactor
description: Планирование рефакторинга и улучшения качества кода
---

<input_requirements>
  <required>Краткое описание области и целей рефакторинга</required>
  <optional>Болевые точки (debt, maintainability, performance)</optional>
  <optional>Критерии приемки и ожидаемый эффект</optional>
  <optional>Контекст текущей реализации (ключевые модули/файлы)</optional>
  <optional>Ограничения по срокам, риску и окружению</optional>
  <optional>Текущие тесты и покрытие</optional>
</input_requirements>

<planning_goals>
  <goal>Сделать изменения безопасными и инкрементальными</goal>
  <goal>Минимизировать регрессии и улучшить качество</goal>
  <goal>Зафиксировать критерии успеха</goal>
</planning_goals>

<analysis_steps>
  <step>Определить проблемные зоны и метрики улучшения</step>
  <step>Выделить минимальные шаги рефакторинга</step>
  <step>Оценить тестовый контур и необходимость дополнительного покрытия</step>
  <step>Проверить совместимость и влияние на API/контракты</step>
  <step>Сформировать план rollout и rollback</step>
</analysis_steps>

<plan_structure>
  <section>Короткое резюме целей и мотивации</section>
  <section>Текущее состояние и проблемы</section>
  <section>Scope / Out of scope</section>
  <section>Файлы к изменению</section>
  <section>Изменения по файлам (что и зачем)</section>
  <section>Точки интеграции и контракты</section>
  <section>Миграции и обратная совместимость</section>
  <section>План тестирования</section>
  <section>Rollout / rollback</section>
  <section>Риски и открытые вопросы</section>
  <section>Оценка и этапы (если требуется)</section>
</plan_structure>

<output_format>
  <section>Summary</section>
  <section>Current state</section>
  <section>Files to modify</section>
  <section>Changes per file</section>
  <section>Prerequisites / safety checks</section>
  <section>Verification steps</section>
  <section>Open questions / risks</section>
</output_format>

<quality_rules>
  <rule importance="critical">Рефакторинг не меняет внешнее поведение без явного согласования</rule>
  <rule importance="critical">Есть критерии успеха и проверяемые метрики</rule>
  <rule importance="high">План инкрементальный и безопасный</rule>
  <rule importance="high">Есть план проверки и регресса</rule>
  <rule importance="high">Отражены риски и точки интеграции</rule>
  <rule importance="medium">Открытые вопросы вынесены отдельно</rule>
</quality_rules>

<do_not>
  <item importance="critical">Не делать "big bang" без согласования</item>
  <item importance="high">Не смешивать рефакторинг с фичами</item>
  <item importance="high">Не ухудшать тестовый контур</item>
  <item importance="high">Не скрывать изменения внешних контрактов</item>
</do_not>

<examples>
  <good>
    <case>План: выделить слой репозитория, покрыть ключевые сервисы unit-тестами, заменить дублирующую логику в 3 модулях, сохранить API, rollout по модулям.</case>
    <why>Инкрементально, указан тестовый контур и совместимость</why>
  </good>
  <bad>
    <case>Переписать ядро и посмотреть.</case>
    <why>Нет scope, нет проверки, высокий риск</why>
  </bad>
</examples>
