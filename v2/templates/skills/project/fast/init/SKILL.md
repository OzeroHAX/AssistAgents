---
name: project-fast-init
description: Быстрый запуск планирования проекта в одну итерацию (рамки, цель, артефакты)
---

<purpose>
  <item>Зафиксировать цель проекта, границы и критерии готовности fast-планирования</item>
  <item>Подготовить минимальный набор артефактов для одной итерации</item>
</purpose>

<when_to_use>
  <item importance="critical">В самом начале fast-планирования нового проекта или крупной инициативы</item>
  <item importance="high">Когда нужно быстро перейти от идеи к implementable плану без длинной discovery-фазы</item>
</when_to_use>

<required_preload>
  <item>shared-base-rules</item>
</required_preload>

<inputs>
  <required>Запрос пользователя/заказчика в свободной форме</required>
  <optional>Ограничения по срокам, бюджету, команде, комплаенсу</optional>
  <optional>Контекст существующей системы или интеграций</optional>
</inputs>

<method>
  <step>Сформулировать цель как измеримый outcome, а не список действий</step>
  <step>Ограничить fast-итерацию: определить in-scope и out-of-scope</step>
  <step>Зафиксировать timebox одной итерации планирования (обычно 60-120 минут)</step>
  <step>Определить минимальные обязательные результаты fast-потока</step>
  <step>Выделить критичные неизвестные, которые могут заблокировать one-iteration план</step>
</method>

<output_format>
  <section>Goal</section>
  <section>In scope</section>
  <section>Out of scope</section>
  <section>Timebox</section>
  <section>Minimal artifacts to produce</section>
  <section>Critical unknowns</section>
</output_format>

<quality_rules>
  <rule importance="critical">Границы задачи зафиксированы явно и проверяемо</rule>
  <rule importance="critical">Есть критерий завершения именно планирования (planning done), а не реализации</rule>
  <rule importance="high">Минимальный набор артефактов определен до старта детализации</rule>
</quality_rules>

<do_not>
  <item importance="critical">Не переходить к реализации до фиксации рамок fast-итерации</item>
  <item importance="high">Не расширять scope без явной эскалации в standard-поток</item>
</do_not>
