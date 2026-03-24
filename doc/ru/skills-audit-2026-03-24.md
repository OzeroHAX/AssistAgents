# Аудит skills на 2026-03-24

## Методология

- Базовый rubric: `templates/skills/skill-authoring/SKILL.md` с правилами L1-L8.
- Внешние best practices: Claude Code best practices, Agent Skills best practices/specification, OpenCodeDocs best practices.
- Уточнение по структуре: вложенная `templates/skills/**` структура НЕ считалась дефектом, потому что это шаблоны npm-пакета, а не hand-authored flat-layout для пользователя.
- Важное уточнение по специфике: это пакет **универсальных** skills. Поэтому отсутствие project-local деталей само по себе НЕ считалось минусом.
- В этом контексте "конкретика" трактовалась как **domain/task specificity**, а не как привязка к конкретному репозиторию, команде или бизнес-домену пользователя.
- Для `docs/*` и `shared/*` применялась более мягкая интерпретация: они рассматривались как возможные semantic/support skills, а не только как классические artifact-producing skills.
- Шкала: `8/8 = Production-grade`, `6-7 = Acceptable`, `<=5 = Reject`.
- Считал важными не только формальные поля, но и реальную эффективность: меняет ли skill поведение агента, снижает ли ambiguity и даёт ли проверяемый outcome.

## Сводка

- Всего проверено: **86** skills (все, кроме `skill-authoring`).
- Средний балл: **5.94/8**.
- `Production-grade`: **0**.
- `Acceptable`: **69**.
- `Reject`: **17**.

### По группам

- `coder`: средний балл **6.91/8** (11 skills)
- `docs`: средний балл **3.73/8** (15 skills)
- `planning`: средний балл **6.20/8** (15 skills)
- `project`: средний балл **6.44/8** (16 skills)
- `review`: средний балл **6.27/8** (11 skills)
- `shared`: средний балл **5.00/8** (2 skills)
- `task-use`: средний балл **7.00/8** (4 skills)
- `testing`: средний балл **6.33/8** (12 skills)

### Главные системные выводы

- Самая сильная часть набора: `coder/*`, `task-use/*`, `project/fast/*`, часть `testing/*` и `review/*`.
- Самая слабая часть всё ещё `docs/*` и оба `shared/*`, но после поправки их корректнее трактовать как lightweight semantic/support skills. Они слабые не из-за универсальности, а из-за слишком тонкого execution contract.
- Ни один skill не дотягивает до `8/8`: чаще всего не хватает явного `when_not_to_use`, формального validation loop или чёткого шаблона результата.
- Универсальность набора в целом реализована хорошо: большинство skills абстрагированы до reusable task patterns без ненужной project-local привязки.
- Почти весь набор живёт только в одном `SKILL.md`; для коротких универсальных skills это нормально, но для `docs/*`, `shared/*` и части orchestration skills `references/` и `assets/` могли бы дать более чистое progressive disclosure.
- Отсутствие project-specific контекста не считалось проблемой; проблемой считалась только избыточная абстрактность, когда skill уже не задаёт достаточно конкретного поведения.
- XML-подобная разметка делает skills машинно-предсказуемыми, но уступает markdown-heading структуре по сканируемости и хуже поддерживает progressive disclosure.

## Полная таблица

