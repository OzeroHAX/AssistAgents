---
name: planning-strategy
description: Стратегия планирования изменений и подходы к реализации
---

<input_requirements>
  <required>Краткое описание запроса или задачи</required>
  <optional>Цели, метрики успеха и критерии приемки</optional>
  <optional>Ограничения по срокам, риску и окружению</optional>
  <optional>Контекст текущей реализации (ключевые модули/файлы)</optional>
  <optional>Командные/процессные ограничения (релизы, окна, SLA)</optional>
</input_requirements>

<planning_goals>
  <goal>Выбрать подход к реализации (итеративный, по этапам, big bang)</goal>
  <goal>Сбалансировать скорость, риск и качество</goal>
  <goal>Определить минимальный безопасный план работ</goal>
</planning_goals>

<analysis_steps>
  <step>Оценить сложность и область влияния</step>
  <step>Выбрать стратегию реализации и критерии принятия решения</step>
  <step>Определить этапы, зависимости и checkpoints</step>
  <step>Согласовать подход к rollout и rollback</step>
  <step>Зафиксировать план проверки и успеха</step>
</analysis_steps>

<plan_structure>
  <section>Короткое резюме задачи и цели</section>
  <section>Текущее состояние и ограничения</section>
  <section>Варианты стратегий (1-3) и сравнение</section>
  <section>Выбранная стратегия и почему</section>
  <section>Этапы и зависимости</section>
  <section>Rollout / rollback</section>
  <section>План тестирования и проверки</section>
  <section>Риски и открытые вопросы</section>
  <section>Оценка и критерии успеха</section>
</plan_structure>

<output_format>
  <note>Формат гибкий, рекомендуется структура, близкая к Plan Mode Claude Code</note>
  <section>Summary</section>
  <section>Current state / constraints</section>
  <section>Strategy options</section>
  <section>Chosen strategy</section>
  <section>Phases / dependencies</section>
  <section>Prerequisites / setup</section>
  <section>Verification steps</section>
  <section>Open questions / risks</section>
</output_format>

<quality_rules>
  <rule importance="critical">Стратегия соответствует ограничениям и риску</rule>
  <rule importance="critical">Есть обоснование выбора стратегии</rule>
  <rule importance="high">Этапы и зависимости четко определены</rule>
  <rule importance="high">Есть план проверки и критерии успеха</rule>
  <rule importance="high">Есть стратегия rollback</rule>
  <rule importance="medium">Открытые вопросы вынесены отдельно</rule>
</quality_rules>

<do_not>
  <item importance="critical">Не выбирать стратегию без оценки рисков</item>
  <item importance="high">Не игнорировать процессные ограничения</item>
  <item importance="high">Не оставлять план без checkpoints</item>
</do_not>

<examples>
  <good>
    <case>Стратегия: итеративный rollout по модулям, feature flags, этапы с проверкой метрик, rollback через переключение флагов.</case>
    <why>Есть обоснование, этапы и контроль риска</why>
  </good>
  <bad>
    <case>Сделать все разом, чтобы быстрее.</case>
    <why>Нет оценки рисков и контроля качества</why>
  </bad>
</examples>
