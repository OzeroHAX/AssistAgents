---
name: testing-security
description: Базовое security тестирование (OWASP, auth, data exposure)
---

<input_requirements>
  <required>Модель авторизации и роли</required>
  <required>Список критичных эндпоинтов/функций</required>
  <required>Классификация данных и зоны риска</required>
  <required>Разрешенный набор проверок и окружение</required>
  <optional>Доступ к логам/monitoring и request-id</optional>
</input_requirements>

<execution_rules>
  <rule importance="critical">Проверять authn/authz для каждой роли и запрета</rule>
  <rule importance="critical">Проверять управление сессией (истечение, logout, refresh)</rule>
  <rule importance="high">Проверять валидацию ввода (XSS/SQLi) без разрушения данных</rule>
  <rule importance="high">Проверять CSRF для операций изменения состояния (если применимо)</rule>
  <rule importance="high">Проверять rate limiting и блокировку при злоупотреблении</rule>
  <rule importance="medium">Проверять утечки данных в ответах, логах и ошибках</rule>
</execution_rules>

<coverage>
  <focus>
    <item>Broken access control</item>
    <item>Authentication failures</item>
    <item>Security misconfiguration</item>
    <item>Data exposure (PII/секреты)</item>
    <item>Уязвимости валидации и инъекции</item>
  </focus>
</coverage>

<quality_rules>
  <rule importance="critical">Все шаги воспроизводимы и задокументированы</rule>
  <rule importance="high">Указаны роль, токен и контекст запроса</rule>
  <rule importance="high">Есть доказательства (запрос/ответ, request-id)</rule>
  <rule importance="medium">Оценка риска привязана к данным и ролям</rule>
</quality_rules>

<do_not>
  <item importance="critical">Не проводить security тесты без разрешения</item>
  <item importance="critical">Не тестировать прод окружение без разрешения</item>
  <item importance="high">Не выполнять разрушительные действия и массовые удаления</item>
  <item importance="high">Не извлекать и не сохранять реальные пользовательские данные</item>
</do_not>

<example_checks>
  <check>Проверка доступа роли User к ресурсу Admin (должно быть запрещено)</check>
  <check>Проверка истечения сессии и недоступности после logout</check>
  <check>Проверка обработки опасных символов во входных полях</check>
</example_checks>