| Skill | Score | Status | Обоснование | Улучшение |
|---|---:|---|---|---|
| `coder/frontend/design` | **6/8** | Acceptable | Сильный trigger, входы, ограничения и ссылки на стандарты; не хватает явного when-not-to-use и более жёсткого validation loop. | Добавить секцию when_not_to_use и короткий self-check/validator перед завершением. |
| `coder/frontend/ui-ux` | **7/8** | Acceptable | Хорошо задаёт поведение через flows/states/accessibility и измеримые критерии; границы использования описаны не полностью. | Явно отделить skill от visual design/system-design задач и добавить шаблон итогового UX-audit. |
| `coder/rules/clean-code` | **7/8** | Acceptable | Почти полноценный behavioral contract: есть trigger, workflow, checklist, запреты и verifiable outputs. | Добавить explicit when_not_to_use, чтобы снизить overlap с более узкими coder/review skills. |
| `coder/rules/debug-requirements` | **7/8** | Acceptable | Чётко переводит debugging в воспроизводимый процесс с verification и regression guardrails. | Добавить явные exclusion rules, когда нужен не debug, а normal feature planning. |
| `coder/rules/requirements` | **7/8** | Acceptable | Хорошая спецификация требований с traceability и output templates; поведение меняет заметно. | Добавить мини-workflow применения и явный when_not_to_use для случаев discovery/brainstorming. |
| `coder/system-design/api-design` | **7/8** | Acceptable | Содержит decision rules, anti-patterns и output contract, опирается на внешние стандарты. | Добавить explicit boundary against internal event/schema design и короткий validation checklist после выбора API shape. |
| `coder/system-design/db-schema` | **7/8** | Acceptable | Хорошо покрывает schema design и migration safety; strong do-not rules и output contract. | Добавить when_not_to_use для non-relational/datastore cases и шаблон post-migration verification. |
| `coder/system-design/external-api` | **7/8** | Acceptable | Один из лучших skills: workflow, reliability/security controls, outputs и source-backed guidance. | Добавить explicit non-applicability for internal APIs and a concrete validation loop for contract checks. |
| `coder/system-design/perf-patterns` | **7/8** | Acceptable | Сильный выбор паттернов от bottleneck/SLO, хорошие anti-patterns и output expectations. | Добавить self-check на baseline measurement и явную границу против micro-optimization tasks. |
| `coder/system-design/security` | **7/8** | Acceptable | Хорошо задаёт security-by-design baseline, decision framework и release gates. | Добавить when_not_to_use для purely operational pentest tasks и шаблон evidence matrix. |
| `coder/system-design/testable-code` | **7/8** | Acceptable | Хороший набор design principles и output requirements, skill меняет инженерное поведение. | Добавить explicit exclusions для задач чисто ручного тестирования и validator checklist по test seams. |
| `docs/changelog` | **3/8** | Reject | Как универсальный semantic descriptor для changelog допустим, но как standalone skill слишком тонкий: нет workflow, структуры результата и верификации. | Либо превратить в полноценный skill с шаблоном changelog и quality gates, либо вынести в references/assets. |
| `docs/dev-plan` | **3/8** | Reject | Как метка типа документа уместен в universal package, но сам по себе почти не задаёт поведение агента. | Добавить структуру плана, правила верификации и do-not; иначе перевести в reference/template. |
| `docs/diagram-gen` | **3/8** | Reject | Для универсального набора это понятный semantic anchor, но без выбора типа диаграммы, формата и проверок он слишком абстрактен. | Определить входы, выбор типа диаграммы, output template и validation checks для Mermaid. |
| `docs/guide` | **3/8** | Reject | Как универсальный guide label оправдан, но behavioural contract почти отсутствует. | Сделать guide-authoring contract: audience, prerequisites, steps, validation and anti-patterns. |
| `docs/project/arch` | **4/8** | Reject | Как descriptor архитектурного документа в generated ecosystem полезен, но всё ещё не дотягивает до полноценного skill contract. | Либо слить с `project-standart-arch`, либо добавить template, checks и exclusion rules. |
| `docs/project/brief` | **4/8** | Reject | Как semantic anchor для `brief.md` уместен, но instructions how/when/validate слишком слабы. | Определить required sections, success criteria и review loop либо оставить reference-only. |
| `docs/project/epic` | **4/8** | Reject | Хорошо обозначает тип артефакта, но почти не управляет процессом его создания или оценки. | Добавить epic template, traceability rules и anti-patterns или убрать из skill-слоя. |
| `docs/project/personals` | **4/8** | Reject | В универсальном пакете это нормальный descriptor персон, но execution contract остаётся неполным. | Описать persona-authoring workflow и validation against research/PRD. |
| `docs/project/prd` | **4/8** | Reject | Для generated PRD ecosystem такой skill логичен, но он больше описывает сущность, чем задаёт воспроизводимую процедуру. | Либо использовать `project-standart-proj-description`, либо добавить full PRD authoring contract. |
| `docs/project/research-summary` | **4/8** | Reject | Семантически полезен для universal docs stack, но без evidence workflow и quality gate остаётся слабым. | Добавить структуру evidence summary, source rules и impact section. |
| `docs/project/status` | **4/8** | Reject | Как описание `status.json` в общем документном контуре полезен, но дублирует более сильные status-oriented skills. | Удалить как отдельный skill или превратить в reference к status schema. |
| `docs/project/task` | **4/8** | Reject | Для universal package адекватно маркирует task document, но не задаёт достаточно сильный creation/review process. | Добавить task template, dependency/DoD checks и when_not_to_use. |
| `docs/project/use-case` | **4/8** | Reject | Имеет смысл как lightweight semantic skill, но без явного flow design contract остаётся слишком декларативным. | Добавить use-case format, traceability matrix и anti-patterns. |
| `docs/report/bug-reporting` | **4/8** | Reject | Как типовой bug-report descriptor полезен, но самостоятельного поведения для агента почти не задаёт. | Сделать полноценный bug-report skill с repro/evidence/impact template. |
| `docs/report/test-reporting` | **4/8** | Reject | В universal docs stack это осмысленный semantic anchor, но без метода и report schema он всё ещё слаб. | Добавить report template, pass/fail gates и required evidence fields. |
| `planning/approach-selection` | **6/8** | Acceptable | Есть inputs, method, output и quality rules; skill полезен и не перегружен. | Добавить явные anti-patterns и when_not_to_use для trivial single-option tasks. |
| `planning/base` | **6/8** | Acceptable | Хороший универсальный baseline и examples, но слабее в boundary clarity и measurable validation loop. | Добавить explicit when_not_to_use и формальный self-check перед выдачей плана. |
| `planning/change-inventory` | **6/8** | Acceptable | Чётко ограничен file/component inventory, задаёт output и role в planning stack. | Добавить do_not/anti-patterns и критерий завершённости inventory. |
| `planning/estimation` | **6/8** | Acceptable | Хорошая единая форма estimation с assumptions и uncertainty. | Добавить explicit exclusions для roadmap/business estimation и validator against known constraints. |
| `planning/impact-analysis` | **6/8** | Acceptable | Хорошо отделяет impact от edit inventory, есть outputs и quality rules. | Добавить anti-patterns и более явную проверку полноты affected contracts. |
| `planning/migration-strategy` | **6/8** | Acceptable | Полезный migration-specific planning skill с patterns и verification focus. | Добавить do_not и более жёсткую фазовую validation loop. |
| `planning/monitoring-checks` | **6/8** | Acceptable | Неплохо формализует observability requirements после изменений. | Добавить explicit when_not_to_use и анти-паттерны вроде vanity metrics/no rollback signal. |
| `planning/requirements-extraction` | **7/8** | Acceptable | Один из сильнейших planning skills: хорошо извлекает requirements, constraints и repro. | Добавить шаблон confidence/open-questions matrix и explicit handoff to downstream skills. |
| `planning/risk-assessment` | **6/8** | Acceptable | Ясный scope и useful output format, но мало guardrails against vague risk lists. | Добавить do_not и правило приоритизации residual risk по release impact. |
| `planning/rollback-mechanism` | **7/8** | Acceptable | Сильный deterministic skill с criteria, steps, recovery и verification. | Добавить when_not_to_use для pure no-op or documentation-only changes. |
| `planning/rollout-strategy` | **6/8** | Acceptable | Практичный rollout scaffold с outputs, но недостаёт anti-pattern coverage. | Добавить explicit stop-conditions, do_not и validation against monitoring/rollback plans. |
| `planning/scope-definition` | **6/8** | Acceptable | Чётко формулирует in/out and non-goals, помогает уменьшить ambiguity. | Добавить anti-patterns и self-check на conflicts with acceptance criteria. |
| `planning/scope-minimization` | **7/8** | Acceptable | Хорошо ориентирован на smallest safe fix и verifiable behavior. | Добавить явное when_not_to_use для net-new features and strategic rewrites. |
| `planning/task-classifier` | **6/8** | Acceptable | Полезный classifier с signals and planning focus, меняет дальнейший workflow. | Добавить anti-patterns и explicit fallback for mixed/compound tasks. |
| `planning/testing-strategy` | **6/8** | Acceptable | Компактный и полезный planning skill для verification design. | Добавить do_not и output template с mapping AC -> test type -> evidence. |
| `project/discovery/mode-selector` | **7/8** | Acceptable | Сильный orchestration skill: inputs, decision rules, outputs и escalation triggers прописаны хорошо. | Добавить explicit failure mode when evidence is insufficient and a short validation checklist. |
| `project/fast/init` | **7/8** | Acceptable | Хорошо позиционирован в pipeline fast-flow, задаёт preloads, outputs и quality rules. | Добавить when_not_to_use и template для resulting artifact to improve verifiability. |
| `project/fast/proto-spec` | **7/8** | Acceptable | Полезный compact-spec contract с good placement in flow and verification gate intent. | Добавить явную анти-паттерн секцию и шаблон proto-spec structure. |
| `project/fast/pulse-scan` | **7/8** | Acceptable | Хорошо ограниченный research gate для fast planning, поддерживает escalation logic. | Добавить formal evidence format and explicit timebox failure handling. |
| `project/fast/stack-pick` | **7/8** | Acceptable | Чёткий evidence-based selection skill с ясной ролью в fast-mode. | Добавить default-vs-alternative policy и explicit non-applicability for preselected stacks. |
| `project/fast/status` | **7/8** | Acceptable | Очень сильный status contract с JSON schema-like output and gates; один из лучших по детерминизму. | Добавить явное when_not_to_use и пример error recovery flow when status is inconsistent. |
| `project/fast/task-blast` | **7/8** | Acceptable | Хорошо оформленная fast decomposition with sequencing/DoD focus. | Добавить anti-patterns и validation checklist against proto-spec completeness. |
| `project/standart/arch` | **6/8** | Acceptable | Хороший document-producing skill с чётким placement and outputs, но мало negative boundaries. | Добавить do_not и artifact review checklist before handoff to epics. |
| `project/standart/brief` | **6/8** | Acceptable | Хорошо задаёт foundation for standard planning, with preloads and output structure. | Добавить anti-patterns и formal success criteria for brief quality. |
| `project/standart/decomposition` | **6/8** | Acceptable | Практичный standard-flow decomposition skill, но хотелось бы больше guardrails. | Добавить do_not, validation against PRD/use cases and a task template example. |
| `project/standart/epic` | **6/8** | Acceptable | Есть place in flow, document target and outputs; работает как useful planning contract. | Добавить explicit non-goals и acceptance checklist for epic slicing quality. |
| `project/standart/personas` | **6/8** | Acceptable | Полезно структурирует persona work, но границы и проверка качества описаны слабее. | Добавить research-backed validation criteria and anti-stereotype do-not rules. |
| `project/standart/proj-description` | **6/8** | Acceptable | Хороший PRD-producing contract с правильным порядком в standard flow. | Добавить explicit review gate and output template fragments for FR/NFR/AC traceability. |
| `project/standart/research` | **6/8** | Acceptable | Хорошо встроен в flow и ориентирован на closing critical unknowns. | Добавить source quality rules, evidence format and when_not_to_use for obvious/no-research tasks. |
| `project/standart/status` | **6/8** | Acceptable | Полезный status tracker, но менее полный, чем fast/status: слабее output/method/boundary coverage. | Добавить method, do_not и example JSON update to improve determinism. |
| `project/standart/usecases` | **6/8** | Acceptable | Правильно сфокусирован на PRD traceability and user flows. | Добавить anti-patterns и validation checklist for main/alt/error flows. |
| `review/arch/consistency` | **6/8** | Acceptable | Хороший narrow review skill с outputs and do-not, но без явного result validator/template. | Добавить standard verdict format and when_not_to_use versus full-check. |
| `review/arch/full-check` | **6/8** | Acceptable | Полезный comprehensive architecture review skill, меняет review depth and focus. | Добавить explicit exclusion rules and PASS/FAIL evidence checklist. |
| `review/code/checklist` | **6/8** | Acceptable | Компактный review gate, полезен как quick filter before merge. | Добавить output template with severity buckets and when_not_to_use for deep reviews. |
| `review/code/idiom-check` | **6/8** | Acceptable | Хорошо изолирует idiomatic review concern, что соответствует single responsibility. | Добавить examples of good/bad idioms and explicit non-applicability to architecture/security reviews. |
| `review/code/maintain` | **6/8** | Acceptable | Понятный maintainability lens for code review with actionable output. | Добавить sharper validation criteria and overlap boundaries versus clean-code skill. |
| `review/code/performance` | **6/8** | Acceptable | Хорошо направляет reviewer на hot paths and measurable regressions. | Добавить explicit evidence template (baseline/after/risk) and when_not_to_use for non-critical paths. |
| `review/code/requirements` | **7/8** | Acceptable | Один из самых сильных review skills: ясный method, traceability и output expectations. | Добавить explicit exclusions versus QA/test review and a quick self-check matrix. |
| `review/code/security` | **6/8** | Acceptable | Полезный security review lens с понятными checks и запретами. | Добавить verdict template and clearer boundary against full security testing/pentest. |
| `review/code/strategy` | **7/8** | Acceptable | Сильный orchestration skill для review flow, severity model and blocking rules. | Добавить explicit when_not_to_use for tiny low-risk diffs or purely style review. |
| `review/doc/quality` | **6/8** | Acceptable | Хороший focused quality gate for docs with PASS/FAIL signal. | Добавить more explicit anti-pattern coverage and boundary against doc-strategy skill. |
| `review/doc/strategy` | **7/8** | Acceptable | Чётко задаёт review flow and severity model for documentation review. | Добавить self-check template and more concrete output artifact format. |
| `shared/base-rules` | **5/8** | Reject | Для universal package это уже не просто шум, а базовый support skill с заметным behavior impact, но он всё ещё слишком широк и слабо ограничен. | Перенести в agent/system config или превратить в reference; если оставлять skill, добавить trigger boundaries and observable outputs. |
| `shared/docs-paths` | **5/8** | Reject | Как support skill для generated docs ecosystem он полезен, но ближе к reference inventory, чем к полному behavioral skill. | Перенести в `references/` либо добавить explicit workflow: how to choose/read/update docs with validation. |
| `task-use/creator/decomposition-strategy` | **7/8** | Acceptable | Хорошо разводит main agent и subagent responsibilities, есть limits, depth levels and output contract. | Добавить explicit validation of draft quality before returning it to the main agent. |
| `task-use/research/code-strategy` | **7/8** | Acceptable | Сильный subagent strategy skill: clear delegation boundary, evidence requirements and examples. | Добавить explicit response schema for returned findings and a short self-check against scope creep. |
| `task-use/research/context-strategy` | **7/8** | Acceptable | Хорошо ограничивает domain/business research от code tracing и задаёт output expectations. | Добавить validator checklist for source quality and explicit non-goals for implementation planning. |
| `task-use/research/web-strategy` | **7/8** | Acceptable | Один из лучших task-use skills: strong boundaries, primary-source bias, output requirements and limitations. | Добавить short validation loop for freshness/conflict resolution and preferred source hierarchy defaults. |
| `testing/a11y` | **6/8** | Acceptable | Хороший a11y-focused execution contract, though description is generic and output format implicit. | Уточнить description с when-to-use и добавить standard result format with severity and evidence. |
| `testing/api-manual` | **7/8** | Acceptable | Сильный reproducible manual API testing skill с coverage, rules и anti-patterns. | Добавить output template/report schema for consistent result capture. |
| `testing/aqa` | **6/8** | Acceptable | Хорошая концентрация на deterministic automation patterns and CI artifacts. | Добавить явный output contract и when_not_to_use для exploratory/manual testing. |
| `testing/browser-manual` | **7/8** | Acceptable | Один из самых полных testing skills: preparation, execution, checklist, boundaries and observed-behavior focus. | Добавить result template with severity/evidence links to make output fully standardized. |
| `testing/checklist` | **6/8** | Acceptable | Чётко отделяет checklist от test cases и задаёт construction rules. | Добавить explicit output format and validation step against release risks. |
| `testing/contract` | **7/8** | Acceptable | Хорошо структурирован around provider/consumer compatibility, versioning and reproducibility. | Добавить standardized verdict/report template and clearer escalation path on breaking change. |
| `testing/e2e-flow` | **6/8** | Acceptable | Хороший e2e execution lens, но description and outputs остаются слишком общими. | Уточнить trigger в description и добавить final report structure with pass/fail per stage. |
| `testing/load` | **6/8** | Acceptable | Полезный load testing contract с thresholds, metrics and safety rules. | Уточнить description when-to-use и добавить output/report template with baseline-comparison. |
| `testing/mobile` | **6/8** | Acceptable | Хороший coverage of mobile-specific risks and execution rules. | Добавить explicit result schema and clearer exclusions versus browser-manual/responsive testing. |
| `testing/security` | **6/8** | Acceptable | Неплохой baseline security testing skill с coverage and do-not rules. | Сделать description конкретнее и добавить report template with severity/evidence/remediation. |
| `testing/test-case` | **7/8** | Acceptable | Сильный design skill для reproducible test cases, есть anti-patterns и good/bad examples. | Добавить optional output template/table and a validation loop against linked AC/requirements. |
| `testing/visual-regression` | **6/8** | Acceptable | Полезно покрывает preparation/execution for visual diff work, but output contract could be stronger. | Уточнить description с when-to-use и добавить standardized diff triage report format. |

## Приоритетные улучшения

1. Определиться с ролью `docs/*` и `shared/*`: либо оставить их как lightweight semantic/support skills и явно ослабить для них rubric, либо превратить их в полноценные skills с triggers, method, output и validation.
2. Добавить всем acceptables явный `when_not_to_use` и короткий `self-check`/`validation loop` перед финализацией.
3. Для `planning/*`, `review/*`, `testing/*` стандартизировать итоговый output template: verdict, evidence, risks, follow-up.
4. Вынести объёмные справочные детали в `references/` и добавить явные указания, когда их загружать.
5. Сохраняя универсальность, добавить больше reusable domain defaults, recurring mistakes, output templates и edge cases, чтобы skills были repo-agnostic, но не расплывчаты.
6. Добавить примеры good/bad outputs там, где сейчас есть только декларативные списки правил.
7. Для самых сильных skills (`coder/*`, `task-use/*`, `project/fast/*`) можно быстро выйти на `8/8`, если добавить жёсткие boundaries и формальные validators.
