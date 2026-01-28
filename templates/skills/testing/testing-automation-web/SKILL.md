---
name: testing-automation-web
description: Web automation testing with Playwright/Cypress. Use when transitioning from manual to automated tests.
---
<skill_overview>
  <purpose>Convert manual test scenarios into stable, reliable automated tests using modern frameworks</purpose>
  <triggers>
    <trigger>User requests to automate a manual test case</trigger>
    <trigger>Transitioning from manual exploration to regression suite</trigger>
    <trigger>Writing E2E tests for verified features</trigger>
  </triggers>
</skill_overview>

<framework_selection>
  <framework name="Playwright">
    <when_to_use>Modern web apps, cross-browser, speed, stability</when_to_use>
    <key_features>Auto-waiting, tracing, reliable locators</key_features>
  </framework>
  <framework name="Cypress">
    <when_to_use>Component testing, developer-friendly experience</when_to_use>
    <key_features>Time travel, real-time reloading, easy debugging</key_features>
  </framework>
</framework_selection>

<automation_principles>
  <principle name="Resilient Locators">
    <description>Use user-facing attributes over implementation details</description>
    <good>getByRole('button', { name: 'Submit' })</good>
    <good>getByTestId('submit-order')</good>
    <bad>css('.btn-primary')</bad>
    <bad>xpath('//div[3]/button')</bad>
  </principle>

  <principle name="Independence">
    <description>Tests should not depend on each other</description>
    <rule>Each test creates its own data</rule>
    <rule>Clean up data after test (or use ephemeral env)</rule>
    <rule>Do not rely on state from previous tests</rule>
  </principle>

  <principle name="Wait Mechanisms">
    <description>Avoid hardcoded waits</description>
    <good>await expect(page.locator('.success')).toBeVisible()</good>
    <bad>await page.waitForTimeout(5000)</bad>
  </principle>
</automation_principles>

<workflow_manual_to_auto>
  <step>1. Verify the scenario manually first to ensure feature works</step>
  <step>2. Identify stable locators for all interactive elements</step>
  <step>3. Map manual steps to framework commands</step>
  <step>4. Replace manual data entry with fixtures or factories</step>
  <step>5. Add assertions for key states (not just "no error")</step>
</workflow_manual_to_auto>

<code_structure_playwright>
  <template>
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature: [Name]', () => {
  test.beforeEach(async ({ page }) => {
    // Setup state
    await page.goto('/[url]');
  });

  test('should [expected behavior]', async ({ page }) => {
    // Arrange
    const user = { name: 'Test User' };
    
    // Act
    await page.getByLabel('Name').fill(user.name);
    await page.getByRole('button', { name: 'Save' }).click();

    // Assert
    await expect(page.getByText('Saved successfully')).toBeVisible();
  });
});
```
  </template>
</code_structure_playwright>
