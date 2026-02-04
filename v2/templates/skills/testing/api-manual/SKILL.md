---
name: testing-api-manual
description: Ручное тестирование API через curl в bash
---

<input_requirements>
  <required>Базовый URL окружения</required>
  <required>Схема авторизации и доступы</required>
  <required>Список эндпоинтов и контрактов (параметры, тела, ответы)</required>
  <optional>Спецификация (OpenAPI/Swagger) и версия API</optional>
  <optional>Тестовые данные и начальное состояние</optional>
  <optional>Ограничения по rate limit и таймаутам</optional>
</input_requirements>

<preparation>
  <steps>
    <step>Проверить доступность окружения и базовый health</step>
    <step>Подготовить токены/ключи и сохранить в переменные</step>
    <step>Собрать минимальный набор curl-шаблонов для запросов</step>
    <step>Настроить переменные для request-id/correlation-id (если используются)</step>
  </steps>
</preparation>

<execution_rules>
  <rule importance="critical">Каждый запрос должен быть воспроизводимым</rule>
  <rule importance="critical">Проверять статус-код и контракт ответа</rule>
  <rule importance="high">Покрывать positive и negative сценарии</rule>
  <rule importance="high">Фиксировать влияющие заголовки и параметры</rule>
  <rule importance="high">Проверять схему ответа и типизацию полей</rule>
  <rule importance="high">Проверять пагинацию, сортировку и фильтры</rule>
  <rule importance="high">Проверять идемпотентность, где применимо</rule>
  <rule importance="medium">Отмечать зависимости между запросами (chain)</rule>
</execution_rules>

<coverage>
  <focus>
    <item>CRUD сценарии</item>
    <item>Валидация входных данных</item>
    <item>Авторизация и права доступа</item>
    <item>Ошибки и пограничные случаи</item>
    <item>Пагинация/фильтрация/сортировка</item>
    <item>Rate limiting и коды ошибок</item>
  </focus>
</coverage>

<quality_rules>
  <rule importance="critical">Ожидаемый результат формулируется однозначно</rule>
  <rule importance="high">Нет дубликатов сценариев с разной формулировкой</rule>
  <rule importance="high">Ошибки сервера и клиента различаются и проверяются отдельно</rule>
  <rule importance="high">Фиксируются request-id/correlation-id при наличии</rule>
  <rule importance="medium">Если фиксация результата нужна, использовать единый формат</rule>
</quality_rules>

<do_not>
  <item importance="critical">Не выполнять destructive запросы в прод окружении</item>
  <item importance="high">Не использовать реальные пользовательские данные</item>
  <item importance="high">Не менять состояние, если это не предусмотрено сценарием</item>
  <item importance="high">Не сохранять токены/ключи в историю shell или логи</item>
</do_not>

<example_templates>
  <template>curl -X GET "$BASE_URL/resource" -H "Authorization: Bearer $TOKEN"</template>
  <template>curl -X POST "$BASE_URL/resource" -H "Content-Type: application/json" -d '{"key":"value"}'</template>
  <template>curl -X GET "$BASE_URL/resource?page=1&limit=20" -H "Authorization: Bearer $TOKEN"</template>
</example_templates>
