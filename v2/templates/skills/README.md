## **coder/** — Написание кода

### language/
- **`csharp-skills`** — Паттерны C#, LINQ, async/await, ASP.NET Core, EF Core
- **`ts-skills`** — TypeScript strict mode, типизация, generics, advanced patterns
- **`rust-skills`** — Ownership, borrowing, lifetimes, error handling, concurrency
- **`python-skills`** — Type hints, dataclasses, asyncio, FastAPI/Django patterns

### frontend/
- **`ui-ux`** — Accessibility (a11y), responsive design, UX patterns
- **`design`** — Принципы дизайна (не нейросетевого), формат предоложений дизайна пользователю

### rules/
- **`clean-code`** — SOLID, DRY, naming conventions, code smells detection
- **`requirements`** — Чтение и трактовка требований перед кодингом
- **`debug-requirements`** — Правила и принципы отладки кода

### system-design/
- **`api-design`** — REST/GraphQL/gRPC endpoint design, versioning, idempotency
- **`external-api`** — Rate limiting, retry patterns, circuit breakers, API integration
- **`db-schema`** — Normalization, indexing, migrations, query optimization
- **`testable-code`** — Dependency injection, mocking, interfaces для тестируемости
- **`perf-patterns`** — Caching, lazy loading, connection pooling, memory management
- **`security`** — OWASP Top 10, input validation, SQL injection prevention, authZ/authN

---

## **task-use/** — Использование subagents

### research/
- **`code-strategy`** — Когда и как вызывать Code Subagent (поиск паттернов, примеров, большой анализ кода, первичное наполнение контекста)
- **`web-strategy`** — Когда и как вызывать  Web Subagent (поиск лучших практик в интернете, ресерч, получение нужной информации)
- **`context-strategy`** — Когда и как вызывать Bussines Logic Subagent (анализ бизнес-логики, домена)

### creator/
- **`decomposition-strategy`** — Когда и как вызывать Decomposition Subagent (декомпозиция эпиков на задачи)

---

## **testing/** — Тестирование

- **`api-manual`** — Ручное тестирование API (curl через bash)
- **`browser-manual`** — Ручное UI тестирование (через запуск браузера, devtools debugging)
- **`test-case`** — Написание тест-кейсов (Given-When-Then, positive/negative scenarios)
- **`aqa`** — Automated QA (playwright/selenium/cypress паттерны, page object model)
- **`checklist`** — Чеклисты для smoke/sanity/regression тестирования
- **`e2e-flow`** — End-to-end сценарии (пользовательские пути, интеграционные цепочки)
- **`load`** — Нагрузочное тестирование (k6/JMeter сценарии, бенчмарки)

---

## **project/** — Управление проектом

- **`discovery`** — Определение режима (fast vs standard) по запросу пользователя

### fast/
- **`status`** — Чтение/обновление STATUS для fast-режима
- **`init`** — Инициализация структуры папок fast-проекта
- **`pulse-scan`** — Быстрый пульс рынка (1-2 источника, не глубокий анализ)
- **`proto-spec`** — Прототип PRD (bullet points, без деталей)
- **`stack-pick`** — Выбор стека по умолчанию для MVP (стек выбираем только из того, какие языки у нас есть в скиллах)
- **`task-blast`** — Взрывное разбиение на 3-5 задач без overthinking

### standart/ (BMAD-lite)
- **`status`** — Чтение/обновление STATUS для standard-режима (последовательные фазы)
- **`research`** — Глубокий research (3+ источника, competitive analysis)
- **`brief`** — Создание брифа (problem, solution, users, metrics)
- **`personas`** — Персоны пользователей, их проблемы, страхи и цели (primary/secondary, JTBD)
- **`proj-description`** — Описание проекта для команды и формирование PRD с учетом задач персон (overview, scope)
- **`usecases`** — Use case scenarios (actors, flows, exceptions)
- **`arch`** — Архитектурные решения (tech stack, data flow, components)
- **`epic`** — Разбиение на эпики (user story mapping, MVP vs Phase 2)
- **`decomposition`** — Детальная декомпозиция эпиков на story-файлы

---

## **review/** — Ревью кода и документов

### arch/
- **`full-check`** — Полная проверка архитектуры (соответствие требованиям, масштабируемость)
- **`consistency`** — Проверка консистентности архитектурных решений в документе архитектуры

### doc/
- **`quality`** — Проверка качества документации (clarity, completeness, актуальность)
- **`strategy`** — Стратегия документирования (что документировать, в каком объеме)

### code/
- **`checklist`** — Чеклист code review (naming, logic, tests, security)
- **`requirements`** — Проверка соответствия кода требованиям (traceability)
- **`strategy`** — Стратегия ревью (что приоритетно, что можно пропустить)
- **`security`** — Security review (vulnerabilities scanning, secrets detection)
- **`performance`** — Проверка производительности (алгоритмическая сложность, N+1, async)
- **`maintain`** — Maintainability review (coupling, cohesion, tech debt assessment)
- **`idiom-check`** — Проверка языковых идиом (Rust ownership, Go channels, Pythonic code)

---

## **docs/** — Документирование

### project/ (Артефакты проекта)
- **`brief`** — Правила написания brief
- **`research-summary`** — Формат summary исследований и правила написания
- **`prd`** — Правила написания Product Requirements Document
- **`personals`** — Правила описание персон, их задач, страхов и целей (user personas)
- **`use-case`** — Правила написания use case
- **`arch`** — Правила написания архитектурная документация (ADRs, diagrams)
- **`epic`** —  Правила написания Epic (acceptance criteria, DoD)
- **`task`** — Правила написания Task (technical details, estimation)
- **`status`** — Формат STATUS для отслеживания прогресса

### report/
- **`test-reporting`** — Отчеты о тестировании (coverage, bugs found, regressions)
- **`bug-reporting`** — Bug reports (steps to reproduce, environment, severity)

### Отдельные doc-скиллы
- **`dev-plan`** — план реализации конкертной задачи, формат описания и детальность
- **`guide`** — User/developer guides (README, setup instructions)
- **`diagram-gen`** — Генерация диаграмм (Mermaid, PlantUML from code/description)
- **`changelog`** — Ведение changelog (conventional commits, semantic versioning)

---

## **planning/** — Планирование работ

- **`requirements`** — Сбор и анализ требований (functional/non-functional)
- **`strategy`** — Стратегия планирования (подходы, методологии)
- **`bug`** — Планирование фиксов багов (приоритизация, hotfix vs regular)
- **`feature`** — Планирование фич (scope definition, rollout strategy)
- **`estimation`** — Оценка времени (story points, t-shirt sizes, three-point estimation)
- **`risk-check`** — Анализ рисков (technical, business, mitigation strategies)
- **`refactor`** — Планирование рефакторинга (постепенный vs big bang, safe refactoring)
- **`migration-strategy`** — Стратегии миграций (DB schema, API versioning, data migration)
- **`change-rollback`** — Планы отката изменений (feature flags, blue-green deployment)

---

## **shared/** — Общие утилиты

- **`docs-paths`** — Описание документов и где что лежит
- **`base-rules`** — Базовые правила для всех агентов (как общаться с пользователем, на каком языке)