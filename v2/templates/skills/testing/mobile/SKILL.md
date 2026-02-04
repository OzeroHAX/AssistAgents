---
name: testing-mobile
description: Мобильное тестирование (native/hybrid/web, жесты, оффлайн, прерывания)
---

<input_requirements>
  <required>Платформы и версии ОС (iOS/Android)</required>
  <required>Тип приложения (native/hybrid/mobile web)</required>
  <required>Список ключевых пользовательских сценариев</required>
  <required>Критерии успеха для каждого сценария</required>
  <optional>Список устройств/эмуляторов и их приоритет</optional>
  <optional>Ограничения сети (2G/3G/LTE/Wi-Fi, offline)</optional>
  <optional>Поддерживаемые языки и регионы</optional>
  <optional>Ограничения окружения (feature flags, тестовые стенды)</optional>
</input_requirements>

<preparation>
  <steps>
    <step>Установить актуальную сборку и проверить версию</step>
    <step>Подготовить чистый профиль (fresh install) при необходимости</step>
    <step>Настроить разрешения (камера, гео, уведомления)</step>
    <step>Зафиксировать устройство, ОС, язык и часовой пояс</step>
    <step>Включить сбор логов/консоли, если доступно</step>
  </steps>
</preparation>

<execution_rules>
  <rule importance="critical">Сценарии воспроизводимы на указанном устройстве и версии ОС</rule>
  <rule importance="critical">Покрывать touch/gesture взаимодействия и системные диалоги</rule>
  <rule importance="high">Проверять поведение при смене ориентации экрана</rule>
  <rule importance="high">Проверять фоновый режим, возврат и прерывания (звонок/уведомление)</rule>
  <rule importance="high">Проверять поведение при изменении сети (offline/slow)</rule>
  <rule importance="medium">Проверять время запуска и основные перформанс показатели</rule>
  <rule importance="medium">Фиксировать особенности устройства в результате</rule>
</execution_rules>

<coverage>
  <focus>
    <item>Установка/обновление/удаление</item>
    <item>Авторизация и ключевые пользовательские потоки</item>
    <item>Разрешения и системные диалоги</item>
    <item>Offline/online и деградация сети</item>
    <item>Ориентация, клавиатура, ввод</item>
    <item>Deep links и push уведомления</item>
  </focus>
</coverage>

<quality_rules>
  <rule importance="critical">Ожидаемый результат однозначен и проверяем</rule>
  <rule importance="high">Указаны устройство, ОС, сборка и сеть</rule>
  <rule importance="high">Нет дубликатов проверок между устройствами без причины</rule>
  <rule importance="medium">Данные и состояние приложения фиксируются</rule>
</quality_rules>

<do_not>
  <item importance="critical">Не тестировать прод окружение без разрешения</item>
  <item importance="high">Не использовать реальные пользовательские данные</item>
  <item importance="high">Не ограничиваться эмуляторами для сенсоров/камеры</item>
  <item importance="high">Не пропускать очистку данных между сценариями при необходимости</item>
</do_not>

<example_checks>
  <check>Проверка логина после поворота экрана и возврата из фонового режима</check>
  <check>Проверка загрузки списка при переходе 4G -> offline -> 4G</check>
  <check>Проверка запроса гео-права и корректной обработки отказа</check>
</example_checks>
