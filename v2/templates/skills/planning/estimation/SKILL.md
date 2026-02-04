---
name: planning-estimation
description: Оценка времени/объема: метод, диапазон, предпосылки и неопределенность
---

<purpose>
  <item>Дать прозрачную оценку, привязанную к декомпозиции и рискам</item>
</purpose>

<inputs>
  <required>Инвентаризация изменений или декомпозиция работ</required>
  <optional>Блокеры/зависимости/качество/процессные ограничения</optional>
</inputs>

<method>
  <step>Оценить по этапам (analysis/implementation/tests/rollout) или по компонентам</step>
  <step>Выбрать метод оценки (three-point, t-shirt, points) и назвать его</step>
  <step>Дать диапазон (min/likely/max) и предпосылки</step>
  <step>Указать факторы, которые могут сдвинуть оценку</step>
</method>

<output_format>
  <section>Breakdown</section>
  <section>Estimation method</section>
  <section>Estimate range</section>
  <section>Assumptions</section>
  <section>What could change the estimate</section>
</output_format>

<quality_rules>
  <rule importance="critical">Оценка основана на декомпозиции, а не на «ощущениях»</rule>
  <rule importance="critical">Есть диапазон и предпосылки</rule>
</quality_rules>

<do_not>
  <item importance="critical">Не давать точное число без диапазона, если есть неопределенность</item>
  <item importance="high">Не смешивать оценку и обещание сроков</item>
</do_not>
