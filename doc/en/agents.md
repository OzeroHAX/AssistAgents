# Agents and When to Use Them

## Main Agents

- `build-dev` - code implementation, fixes, and step-by-step verification.
- `build-planner` - read-only implementation planning.
- `test` - testing plus test-report and bug-report artifacts.
- `review` - read-only code review and risk assessment.
- `doc` - user/operational documentation in the allowed docs scope.
- `project` - project management agent: planning, decomposition, and project artifact maintenance.
- `ask` - quick questions and research without edits.

## Subagents

The system also includes specialized subagents for delegation:

- code research;
- web research;
- decomposition.

Main agents typically call them when focused analysis is needed.

## Agent Selection Guide

- Need a plan before edits -> `build-planner`.
- Need code changes -> `build-dev`.
- Need verification and reports -> `test`.
- Need independent quality/risk review -> `review`.
- Need user-facing docs -> `doc`.
- Need project-level work (goals, scope, PRD, architecture, epics, use cases, tasks) -> `project`.
- Need a quick answer or research -> `ask`.
