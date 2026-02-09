---
name: project-standart-arch
description: Архитектурное проектирование под PRD/use-cases в standard-потоке
---

<purpose>
  <item>Зафиксировать архитектурные решения, ограничения и контракты для безопасной реализации</item>
  <item>Свести риски интеграций и масштабирования до начала декомпозиции в задачи</item>
</purpose>

<when_to_use>
  <item importance="critical">После PRD и use cases, до эпиков и decomposition</item>
  <item importance="high">Когда есть интеграции, миграции, публичные контракты или нефункциональные риски</item>
</when_to_use>

<required_preload>
  <item>shared-base-rules</item>
  <item>shared-docs-paths</item>
  <item>planning-impact-analysis</item>
  <item>planning-risk-assessment</item>
  <item>planning-migration-strategy</item>
</required_preload>

<document_target>
  <rule importance="critical">Создать/обновить `arch.md`</rule>
</document_target>

<method>
  <step>Определить компоненты, границы ответственности и ключевые потоки данных</step>
  <step>Зафиксировать контракты: API/events/schema и совместимость</step>
  <step>Описать архитектурные решения и trade-offs</step>
  <step>Указать риски, mitigations и fallback-стратегии</step>
  <step>Сформировать ограничения для эпиков и задач (implementation guardrails)</step>
</method>

<output_format>
  <section>Architecture goals and constraints</section>
  <section>Component model and data flows</section>
  <section>Interfaces and contracts</section>
  <section>Key decisions and trade-offs</section>
  <section>Risks and mitigations</section>
  <section>Implementation guardrails</section>
</output_format>

<quality_rules>
  <rule importance="critical">Архитектура покрывает все критичные PRD/use-case требования</rule>
  <rule importance="critical">Внешние контракты перечислены явно</rule>
  <rule importance="high">Каждое решение имеет обоснование и последствия</rule>
</quality_rules>
