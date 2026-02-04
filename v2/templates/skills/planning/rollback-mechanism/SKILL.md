---
name: planning-rollback-mechanism
description: Механика и сценарий отката: критерии, шаги, влияние на данные, восстановление
---

<purpose>
  <item>Сформировать быстрый и безопасный путь возврата при деградации</item>
</purpose>

<inputs>
  <required>Описание изменения + стратегия выката</required>
  <optional>Ограничения по данным/совместимости (особенно при миграции)</optional>
  <optional>Доступные механизмы: revert, feature flag, blue-green</optional>
</inputs>

<method>
  <step>Определить критерии отката (сигналы деградации, пороги, время)</step>
  <step>Выбрать механизм отката и оценить время восстановления (RTO)</step>
  <step>Описать шаги отката (операционные действия) и порядок</step>
  <step>Описать влияние на данные и совместимость после отката</step>
  <step>Определить проверку после отката (минимум: ключевые сценарии + метрики)</step>
</method>

<output_format>
  <section>Rollback criteria</section>
  <section>Rollback mechanism + expected time</section>
  <section>Rollback steps</section>
  <section>Data impact / compatibility</section>
  <section>Post-rollback verification</section>
</output_format>

<quality_rules>
  <rule importance="critical">Rollback выполним за понятное время и описан пошагово</rule>
  <rule importance="high">Указано влияние на данные (что будет с частично примененными изменениями)</rule>
</quality_rules>

<do_not>
  <item importance="critical">Не оставлять rollback как «если что, откатим» без механики</item>
  <item importance="high">Не планировать rollback, который требует ручной правки данных без проверки</item>
</do_not>
