---
name: planning-requirements
description: Сбор и анализ требований для планирования изменений в коде
---

<input_requirements>
  <required>Краткое описание запроса или задачи</required>
  <optional>Бизнес-цель или метрика успеха</optional>
  <optional>Существующие требования/AC (если есть)</optional>
  <optional>Ограничения по срокам, риску и окружению</optional>
  <optional>Контекст текущей реализации (ключевые модули/файлы)</optional>
</input_requirements>

<planning_goals>
  <goal>Выделить функциональные и нефункциональные требования</goal>
  <goal>Снять неоднозначности и зафиксировать ожидания</goal>
  <goal>Подготовить основу для плана изменений</goal>
</planning_goals>

<analysis_steps>
  <step>Сформулировать ожидаемое поведение и границы</step>
  <step>Определить пользователей и сценарии</step>
  <step>Зафиксировать ограничения и зависимости</step>
  <step>Выявить риски и открытые вопросы</step>
  <step>Подготовить список проверяемых критериев</step>
</analysis_steps>

<plan_structure>
  <section>Короткое резюме запроса</section>
  <section>Функциональные требования</section>
  <section>Нефункциональные требования</section>
  <section>Scope / Out of scope</section>
  <section>Сценарии использования</section>
  <section>Ограничения и зависимости</section>
  <section>Риски и открытые вопросы</section>
  <section>Критерии приемки</section>
</plan_structure>

<output_format>
  <section>Summary</section>
  <section>Functional requirements</section>
  <section>Non-functional requirements</section>
  <section>Scope / Out of scope</section>
  <section>Use cases</section>
  <section>Dependencies / constraints</section>
  <section>Acceptance criteria</section>
  <section>Open questions / risks</section>
</output_format>

<quality_rules>
  <rule importance="critical">Требования однозначны и проверяемы</rule>
  <rule importance="critical">Scope и out-of-scope сформулированы явно</rule>
  <rule importance="high">Указаны ключевые сценарии и роли</rule>
  <rule importance="high">Нефункциональные требования не теряются</rule>
  <rule importance="high">Открытые вопросы вынесены отдельно</rule>
</quality_rules>

<do_not>
  <item importance="critical">Не предполагать требования без подтверждения</item>
  <item importance="high">Не смешивать требования и решения</item>
  <item importance="high">Не игнорировать ограничения и зависимости</item>
</do_not>

<examples>
  <good>
    <case>Требования: поддержка SSO для корпоративных пользователей, время логина &lt;2s, аудит входов, scope без изменений пользовательского профиля.</case>
    <why>Есть функциональные и нефункциональные требования и границы</why>
  </good>
  <bad>
    <case>Нужно сделать удобнее.</case>
    <why>Нет критериев и проверяемости</why>
  </bad>
</examples>
