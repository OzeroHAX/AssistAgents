---
name: project-standart-research
description: Целевой ресерч для закрытия критичных неизвестных в standard-потоке
---

<purpose>
  <item>Подтвердить ключевые гипотезы источниками до фиксации требований и архитектуры</item>
  <item>Снизить риск ошибок в PRD/architecture из-за непроверенных допущений</item>
</purpose>

<when_to_use>
  <item importance="high">После brief, если есть критичные неизвестные или внешние ограничения</item>
  <item importance="critical">Перед архитектурными решениями при интеграциях, стандартах или комплаенсе</item>
</when_to_use>

<required_preload>
  <item>shared-base-rules</item>
  <item>shared-docs-paths</item>
  <item>task-use/research/web-strategy</item>
  <item>planning-risk-assessment</item>
  <item>planning-impact-analysis</item>
</required_preload>

<document_target>
  <rule importance="critical">Создать файл в `researches/{date time}-{user friendly name}.md`</rule>
</document_target>

<method>
  <step>Сформулировать 1-3 проверяемых исследовательских вопроса</step>
  <step>Собрать только первичные/надежные источники по вопросам</step>
  <step>Разделить факты, интерпретации и гипотезы</step>
  <step>Выделить top-risks и top-constraints, влияющие на PRD и architecture</step>
  <step>Сформулировать последствия для scope и решений</step>
</method>

<output_format>
  <section>Research questions</section>
  <section>Verified findings</section>
  <section>Assumptions / hypotheses</section>
  <section>Risks and constraints</section>
  <section>Impact on PRD/architecture</section>
  <section>Sources</section>
</output_format>

<quality_rules>
  <rule importance="critical">Каждый ключевой вывод имеет ссылку на источник</rule>
  <rule importance="high">Неподтвержденные тезисы помечены как гипотезы</rule>
  <rule importance="high">Результат ресерча меняет следующий шаг, а не остается «для справки»</rule>
</quality_rules>
