---
name: planning-project-testing-validation
description: Minimal validation strategy: scenarios, test data, regressions, and a "ready to demo" checklist.
---

<skill_overview>
  <purpose>Make validation fast, reproducible, and sufficient for v1.</purpose>
  <triggers>
    <trigger>You need to verify that the project works</trigger>
    <trigger>There is a risk of regressions or "works only for the author"</trigger>
  </triggers>
</skill_overview>

<guidelines>
  <guideline>Minimum: 3-5 smoke scenarios + 2-3 negative cases.</guideline>
  <guideline>If data exists, include 1-2 minimal test datasets.</guideline>
  <guideline>Validation should be doable in 10-15 minutes.</guideline>
</guidelines>

<output_template>
  <section name="Validation Plan">
    <subsection name="Smoke">3-5 short scenarios</subsection>
    <subsection name="Negative">2-3 error scenarios</subsection>
    <subsection name="Regression">what might break with changes</subsection>
  </section>
  <section name="Demo Checklist">
    <item>How to run</item>
    <item>What to demo (2-3 steps)</item>
    <item>What counts as a demo failure</item>
  </section>
</output_template>
