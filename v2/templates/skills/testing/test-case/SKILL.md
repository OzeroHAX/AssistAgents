---
name: testing-test-case
description: Как продумывать тест-кейсы для функциональности без обязательной фиксации
---

<input_requirements>
  <required>Ссылка на требование/таск/PRD</required>
  <required>Критерии приемки / ожидаемое поведение</required>
  <required>Список ключевых пользовательских сценариев</required>
  <optional>Идентификаторы требований/AC (если есть)</optional>
  <optional>Приоритеты/критичность сценариев</optional>
  <optional>Список известных багов/рисков</optional>
  <optional>Ограничения окружения и данных</optional>
</input_requirements>

<scope>
  <note>Скилл описывает как продумывать тест-кейсы; фиксировать их в документах необязательно</note>
  <note>Если фиксация все же нужна, формат можно использовать как шаблон</note>
</scope>

<test_design>
  <principles>
    <principle importance="critical">Использовать Given-When-Then</principle>
    <principle importance="high">Разделять positive/negative сценарии</principle>
    <principle importance="high">Один кейс = одна проверка</principle>
    <principle importance="high">Применять эквивалентное разбиение и граничные значения</principle>
    <principle importance="medium">Указывать пред- и постусловия</principle>
    <principle importance="medium">Выделять критичные ветки как отдельные кейсы</principle>
    <principle importance="medium">Отделять тестовые данные от шагов</principle>
  </principles>
</test_design>

<quality_rules>
  <rule importance="critical">Шаги воспроизводимы без интерпретации</rule>
  <rule importance="critical">Ожидаемый результат проверяемый и однозначный</rule>
  <rule importance="high">Нет дубликатов и перекрытий</rule>
  <rule importance="high">Покрываются edge-cases и ошибки валидации</rule>
  <rule importance="high">Указаны тестовые данные и исходное состояние</rule>
  <rule importance="medium">Есть связь с требованием/AC или критерием приемки</rule>
  <rule importance="medium">Фиксация кейсов не обязательна, но логика проверки должна быть явно сформулирована</rule>
</quality_rules>

<do_not>
  <item importance="critical">Не смешивать несколько сценариев в одном кейсе</item>
  <item importance="high">Не использовать расплывчатые формулировки</item>
  <item importance="high">Не включать более одного требования/AC в один кейс</item>
  <item importance="high">Не оставлять неявные предположения о данных</item>
</do_not>

<examples>
  <good>
    <case>TC-LOGIN-001: Valid login with existing user</case>
    <why>Четкий сценарий, ожидаемый результат проверяем</why>
  </good>
  <bad>
    <case>Check login works</case>
    <why>Нет шагов и ожидаемого результата</why>
  </bad>
</examples>
