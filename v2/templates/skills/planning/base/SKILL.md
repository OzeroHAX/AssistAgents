---
name: planning-base
description: База для планирования правок: формат, принципы, качество
---

<purpose>
  <item>Дать универсальный каркас плана правок: коротко, проверяемо, без предположений</item>
  <item>Задать правила качества: что считать хорошим планом и что нельзя делать</item>
</purpose>

<when_to_use>
  <item importance="critical">Всегда перед тем, как выдавать план изменений</item>
  <item importance="high">Когда задача неоднозначна и нужно зафиксировать вопросы/допущения</item>
</when_to_use>

<core_principles>
  <rule importance="critical">Разделяй факты, допущения и решения</rule>
  <rule importance="critical">План должен быть проверяемым: каждый пункт можно подтвердить тестом/наблюдением</rule>
  <rule importance="high">Изменения инкрементальные, с точками остановки</rule>
  <rule importance="high">Не подменяй требования решениями: сначала «что», потом «как»</rule>
  <rule importance="high">Пиши только релевантные секции: не заполняй шаблон ради шаблона</rule>
</core_principles>

<default_output_format>
  <section>Goal</section>
  <section>Constraints</section>
  <section>Proposed change</section>
  <section>Risks</section>
  <section>Verification</section>
  <section>Rollout / rollback (if needed)</section>
  <section>Open questions</section>
</default_output_format>

<quality_rules>
  <rule importance="critical">Цель формулируется как поведение/результат, а не как список действий</rule>
  <rule importance="critical">Есть критерии принятия результата (что значит «готово»)</rule>
  <rule importance="high">Указаны границы: что точно не делаем в рамках задачи</rule>
  <rule importance="high">Есть план проверки (минимум: один быстрый сигнал + один регрессионный)</rule>
  <rule importance="medium">Открытые вопросы явно перечислены и влияют на план</rule>
</quality_rules>

<do_not>
  <item importance="critical">Не выдавать план, построенный на скрытых допущениях</item>
  <item importance="critical">Не смешивать независимые цели в один change-set без причины</item>
  <item importance="high">Не добавлять «улучшения заодно» без явной цели</item>
</do_not>

<examples>
  <good>
    <case>Goal: убрать 500 на /orders. Proposed change: добавить guard на null tax и тест на регрессию. Verification: воспроизведение исчезло, тест зеленый. Risks: затронем расчет налогов. Open questions: есть ли legacy клиенты без tax?</case>
    <why>Есть цель, конкретное изменение, проверка, риски и вопросы</why>
  </good>
  <bad>
    <case>Сделать как-нибудь и проверить руками.</case>
    <why>Нет проверяемости и конкретики</why>
  </bad>
</examples>
