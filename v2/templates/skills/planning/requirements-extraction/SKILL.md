---
name: planning-requirements-extraction
description: Извлечение требований из запроса: поведение, AC, ограничения, для бага — repro
---

<purpose>
  <item>Преобразовать исходный запрос в проверяемые требования и сигналы приемки</item>
</purpose>

<inputs>
  <required>Описание задачи</required>
  <optional>Для бага: шаги воспроизведения, окружение, логи/stacktrace</optional>
  <optional>Для фичи: пользовательская цель, ограничения, желаемый UX</optional>
</inputs>

<method>
  <step>Сформулировать цель как изменение поведения/результата</step>
  <step>Выписать функциональные требования (что должно происходить)</step>
  <step>Выписать нефункциональные требования (perf, security, reliability) только если они релевантны</step>
  <step>Сформировать 3-7 критериев приемки (AC), проверяемых тестом или наблюдением</step>
  <step>Для бага: зафиксировать observed vs expected и repro (или явно указать, что repro неизвестен)</step>
</method>

<output_format>
  <section>Goal</section>
  <section>Functional requirements</section>
  <section>Non-functional requirements (if any)</section>
  <section>Acceptance criteria</section>
  <section>Bug repro / observed vs expected (if bug)</section>
  <section>Open questions</section>
</output_format>

<quality_rules>
  <rule importance="critical">AC конкретны, проверяемы и не содержат деталей реализации</rule>
  <rule importance="high">Ограничения/зависимости не теряются (если они влияют на план)</rule>
  <rule importance="high">Для бага явно отделены факты от гипотез</rule>
</quality_rules>

<do_not>
  <item importance="critical">Не превращать требования в список технических задач</item>
  <item importance="high">Не придумывать AC без подтверждения — если данных нет, это вопрос</item>
</do_not>
