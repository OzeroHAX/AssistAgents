---
name: testing-browser-manual
description: UI тестирование через Playwright MCP (snapshot-driven)
---

<input_requirements>
  <required>URL окружения и доступы</required>
  <required>Список ключевых пользовательских сценариев</required>
  <required>Критерии успеха для каждого сценария</required>
  <optional>Поддерживаемые браузеры и версии</optional>
  <optional>Ключевые разрешения/брейкпоинты</optional>
  <optional>Тестовые учетные записи и данные</optional>
  <optional>Ограничения окружения (rate limits, feature flags)</optional>
</input_requirements>

<preparation>
  <steps>
    <step>Проверить окружение и актуальность сборки</step>
    <step>Создать новый контекст/страницу через MCP</step>
    <step>Сделать первую навигацию для начала логов network/console</step>
    <step>Зафиксировать viewport, язык и локаль</step>
    <step>Очистить cookies/localStorage при необходимости</step>
  </steps>
</preparation>

<execution_rules>
  <rule importance="critical">Шаги выполняются инструментами агента и воспроизводимы</rule>
  <rule importance="critical">Действия выполняются по snapshot ref, а не по скриншоту</rule>
  <rule importance="critical">Проверять UI и системные реакции (ошибки, состояния)</rule>
  <rule importance="high">Покрывать positive и negative сценарии</rule>
  <rule importance="high">Проверять доступность (keyboard navigation, focus, aria)</rule>
  <rule importance="high">Проверять responsive на ключевых брейкпоинтах</rule>
  <rule importance="high">Отмечать зависимости от данных и состояния</rule>
  <rule importance="medium">Фиксировать признаки регрессии и визуальные артефакты</rule>
</execution_rules>

<coverage>
  <focus>
    <item>Основные пользовательские пути</item>
    <item>Валидация форм и ошибок</item>
    <item>Состояния загрузки и пустые состояния</item>
    <item>Навигация и маршрутизация</item>
  </focus>
</coverage>

<quality_rules>
  <rule importance="critical">Ожидаемый результат формулируется однозначно</rule>
  <rule importance="high">Нет дубликатов сценариев с разной формулировкой</rule>
  <rule importance="high">Ошибки UI и ошибки сети различаются и проверяются отдельно</rule>
  <rule importance="high">Логи network/console проверяются после навигации или действий</rule>
  <rule importance="high">Viewport/браузер фиксируются в результате проверки</rule>
  <rule importance="medium">Если фиксация результата нужна, использовать единый формат</rule>
</quality_rules>

<do_not>
  <item importance="critical">Не тестировать прод окружение без разрешения</item>
  <item importance="high">Не использовать реальные пользовательские данные</item>
  <item importance="high">Не игнорировать ошибки в console и network логах</item>
  <item importance="high">Не полагаться на визуальное совпадение без проверки состояния DOM</item>
</do_not>

<agent_checklist>
  <item importance="critical">Цель теста и критерий успеха сформулированы</item>
  <item importance="critical">Окружение и доступы подтверждены</item>
  <item importance="high">Определен стартовый маршрут и состояние сессии</item>
  <item importance="high">Viewport/браузер/локаль зафиксированы</item>
  <item importance="high">Шаги и ожидаемые состояния UI перечислены</item>
  <item importance="high">Проверки network/console запланированы</item>
  <item importance="medium">Границы проверки и исключения зафиксированы</item>
</agent_checklist>

<example_checks>
  <check>Проверка отображения ошибки валидации при пустом обязательном поле</check>
  <check>Проверка корректной обработки 401/403 при истекшей сессии</check>
  <check>Проверка навигации по форме клавиатурой и видимого focus</check>
</example_checks>
