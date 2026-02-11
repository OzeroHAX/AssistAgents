---
name: shared-docs-paths
description: Project documentation map. Must be loaded before any work
---

<docs_paths>
    <root name="ai-docs">
        <section name="changelogs">
            <purpose>History of changes for tasks and releases</purpose>
            <when>When changes need to be recorded at the user's request</when>
            <format>{date time}-{user friendly name}.md</format>
        </section>

        <section name="dev-plans">
            <purpose>Development plans for tasks and changes</purpose>
            <when>Before implementation, to align on the work plan</when>
            <format>{date time}-{user friendly name}.md</format>
        </section>

        <section name="guides">
            <purpose>Guides and instructions for users and developers</purpose>
            <when>When a user or technical guide is needed</when>
            <format>{user friendly name}.md</format>
        </section>

        <section name="project">
            <purpose>Documents about project goals, context, and structure</purpose>
            <when>During planning, requirement changes, architecture updates, or implementation</when>

            <file name="arch.md">
                <purpose>Project architecture and key decisions</purpose>
                <when>Before planning or changing code</when>
            </file>

            <file name="brief.md">
                <purpose>Brief with answers needed to start the project</purpose>
                <when>At initial planning and requirement clarification</when>
            </file>

            <section name="epics">
                <purpose>Project epics and large work blocks</purpose>
                <when>When planning the roadmap and decomposing tasks</when>
                <format>{epic key}-{epic number}-{user friendly name}.md</format>
            </section>

            <file name="personals.md">
                <purpose>User personas, their pains, needs, and concerns</purpose>
                <when>When shaping goals, scenarios, and UX decisions</when>
            </file>

            <file name="prd.md">
                <purpose>Complete product description and requirements</purpose>
                <when>When defining functionality and success criteria</when>
            </file>

            <section name="researches">
                <purpose>Research results for tasks and projects</purpose>
                <when>When decisions require evidence</when>
                <format>{date time}-{user friendly name}.md</format>
            </section>

            <file name="status.json">
                <purpose>Current planning phase and stage</purpose>
                <when>To understand progress and the next step</when>
            </file>

            <section name="tasks">
                <purpose>Project tasks in an implementation-ready format</purpose>
                <when>When working on a specific task or subtask</when>
                <format>{task key}-{task number}-{user friendly name}.md</format>
            </section>

            <section name="use-cases">
                <purpose>Project use cases and usage scenarios</purpose>
                <when>When designing functionality and flows</when>
                <format>{use case key}-{use case number}-{user friendly name}.md</format>
            </section>
        </section>

        <section name="reports">
            <section name="bug-reports">
                <purpose>Reports about discovered bugs</purpose>
                <when>After defects are found and recorded</when>
                <format>{date time}-{user friendly name}.md</format>
            </section>
            <section name="test-reports">
                <purpose>Test run results and verification outcomes</purpose>
                <when>After testing or before release</when>
                <format>{date time}-{user friendly name}.md</format>
            </section>
        </section>
    </root>

    <rules>
        <rule importance="critical">Before reading or creating/updating any document from this list, load the skill that describes that document</rule>
    </rules>
</docs_paths>
