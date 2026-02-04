---
name: testing-e2e-flow
description: End-to-end сценарии (пользовательские пути, интеграционные цепочки)
---

<input_requirements>
  <required>Ключевые пользовательские потоки</required>
  <required>Системы/сервисы, участвующие в цепочке</required>
  <required>Окружение и доступы</required>
  <required>Стратегия тестовых данных (создание/очистка)</required>
  <optional>Данные и фикстуры</optional>
  <optional>Критичность сценариев</optional>
</input_requirements>

<design_rules>
  <rule importance="critical">Сценарий покрывает полный путь пользователя</rule>
  <rule importance="critical">Явно указаны точки интеграции и зависимости</rule>
  <rule importance="high">Сценарии независимы и могут выполняться в любом порядке</rule>
  <rule importance="high">Учитываются ошибки внешних сервисов и таймауты</rule>
  <rule importance="high">Шаги воспроизводимы и детерминированы</rule>
  <rule importance="medium">Минимум сценариев при максимальной ценности</rule>
  <rule importance="medium">Определен жизненный цикл тестовых данных</rule>
</design_rules>

<execution_rules>
  <rule importance="critical">Фиксировать результаты на каждом ключевом этапе</rule>
  <rule importance="high">Отделять ошибки инфраструктуры от логики приложения</rule>
  <rule importance="high">Проверять идемпотентность критичных операций</rule>
  <rule importance="high">Фиксировать версии сервисов/фич-флаги и конфигурацию окружения</rule>
  <rule importance="high">Управлять тестовыми данными (создание/очистка)</rule>
  <rule importance="medium">Собирать логи по всем затронутым сервисам</rule>
  <rule importance="medium">Записывать время ключевых шагов и причины падений</rule>
</execution_rules>

<coverage>
  <focus>
    <item>Критические пользовательские потоки</item>
    <item>Интеграционные точки и внешние зависимости</item>
    <item>Ошибки и отказоустойчивость</item>
    <item>Согласованность данных</item>
    <item>Критичные NFR (время отклика, стабильность)</item>
  </focus>
</coverage>

<do_not>
  <item importance="critical">Не запускать e2e на нестабильном окружении</item>
  <item importance="high">Не смешивать несколько бизнес-процессов в одном сценарии</item>
  <item importance="high">Не полагаться на случайные данные</item>
  <item importance="high">Не оставлять тестовые данные без очистки</item>
</do_not>

<example_flows>
  <flow>Регистрация → подтверждение → оформление заказа → оплата → уведомление</flow>
  <flow>Создание сущности → проверка в отчете → экспорт данных</flow>
</example_flows>
