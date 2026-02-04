---
name: testing-contract
description: Контрактное тестирование API (OpenAPI/Pact, совместимость)
---

<input_requirements>
  <required>Провайдеры и потребители (consumer/provider)</required>
  <required>Источник контракта (OpenAPI/Pact) и версия</required>
  <required>Окружения для проверки провайдера и потребителя</required>
  <optional>Правила версионирования и совместимости</optional>
  <optional>Список критичных контрактов и эндпоинтов</optional>
</input_requirements>

<design_rules>
  <rule importance="critical">Контракт описывает обязательные и опциональные поля</rule>
  <rule importance="high">Контракт включает успешные и ошибочные ответы</rule>
  <rule importance="high">Изменения контракта версионируются</rule>
  <rule importance="medium">Контракт не содержит секретов и реальных данных</rule>
</design_rules>

<execution_rules>
  <rule importance="critical">Провайдер проходит проверку контракта</rule>
  <rule importance="high">Потребительские ожидания проверяются автоматически</rule>
  <rule importance="high">Проверяется обратная совместимость при изменениях</rule>
  <rule importance="high">Версии контрактов и сервисов фиксируются</rule>
  <rule importance="medium">Ошибки классифицируются как breaking/non-breaking</rule>
</execution_rules>

<coverage>
  <focus>
    <item>Обязательные поля и типы данных</item>
    <item>Опциональные поля и дефолтные значения</item>
    <item>Коды ошибок и формат ошибок</item>
    <item>Пагинация/сортировка/фильтрация</item>
    <item>Авторизация и права доступа</item>
  </focus>
</coverage>

<quality_rules>
  <rule importance="critical">Все проверки воспроизводимы и документированы</rule>
  <rule importance="high">Есть связь между контрактом и тестом/проверкой</rule>
  <rule importance="high">Результаты включают версии и идентификаторы контрактов</rule>
  <rule importance="medium">Фиксируются артефакты (reports/лог)</rule>
</quality_rules>

<do_not>
  <item importance="critical">Не публиковать контракты без прохождения проверок</item>
  <item importance="high">Не смешивать окружения потребителя и провайдера</item>
  <item importance="high">Не принимать breaking изменения без повышения версии</item>
</do_not>

<example_checks>
  <check>Проверка, что провайдер возвращает обязательные поля по контракту</check>
  <check>Проверка формата ошибок и кодов ответов</check>
</example_checks>
