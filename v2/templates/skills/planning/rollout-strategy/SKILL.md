---
name: planning-rollout-strategy
description: Стратегия выката: этапы, аудитории, механика включения, точки остановки
---

<purpose>
  <item>Снизить риск деградации при выкате и обеспечить управляемость включения</item>
</purpose>

<inputs>
  <required>Описание изменения + риски/критичность</required>
  <optional>Доступные механизмы (feature flags, canary, blue-green)</optional>
  <optional>Ограничения по релизам/окнам</optional>
</inputs>

<method>
  <step>Выбрать механику выката (flag/canary/blue-green) под риск и процесс</step>
  <step>Определить этапы (аудитория/процент/время) и критерии перехода между этапами</step>
  <step>Определить точки остановки и действия при деградации</step>
  <step>Зафиксировать коммуникации/ответственных (если влияет на прод)</step>
</method>

<output_format>
  <section>Rollout mechanism</section>
  <section>Stages</section>
  <section>Gates / stop points</section>
  <section>Actions on degradation</section>
</output_format>

<quality_rules>
  <rule importance="critical">Этапы и gates конкретны (процент/время/условия)</rule>
  <rule importance="high">Есть явные действия при деградации, не «посмотрим»</rule>
</quality_rules>
