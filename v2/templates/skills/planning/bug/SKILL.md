---
name: planning-bug
description: Планирование фикса багов и регрессий в коде
---

<input_requirements>
  <required>Краткое описание бага или регрессии</required>
  <required>Ожидаемое и фактическое поведение</required>
  <optional>Шаги воспроизведения и окружение</optional>
  <optional>Логи, ошибки, скриншоты</optional>
  <optional>Контекст текущей реализации (ключевые модули/файлы)</optional>
  <optional>Ограничения по срокам, риску и окружению</optional>
</input_requirements>

<planning_goals>
  <goal>Понять корень проблемы и область влияния</goal>
  <goal>Определить минимальный безопасный фикc</goal>
  <goal>Сформировать проверяемый план исправления</goal>
</planning_goals>

<analysis_steps>
  <step>Зафиксировать воспроизведение и условия бага</step>
  <step>Выделить зону влияния: модули, контракты, данные</step>
  <step>Определить гипотезу причины и подход к фиксу</step>
  <step>Оценить риск регрессии и совместимость</step>
  <step>Сформировать план проверки и регресса</step>
</analysis_steps>

<plan_structure>
  <section>Короткое резюме проблемы и цели фикса</section>
  <section>Текущее поведение или состояние (что есть сейчас)</section>
  <section>Ожидаемое поведение</section>
  <section>Scope / Out of scope</section>
  <section>Файлы к изменению</section>
  <section>Изменения по файлам (что и зачем)</section>
  <section>Точки интеграции и контракты</section>
  <section>Миграции и обратная совместимость</section>
  <section>План тестирования</section>
  <section>Rollout / rollback</section>
  <section>Риски и открытые вопросы</section>
</plan_structure>

<output_format>
  <section>Summary</section>
  <section>Current behavior</section>
  <section>Expected behavior</section>
  <section>Files to modify</section>
  <section>Changes per file</section>
  <section>Prerequisites / repro setup</section>
  <section>Verification steps</section>
  <section>Open questions / risks</section>
</output_format>

<quality_rules>
  <rule importance="critical">Фикс связан с наблюдаемым багом или регрессией</rule>
  <rule importance="critical">Описаны текущие и ожидаемые результаты</rule>
  <rule importance="high">Указаны затронутые модули и контракты</rule>
  <rule importance="high">Есть план проверки и регресса</rule>
  <rule importance="high">Минимальный scope без лишних изменений</rule>
  <rule importance="medium">Открытые вопросы вынесены отдельно</rule>
</quality_rules>

<do_not>
  <item importance="critical">Не фиксить без подтвержденного воспроизведения</item>
  <item importance="high">Не расширять scope за пределы бага</item>
  <item importance="high">Не игнорировать риск регрессии</item>
  <item importance="high">Не путать гипотезы причины с фактами</item>
</do_not>

<examples>
  <good>
    <case>План: воспроизвести 500 при создании заказа, локализовать в сервисе billing, добавить проверку null, обновить контракт ответа, покрыть unit и e2e, rollout через feature flag.</case>
    <why>Есть воспроизведение, минимальный фикс, тесты и rollout</why>
  </good>
  <bad>
    <case>Просто починить и посмотреть.</case>
    <why>Нет воспроизведения, scope и проверки</why>
  </bad>
</examples>
