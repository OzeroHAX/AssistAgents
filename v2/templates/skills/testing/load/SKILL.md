---
name: testing-load
description: Нагрузочное тестирование (k6/JMeter сценарии, бенчмарки)
---

<input_requirements>
  <required>Цель нагрузки (throughput/latency/стабильность)</required>
  <required>Ключевые пользовательские сценарии</required>
  <required>Ограничения окружения и лимиты</required>
  <required>Профиль пользователей и распределение сценариев</required>
  <optional>Базовые метрики и текущий baseline</optional>
  <optional>Допустимые пороги (SLA/SLO)</optional>
  <optional>Требования к мониторингу (APM/логирование)</optional>
</input_requirements>

<test_design>
  <principles>
    <principle importance="critical">Нагрузка отражает реальное распределение трафика</principle>
    <principle importance="critical">Метрики и пороги согласованы заранее</principle>
    <principle importance="high">Сценарии изолированы и повторяемы</principle>
    <principle importance="high">Тесты разделены на прогрев/пик/стабильность</principle>
    <principle importance="high">Явно разделять load/stress/spike/soak тесты</principle>
    <principle importance="high">Добавлять think time и реалистичные паузы</principle>
    <principle importance="medium">Сбор метрик согласован с командой инфраструктуры</principle>
  </principles>
</test_design>

<execution_rules>
  <rule importance="critical">Не превышать лимиты окружения без разрешения</rule>
  <rule importance="critical">Фиксировать конфигурацию нагрузки и окружение</rule>
  <rule importance="high">Проверять стабильность результатов на повторных прогонах</rule>
  <rule importance="high">Выделять деградации и точки насыщения</rule>
  <rule importance="high">Проверять, что тестируется корректная версия сервиса</rule>
  <rule importance="medium">Сравнивать с baseline и фиксировать изменения</rule>
  <rule importance="medium">Синхронизировать временные метки и корреляцию логов</rule>
</execution_rules>

<metrics>
  <required>
    <metric>p50/p95/p99 latency</metric>
    <metric>throughput (RPS)</metric>
    <metric>error rate</metric>
    <metric>resource usage (CPU/RAM/IO)</metric>
    <metric>latency по ключевым эндпоинтам</metric>
  </required>
</metrics>

<do_not>
  <item importance="critical">Не запускать нагрузку на прод без разрешения</item>
  <item importance="high">Не использовать реальные пользовательские данные</item>
  <item importance="high">Не менять параметры нагрузки в процессе теста без фиксации</item>
  <item importance="high">Не запускать тесты без мониторинга ключевых метрик</item>
</do_not>

<example_scenarios>
  <scenario>Линейный рост нагрузки до пикового значения</scenario>
  <scenario>Ступенчатая нагрузка с периодом стабилизации</scenario>
  <scenario>Длительный soak-тест на стабильность</scenario>
</example_scenarios>
