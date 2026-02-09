---
name: project-fast-status
description: Обязательный скилл управления прогрессом fast-планирования через status.json
---

<purpose>
  <item>Сделать `status.json` единственным источником истины по фазе и этапу fast-планирования</item>
  <item>Жестко фиксировать прогресс, блокеры, gate-решение и следующий шаг</item>
  <item>Не допускать перехода к следующему шагу fast-потока без обновления статуса</item>
</purpose>

<mandatory_usage>
  <rule importance="critical">Этот скилл обязателен для fast-планирования</rule>
  <rule importance="critical">Вызывать в начале fast-потока для инициализации `status.json`</rule>
  <rule importance="critical">Вызывать после каждого шага: init, pulse-scan, stack-pick, proto-spec, task-blast</rule>
  <rule importance="critical">Вызывать в конце fast-потока для финального gate-решения</rule>
  <rule importance="high">Если `status.json` не обновлен, шаг считается незавершенным</rule>
</mandatory_usage>

<when_to_use>
  <item importance="critical">Старт fast-планирования (создание начального статуса)</item>
  <item importance="critical">После завершения каждого этапа fast-потока</item>
  <item importance="critical">Перед передачей в реализацию или эскалацией в standard-поток</item>
</when_to_use>

<inputs>
  <required>Текущий шаг fast-потока (init, pulse-scan, stack-pick, proto-spec, task-blast)</required>
  <required>Фактический результат шага: done/partial/blocked</required>
  <required>Краткие причины и список блокеров (если есть)</required>
  <optional>Риски, корректирующие действия, критерии повторной проверки</optional>
</inputs>

<status_file_contract>
  <rule importance="critical">Файл: `status.json`</rule>
  <rule importance="critical">Формат: валидный JSON без комментариев</rule>
  <rule importance="critical">Обновляется атомарно при каждом запуске этого скилла</rule>
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
  <conditional_fields>
    <item>Если gate != PASS: обязательны `corrective_actions` и `recheck_criteria`</item>
    <item>Если step_status = blocked: обязательны `owner` и `unblock_plan`</item>
  </conditional_fields>
</status_file_contract>

<allowed_values>
  <phase>
    <item>fast-planning</item>
  </phase>
  <stage>
    <item>init</item>
    <item>pulse-scan</item>
    <item>stack-pick</item>
    <item>proto-spec</item>
    <item>task-blast</item>
    <item>finalize</item>
  </stage>
  <step_status>
    <item>done</item>
    <item>partial</item>
    <item>blocked</item>
  </step_status>
  <gate>
    <item>PASS</item>
    <item>CONCERNS</item>
    <item>FAIL</item>
  </gate>
</allowed_values>

<method>
  <step>Проверить наличие `status.json`; если файла нет, создать с базовой структурой</step>
  <step>Зафиксировать текущие `phase` и `stage` по фактическому шагу</step>
  <step>Обновить `step_status`, `reasons`, `blockers` и `next_action`</step>
  <step>Если это финал fast-потока, выставить `gate` по результатам всех этапов</step>
  <step>При `CONCERNS` или `FAIL` добавить `corrective_actions` и `recheck_criteria`</step>
  <step>Обновить `updated_at` и сохранить валидный JSON</step>
</method>

<output_format>
  <section>phase</section>
  <section>stage</section>
  <section>step_status</section>
  <section>gate</section>
  <section>reasons</section>
  <section>blockers</section>
  <section>next_action</section>
  <section>corrective_actions (if gate != PASS)</section>
  <section>recheck_criteria (if gate != PASS)</section>
  <section>updated_at</section>
</output_format>

<quality_rules>
  <rule importance="critical">`status.json` всегда отражает фактическое состояние на текущий момент</rule>
  <rule importance="critical">Нельзя переходить к следующему stage без записи результата текущего</rule>
  <rule importance="high">`next_action` конкретен и исполним одним следующим шагом</rule>
  <rule importance="high">Причины и блокеры сформулированы проверяемо, без расплывчатых формулировок</rule>
</quality_rules>

<do_not>
  <item importance="critical">Не оставлять `status.json` устаревшим после завершения шага</item>
  <item importance="critical">Не выставлять `PASS` при наличии критичных блокеров</item>
  <item importance="high">Не писать свободный текст вместо структурированных полей JSON</item>
</do_not>

<minimal_json_example>
  <item>{"phase":"fast-planning","stage":"proto-spec","step_status":"done","gate":"CONCERNS","reasons":["NFR уточнены частично"],"blockers":["Нет подтверждения по интеграции X"],"next_action":"Закрыть интеграционный риск и обновить proto-spec","corrective_actions":["Провести проверку контракта API X"],"recheck_criteria":["Интеграционный риск закрыт","AC не изменились"],"updated_at":"2026-02-09T12:00:00Z"}</item>
</minimal_json_example>
