---
name: planning-scope-definition
description: Определение границ задачи (in/out), допущения и не-цели
---

<purpose>
  <item>Стабилизировать план: зафиксировать, что делаем и что не делаем</item>
</purpose>

<inputs>
  <required>Goal или требования</required>
  <optional>Ограничения по срокам/риску/процессу</optional>
  <optional>Смежные области, которые трогать нельзя</optional>
</inputs>

<method>
  <step>Сформировать список In scope как конечные результаты/поведения</step>
  <step>Сформировать список Out of scope как явные исключения (с причинами)</step>
  <step>Выписать допущения, которые влияют на реализацию</step>
  <step>Выписать открытые вопросы, которые меняют scope или приоритеты</step>
</method>

<output_format>
  <section>In scope</section>
  <section>Out of scope</section>
  <section>Assumptions</section>
  <section>Open questions</section>
</output_format>

<quality_rules>
  <rule importance="critical">In/Out формулируются как проверяемые утверждения, а не общие слова</rule>
  <rule importance="high">Out of scope конкретен (чтобы защититься от расползания)</rule>
</quality_rules>
