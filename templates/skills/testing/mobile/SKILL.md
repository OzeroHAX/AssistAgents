---
name: testing-mobile
description: Use when a request asks for manual verification of mobile app or mobile web scenarios on iOS or Android devices, including network and interruption behavior
---

<when_to_use>
  <item importance="critical">Use when a request asks to manually verify a mobile app or mobile web flow on iOS or Android devices.</item>
  <item importance="high">Use when gestures, permissions, rotation, backgrounding, interruptions, network changes, deep links, push notifications, or device-specific behavior must be checked with reproducible evidence.</item>
</when_to_use>

<input_requirements>
  <required>Target app or mobile web surface under test</required>
  <required>Platforms, OS versions, and device priority</required>
  <required>Key user scenarios and success criteria</required>
  <required>Build, environment access, and account or data constraints</required>
  <optional>Network profiles and offline expectations</optional>
  <optional>Permission, notification, deep-link, or sensor scope</optional>
  <optional>Supported locales, regions, timezone, and language settings</optional>
</input_requirements>

<when_not_to_use>
  <item importance="critical">Do not use for automation design, test framework implementation, or static code review.</item>
  <item importance="critical">Do not use as a replacement for implementation or planning work.</item>
  <item importance="high">Do not use for desktop-only browser verification when device-specific mobile behavior is out of scope.</item>
  <item importance="high">Do not use in production or destructive environments without explicit permission.</item>
</when_not_to_use>

<workflow>
  <step importance="critical">Confirm the target surface, scenarios, device and OS matrix, build, environment access, and required accounts or data.</step>
  <step importance="critical">Prepare a clean device state, verify the build version, set permissions, and record locale, timezone, and log collection setup.</step>
  <step importance="critical">Execute each scenario with gestures, system dialogs, input, and orientation checks, and verify the expected mobile behavior after each key step.</step>
  <step importance="high">When relevant, cover background and return, interruptions, network changes, offline recovery, deep links, push notifications, and sensors; then record pass-fail, observed versus expected behavior, device-specific differences, and evidence.</step>
</workflow>

<coverage>
  <focus>
    <item>Install, update, and uninstall</item>
    <item>Auth and key user flows</item>
    <item>Permissions and system dialogs</item>
    <item>Offline, online, and network degradation</item>
    <item>Orientation, keyboard, and input</item>
    <item>Deep links, push notifications, and app resume</item>
  </focus>
</coverage>

<output_requirements>
  <requirement importance="critical">Produce a per-scenario result with the target surface, device, OS, build, network state, and pass-fail status.</requirement>
  <requirement importance="critical">For each failed or risky check, record observed behavior, expected behavior, reproduction steps, and evidence such as logs, screenshots, or video.</requirement>
  <requirement importance="high">Separate application defects from device-specific, OS-level, network, notification, or environment issues when they differ.</requirement>
</output_requirements>

<quality_rules>
  <rule importance="critical">Expected outcome is unambiguous and verifiable</rule>
  <rule importance="high">Device, OS, build, network, and relevant locale settings are stated</rule>
  <rule importance="high">No duplicate checks across devices without a reason</rule>
  <rule importance="high">Device-specific differences and interruption handling are recorded explicitly</rule>
</quality_rules>

<validation>
  <item importance="critical">Scenarios or checks are reproducible and have explicit expected results.</item>
  <item importance="critical">Environment, device matrix, data, and execution constraints are recorded or assumed explicitly.</item>
  <item importance="high">Result capture, pass-fail signals, or evidence recording are explicit.</item>
</validation>

<do_not>
  <item importance="critical">Do not test production without permission</item>
  <item importance="high">Do not use real user data</item>
  <item importance="high">Do not rely only on emulators for sensors, camera, or interruption behavior</item>
  <item importance="high">Do not skip data cleanup or session reset between scenarios when it affects reproducibility</item>
</do_not>

<example_checks>
  <check>Verify login after rotation and returning from background</check>
  <check>Verify list loading on 4G -> offline -> 4G transition</check>
  <check>Verify location permission request and correct denial handling</check>
</example_checks>
