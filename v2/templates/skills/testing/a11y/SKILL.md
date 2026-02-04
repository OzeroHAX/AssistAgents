---
name: testing-a11y
description: Accessibility тестирование (WCAG, клавиатура, screen reader)
---

<input_requirements>
  <required>Целевой стандарт доступности (например, WCAG 2.1 AA)</required>
  <required>Ключевые пользовательские сценарии</required>
  <required>Поддерживаемые браузеры и платформы</required>
  <optional>Список screen reader и версии</optional>
  <optional>Компоненты/страницы с высоким риском (формы, модалки)</optional>
</input_requirements>

<execution_rules>
  <rule importance="critical">Проверять полный сценарий только клавиатурой</rule>
  <rule importance="critical">Фокус видим, порядок логичен, нет ловушек фокуса</rule>
  <rule importance="high">Проверять роль/название/состояние интерактивных элементов</rule>
  <rule importance="high">Проверять ошибки формы и их озвучивание</rule>
  <rule importance="high">Проверять контраст и читаемость текста</rule>
  <rule importance="medium">Использовать автоматические сканеры как дополнение</rule>
</execution_rules>

<coverage>
  <focus>
    <item>Навигация и основные маршруты</item>
    <item>Формы, ошибки и подсказки</item>
    <item>Диалоги, модальные окна, фокус-менеджмент</item>
    <item>Таблицы и сложные компоненты</item>
    <item>Динамический контент и уведомления</item>
    <item>Медиа контент и альтернативный текст</item>
  </focus>
</coverage>

<quality_rules>
  <rule importance="critical">Ожидаемый результат однозначен и проверяем</rule>
  <rule importance="high">Указаны экранный диктор, браузер и платформа</rule>
  <rule importance="high">Результаты описывают фактическое поведение, не интерпретации</rule>
  <rule importance="medium">Отмечены отклонения от WCAG и их уровень</rule>
</quality_rules>

<do_not>
  <item importance="critical">Не полагаться только на автоматические сканеры</item>
  <item importance="high">Не отмечать сценарий как пройденный без клавиатурной проверки</item>
  <item importance="high">Не игнорировать проблемы с фокусом и озвучиванием</item>
</do_not>

<example_checks>
  <check>Проверка навигации по форме с помощью Tab/Shift+Tab</check>
  <check>Проверка озвучивания ошибок при неверном вводе</check>
  <check>Проверка контраста текста на ключевых экранах</check>
</example_checks>
