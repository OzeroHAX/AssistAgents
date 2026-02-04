---
name: planning-scope-minimization
description: Минимизация правок для багов/инцидентов: самый маленький безопасный фикс
---

<purpose>
  <item>Сузить план до минимального изменения, которое устраняет баг и снижает риск регрессий</item>
</purpose>

<inputs>
  <required>Описание бага + observed vs expected</required>
  <optional>Repro шаги, окружение, логи/stacktrace</optional>
  <optional>Критичность (SLA, инцидент) и дедлайн</optional>
</inputs>

<method>
  <step>Определить минимальный критерий «починено» (одно предложение)</step>
  <step>Найти узкую точку изменения: самый близкий к причине слой (guard/валидация/условие)</step>
  <step>Запретить «улучшения заодно»: рефакторинг/переименования/форматирование — только если необходимо для фикса</step>
  <step>Зафиксировать, что явно НЕ меняем (API, схемы, UX и т.п.)</step>
  <step>Сформировать минимальный регрессионный набор проверок вокруг точки изменения</step>
</method>

<output_format>
  <section>Fix definition (minimal done)</section>
  <section>Minimal change surface</section>
  <section>Explicit non-goals</section>
  <section>Verification</section>
  <section>Rollback fast path</section>
</output_format>

<quality_rules>
  <rule importance="critical">Изменение минимально и напрямую связано с observed behavior</rule>
  <rule importance="high">Есть быстрый rollback путь (revert/flag/переключение)</rule>
</quality_rules>

<do_not>
  <item importance="critical">Не расширять scope за пределы бага</item>
  <item importance="high">Не делать «большой рефакторинг» под видом фикса</item>
</do_not>
