---
name: testing-visual-regression
description: Визуальная регрессия (baseline diffs, стабилизация UI)
---

<input_requirements>
  <required>Список страниц/компонентов для визуального контроля</required>
  <required>Базовая версия (baseline) и правила обновления</required>
  <required>Браузеры и viewports</required>
  <optional>Динамические области для маскирования</optional>
  <optional>Порог чувствительности diff</optional>
  <optional>Требования к темам/локалям</optional>
</input_requirements>

<preparation>
  <steps>
    <step>Стабилизировать данные и состояние (фикстуры/seed)</step>
    <step>Отключить анимации и автообновления при необходимости</step>
    <step>Зафиксировать шрифты, тему и локаль</step>
    <step>Зафиксировать размер viewport и масштаб</step>
  </steps>
</preparation>

<execution_rules>
  <rule importance="critical">Скриншоты воспроизводимы и детерминированы</rule>
  <rule importance="high">Сравнение выполняется против корректного baseline</rule>
  <rule importance="high">Динамические области маскируются или стабилизируются</rule>
  <rule importance="high">Изменения подтверждаются человеком (review)</rule>
  <rule importance="medium">Фиксируется инструмент и версия сравнения</rule>
</execution_rules>

<coverage>
  <focus>
    <item>Критические экраны и пользовательские потоки</item>
    <item>Компоненты UI с высокой вариативностью</item>
    <item>Таблицы, формы, графики, модальные окна</item>
    <item>Разные viewports и темы</item>
  </focus>
</coverage>

<quality_rules>
  <rule importance="critical">Ожидаемый результат и baseline совпадают по версии</rule>
  <rule importance="high">Порог diff задокументирован</rule>
  <rule importance="high">Результаты включают ссылки на артефакты</rule>
  <rule importance="medium">Причины обновления baseline зафиксированы</rule>
</quality_rules>

<do_not>
  <item importance="critical">Не обновлять baseline без проверки изменений</item>
  <item importance="high">Не сравнивать скриншоты при нестабильных данных</item>
  <item importance="high">Не смешивать разные локали/темы в одном baseline</item>
</do_not>

<example_checks>
  <check>Сравнение карточки товара на 3 viewports с зафиксированными данными</check>
  <check>Проверка визуальных изменений в модальном окне после обновления</check>
</example_checks>
