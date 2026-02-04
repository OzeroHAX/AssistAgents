---
name: planning-feature
description: Планирование изменений в коде для фичи или запроса пользователя
---

<input_requirements>
  <required>Краткое описание запроса или задачи</required>
  <optional>Ожидаемое поведение и критерии приемки</optional>
  <optional>Ограничения по срокам, риску и окружению</optional>
  <optional>Контекст текущей реализации (ключевые модули/файлы)</optional>
  <optional>Нефункциональные требования (perf, security, reliability)</optional>
  <optional>Ограничения по архитектуре/стеку</optional>
  <optional>Зависимости от внешних систем и контрактов</optional>
</input_requirements>

<planning_goals>
  <goal>Понять, что именно меняется и почему</goal>
  <goal>Определить минимальный безопасный scope изменений</goal>
  <goal>Сформировать реалистичный и проверяемый план работ</goal>
</planning_goals>

<analysis_steps>
  <step>Выделить целевое поведение и edge-cases</step>
  <step>Определить затрагиваемые модули, API, данные и зависимости</step>
  <step>Оценить совместимость и миграции (если нужны)</step>
  <step>Определить тестовый контур и критерии проверки</step>
  <step>Сформировать план rollout и rollback</step>
</analysis_steps>

<plan_structure>
  <section>Короткое резюме изменений и мотивации</section>
  <section>Текущее поведение или состояние (что есть сейчас)</section>
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
  <section>Files to modify</section>
  <section>Changes per file</section>
  <section>Prerequisites / setup</section>
  <section>Verification steps</section>
  <section>Open questions / risks</section>
</output_format>

<quality_rules>
  <rule importance="critical">Каждое изменение связано с требованием или AC</rule>
  <rule importance="critical">Scope и out-of-scope сформулированы явно</rule>
  <rule importance="high">Указаны затронутые модули и интерфейсы</rule>
  <rule importance="high">Есть план проверки и критерии успеха</rule>
  <rule importance="high">Есть стратегия rollout/rollback для риска</rule>
  <rule importance="medium">Открытые вопросы вынесены отдельно</rule>
</quality_rules>

<do_not>
  <item importance="critical">Не переходить к реализации без согласованного плана</item>
  <item importance="high">Не расширять scope без явного запроса</item>
  <item importance="high">Не игнорировать совместимость и миграции</item>
  <item importance="high">Не смешивать требования и предположения</item>
</do_not>

<examples>
  <good>
    <case>План: изменить валидацию email на уровне сервиса и UI, обновить тесты, добавить миграцию для уникального индекса, rollout через feature flag.</case>
    <why>Есть связь с требованием, указан scope, тесты и rollout</why>
  </good>
  <bad>
    <case>Сделать как-нибудь, поменяв пару файлов.</case>
    <why>Нет scope, нет критериев, нет проверки</why>
  </bad>
</examples>
