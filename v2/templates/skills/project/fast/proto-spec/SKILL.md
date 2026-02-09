---
name: project-fast-proto-spec
description: Компактный проектный spec для одной итерации (быстрый PRD + архитектурный каркас + верификация)
---

<purpose>
  <item>Собрать единый рабочий документ, достаточный для немедленной декомпозиции в задачи</item>
  <item>Использовать компактный quick-spec подход под fast-поток без потери проверяемости</item>
</purpose>

<when_to_use>
  <item importance="critical">После выбора стека и перед task-blast</item>
  <item importance="high">Когда нужен быстрый переход от идеи к implementable backlog</item>
</when_to_use>

<required_preload>
  <item>planning-requirements-extraction</item>
  <item>planning-scope-definition</item>
  <item>planning-testing-strategy</item>
  <item>planning-monitoring-checks</item>
</required_preload>

<inputs>
  <required>Цель, scope, риски и выбранный стек</required>
  <optional>UX/flow ограничения и ключевые use-cases</optional>
  <optional>Нефункциональные требования (perf/security/reliability)</optional>
</inputs>

<method>
  <step>Сформулировать функциональные требования и acceptance criteria (Given/When/Then)</step>
  <step>Зафиксировать NFR-lite только по критичным параметрам</step>
  <step>Описать архитектурный каркас: компоненты, интеграции, контракты, границы</step>
  <step>Сделать file-level change map и зависимости</step>
  <step>Определить минимальную test strategy: quick signal + regression signal</step>
  <step>Зафиксировать quality gate: PASS/CONCERNS/FAIL для завершения планирования</step>
</method>

<output_format>
  <section>Goal</section>
  <section>Functional requirements</section>
  <section>Acceptance criteria (Given/When/Then)</section>
  <section>NFR-lite</section>
  <section>Architecture constraints and decisions</section>
  <section>File-level change map</section>
  <section>Testing strategy</section>
  <section>Planning quality gate</section>
  <section>Open questions</section>
</output_format>

<quality_rules>
  <rule importance="critical">AC проверяемы и не содержат технической реализации</rule>
  <rule importance="critical">Есть явные границы решения и список исключений</rule>
  <rule importance="high">File-level map достаточен для декомпозиции в задачи без догадок</rule>
  <rule importance="high">Quality gate содержит причины и next action</rule>
</quality_rules>

<do_not>
  <item importance="critical">Не превращать proto-spec в длинный multi-iteration PRD</item>
  <item importance="high">Не включать второстепенные NFR, не влияющие на MVP</item>
</do_not>
