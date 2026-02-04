---
name: testing-checklist
description: Чеклисты для smoke/sanity/regression тестирования
---

<input_requirements>
  <required>Цель проверки (smoke/sanity/regression)</required>
  <required>Список критичных сценариев и модулей</required>
  <optional>Ограничения окружения и доступы</optional>
  <optional>Список недавних изменений/фиксов</optional>
  <optional>Риски и приоритеты релиза</optional>
</input_requirements>

<checklist_types>
  <type name="smoke">Быстрая проверка, что система в целом работает</type>
  <type name="sanity">Проверка конкретной области после изменений</type>
  <type name="regression">Проверка, что изменения не сломали существующее</type>
</checklist_types>

<prioritization>
  <level name="P0">Блокирует релиз</level>
  <level name="P1">Критично, но есть обход</level>
  <level name="P2">Важно для UX, но не блокирует</level>
</prioritization>

<construction_rules>
  <rule importance="critical">Пункты чеклиста проверяемы и однозначны</rule>
  <rule importance="high">Каждый пункт связан с пользовательской ценностью</rule>
  <rule importance="high">Нет дубликатов и пересечений между пунктами</rule>
  <rule importance="high">Пункты короткие и выполняются быстро</rule>
  <rule importance="medium">Если фиксация нужна, использовать единый формат</rule>
</construction_rules>

<coverage>
  <focus>
    <item>Критические пользовательские пути</item>
    <item>Авторизация и права доступа</item>
    <item>Основные CRUD операции</item>
    <item>Ошибки и валидация данных</item>
  </focus>
</coverage>

<do_not>
  <item importance="critical">Не превращать чеклист в полный набор тест-кейсов</item>
  <item importance="high">Не включать пункты без четкого критерия успеха</item>
  <item importance="high">Не смешивать smoke и regression в одном списке</item>
  <item importance="high">Не включать пункты, зависящие от другого пункта без явной связи</item>
</do_not>

<example_items>
  <item>Вход в систему с валидными учетными данными</item>
  <item>Создание сущности через основную форму</item>
  <item>Отображение ошибки при пустом обязательном поле</item>
  <item>P0: Проверка доступа роли администратора к ключевым разделам</item>
</example_items>
