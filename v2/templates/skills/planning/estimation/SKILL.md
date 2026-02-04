---
name: planning-estimation
description: Оценка времени и объема работ по изменениям в коде
---

<input_requirements>
  <required>Краткое описание запроса или задачи</required>
  <optional>Предполагаемый scope и список изменений</optional>
  <optional>Ограничения по срокам, риску и окружению</optional>
  <optional>Известные зависимости и блокеры</optional>
  <optional>Тестовый контур и требования к качеству</optional>
  <optional>Командные/процессные ограничения</optional>
</input_requirements>

<planning_goals>
  <goal>Дать прозрачную и обоснованную оценку</goal>
  <goal>Выявить риски и источники неопределенности</goal>
  <goal>Сформировать диапазон и предпосылки</goal>
</planning_goals>

<analysis_steps>
  <step>Разбить работу на этапы и подзадачи</step>
  <step>Оценить сложность, риск и зависимости</step>
  <step>Выбрать метод оценки (t-shirt, points, three-point)</step>
  <step>Сформировать диапазон с предпосылками</step>
  <step>Зафиксировать что может изменить оценку</step>
</analysis_steps>

<plan_structure>
  <section>Короткое резюме и контекст</section>
  <section>Декомпозиция на этапы</section>
  <section>Метод оценки и объяснение</section>
  <section>Диапазон оценки</section>
  <section>Предпосылки и ограничения</section>
  <section>Риски и факторы неопределенности</section>
  <section>Что может изменить оценку</section>
</plan_structure>

<output_format>
  <note>Формат гибкий, рекомендуется структура, близкая к Plan Mode Claude Code</note>
  <section>Summary</section>
  <section>Breakdown</section>
  <section>Estimation method</section>
  <section>Estimate range</section>
  <section>Assumptions / constraints</section>
  <section>Risks / uncertainties</section>
  <section>What could change the estimate</section>
</output_format>

<quality_rules>
  <rule importance="critical">Оценка привязана к декомпозиции</rule>
  <rule importance="critical">Есть диапазон и предпосылки</rule>
  <rule importance="high">Указаны риски и блокеры</rule>
  <rule importance="high">Метод оценки прозрачен</rule>
  <rule importance="medium">Обозначены факторы, меняющие оценку</rule>
</quality_rules>

<do_not>
  <item importance="critical">Не давать точную оценку без диапазона</item>
  <item importance="high">Не скрывать неопределенность</item>
  <item importance="high">Не смешивать оценку и обещание сроков</item>
</do_not>

<examples>
  <good>
    <case>Оценка: 3–5 дней. Этапы: анализ 0.5, реализация 2–3, тесты 1, rollout 0.5. Метод: three-point. Риски: неизвестные интеграции.</case>
    <why>Есть диапазон, метод и декомпозиция</why>
  </good>
  <bad>
    <case>Сделаем за пару дней.</case>
    <why>Нет диапазона, нет предпосылок</why>
  </bad>
</examples>
