---
name: project-standart-status
description: Обязательный трекер фазы standard-планирования через status.json
---

<purpose>
  <item>Сделать `status.json` единым источником истины по стадии standard-планирования</item>
  <item>Фиксировать gate-решение, блокеры, следующий шаг и готовность к переходу в delivery</item>
</purpose>

<when_to_use>
  <item importance="critical">В начале standard-потока для инициализации статуса</item>
  <item importance="critical">После завершения каждого шага: brief, research, prd, personas, usecases, arch, epic, decomposition</item>
  <item importance="critical">Перед передачей в реализацию (финальный readiness gate)</item>
</when_to_use>

<required_preload>
  <item>shared-base-rules</item>
  <item>shared-docs-paths</item>
</required_preload>

<status_file_contract>
  <rule importance="critical">Файл: `status.json`</rule>
  <rule importance="critical">Формат: валидный JSON без комментариев</rule>
  <required_fields>
    <field>phase</field>
    <field>stage</field>
    <field>step_status</field>
    <field>gate</field>
    <field>reasons</field>
    <field>blockers</field>
    <field>next_action</field>
    <field>updated_at</field>
  </required_fields>
</status_file_contract>

<allowed_values>
  <phase><item>standard-planning</item></phase>
  <stage>
    <item>init</item><item>brief</item><item>research</item><item>prd</item><item>personas</item>
    <item>usecases</item><item>arch</item><item>epic</item><item>decomposition</item><item>finalize</item>
  </stage>
  <step_status><item>done</item><item>partial</item><item>blocked</item></step_status>
  <gate><item>PASS</item><item>CONCERNS</item><item>FAIL</item></gate>
</allowed_values>

<quality_rules>
  <rule importance="critical">Если `status.json` не обновлен, этап считается незавершенным</rule>
  <rule importance="critical">Нельзя ставить `PASS`, если есть критичные блокеры</rule>
  <rule importance="high">`next_action` должен быть конкретным и исполнимым одним следующим шагом</rule>
</quality_rules>
