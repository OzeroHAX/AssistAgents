---
name: planning-task-classifier
description: Классификация задачи (bug/feature/refactor/migration) и ожидания к плану
---

<purpose>
  <item>Определить тип задачи и «что важно» именно для этого типа</item>
  <item>Снизить ошибки планирования (например, планировать баг как фичу)</item>
</purpose>

<inputs>
  <required>Краткое описание задачи</required>
  <optional>Артефакты: логи/ошибки/AC/скриншоты/ссылки на инцидент</optional>
</inputs>

<classification>
  <type id="bug">
    <signals>
      <item>Есть «ожидаемое vs фактическое»</item>
      <item>Есть ошибка/падение/регрессия/инцидент</item>
      <item>Есть воспроизведение или условия проявления</item>
    </signals>
    <planning_focus>
      <item>Подтверждение воспроизведения</item>
      <item>Минимальный фикс</item>
      <item>Быстрый rollback</item>
    </planning_focus>
  </type>
  <type id="feature">
    <signals>
      <item>Новая функциональность/поведение</item>
      <item>Пользовательская ценность и критерии приемки (AC)</item>
    </signals>
    <planning_focus>
      <item>Ясные AC и edge-cases</item>
      <item>Границы in/out of scope</item>
      <item>Rollout и мониторинг</item>
    </planning_focus>
  </type>
  <type id="refactor">
    <signals>
      <item>Цель: качество/поддерживаемость/производительность без смены внешнего поведения</item>
      <item>Есть метрики/боль/долг</item>
    </signals>
    <planning_focus>
      <item>Сохранение поведения</item>
      <item>Метрики улучшения</item>
      <item>Инкрементальные шаги и регрессия</item>
    </planning_focus>
  </type>
  <type id="migration">
    <signals>
      <item>Схема/данные/контракты/инфраструктура меняются так, что требуется совместимость</item>
      <item>Есть объем данных/окна/dual-write/backfill</item>
    </signals>
    <planning_focus>
      <item>Целостность данных</item>
      <item>Backward compatibility</item>
      <item>Пошаговая миграция и проверка</item>
    </planning_focus>
  </type>
</classification>

<output_format>
  <section>Task type + confidence</section>
  <section>Why (signals)</section>
  <section>Planning focus</section>
  <section>Key unknowns</section>
</output_format>

<quality_rules>
  <rule importance="critical">Тип задачи обоснован сигналами из входных данных</rule>
  <rule importance="high">Если уверенность низкая, это явно указано и вынесены вопросы</rule>
</quality_rules>
