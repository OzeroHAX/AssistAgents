---
name: testing-aqa
description: Automated QA (playwright/selenium/cypress паттерны, page object model)
---

<input_requirements>
  <required>Цель автотеста и сценарии</required>
  <required>Окружение и доступы</required>
  <required>Выбранный фреймворк и версии</required>
  <required>Стратегия тестовых данных и очистки</required>
  <optional>Данные и фикстуры</optional>
  <optional>Требования к стабильности (flake rate)</optional>
  <optional>Требования к артефактам (скриншоты/видео/trace)</optional>
  <optional>Правила ретраев (если допускаются)</optional>
</input_requirements>

<design_rules>
  <rule importance="critical">Тесты независимы и изолированы</rule>
  <rule importance="critical">Каждый тест имеет ясный критерий успеха</rule>
  <rule importance="high">Использовать устойчивые селекторы и паттерны</rule>
  <rule importance="high">Ассерты на бизнес-значимые состояния, не на детали реализации</rule>
  <rule importance="high">Минимизировать дублирование через POM/fixtures</rule>
  <rule importance="high">Параметризовать проверки при вариативных данных</rule>
  <rule importance="medium">Разделять UI, API и интеграционные тесты</rule>
</design_rules>

<execution_rules>
  <rule importance="critical">Тесты детерминированы и повторяемы</rule>
  <rule importance="high">Ошибки локализуются (понятная причина падения)</rule>
  <rule importance="high">Флейки устраняются, а не маскируются</rule>
  <rule importance="high">Собирать артефакты при падении (screenshot/video/trace)</rule>
  <rule importance="medium">Тесты должны быть быстрыми и параллелизуемыми</rule>
  <rule importance="medium">Ретраи ограничены и документированы</rule>
</execution_rules>

<coverage>
  <focus>
    <item>Критические пользовательские пути</item>
    <item>Авторизация и права доступа</item>
    <item>Основные CRUD операции</item>
    <item>Ошибки и валидация</item>
  </focus>
</coverage>

<do_not>
  <item importance="critical">Не использовать sleep вместо ожиданий по состоянию</item>
  <item importance="high">Не завязываться на нестабильные селекторы</item>
  <item importance="high">Не смешивать несколько сценариев в одном тесте</item>
  <item importance="high">Не делать тесты зависимыми от порядка выполнения</item>
  <item importance="high">Не использовать общий mutable state между тестами</item>
</do_not>

<example_patterns>
  <pattern>Page Object Model с изолированными действиями и ассерциями</pattern>
  <pattern>Фикстуры для данных и авторизации</pattern>
  <pattern>Явные ожидания по состоянию интерфейса</pattern>
  <pattern>Селекторы по role/data-testid/aria</pattern>
</example_patterns>
