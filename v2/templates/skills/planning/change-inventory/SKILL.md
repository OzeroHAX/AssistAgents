---
name: planning-change-inventory
description: Инвентаризация изменений: список файлов/компонентов и что меняется в каждом
---

<purpose>
  <item>Сделать план исполнимым: зафиксировать конкретные точки правок и порядок</item>
</purpose>

<inputs>
  <required>Цель/требования + зоны влияния</required>
  <optional>Ограничения по архитектуре/стеку</optional>
</inputs>

<method>
  <step>Составить список артефактов (файлы/модули/конфиги/миграции)</step>
  <step>Для каждого указать: что меняем и зачем (связь с AC/bug)</step>
  <step>Отметить зависимости и порядок (что нужно сделать раньше)</step>
  <step>Отметить изменения с высоким риском (для доп. проверки)</step>
</method>

<output_format>
  <section>Artifacts list</section>
  <section>Changes per artifact</section>
  <section>Dependencies / order</section>
</output_format>

<quality_rules>
  <rule importance="critical">Список конечный и конкретный (не «поменять пару файлов»)</rule>
  <rule importance="high">Каждое изменение связано с целью или AC</rule>
</quality_rules>
