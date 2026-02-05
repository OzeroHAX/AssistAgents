---
name: testing-mobile
description: Mobile testing (native/hybrid/web, gestures, offline, interruptions)
---

<input_requirements>
  <required>Platforms and OS versions (iOS/Android)</required>
  <required>App type (native/hybrid/mobile web)</required>
  <required>Key user scenarios list</required>
  <required>Success criteria for each scenario</required>
  <optional>Device/emulator list and priority</optional>
  <optional>Network constraints (2G/3G/LTE/Wi-Fi, offline)</optional>
  <optional>Supported languages and regions</optional>
  <optional>Environment constraints (feature flags, test environments)</optional>
</input_requirements>

<preparation>
  <steps>
    <step>Install the latest build and verify the version</step>
    <step>Prepare a clean profile (fresh install) if needed</step>
    <step>Configure permissions (camera, location, notifications)</step>
    <step>Record device, OS, language, and timezone</step>
    <step>Enable log/console collection if available</step>
  </steps>
</preparation>

<execution_rules>
  <rule importance="critical">Scenarios are reproducible on the specified device and OS version</rule>
  <rule importance="critical">Cover touch/gesture interactions and system dialogs</rule>
  <rule importance="high">Verify behavior on orientation change</rule>
  <rule importance="high">Verify backgrounding/return and interruptions (call/notification)</rule>
  <rule importance="high">Verify behavior on network changes (offline/slow)</rule>
  <rule importance="medium">Verify launch time and key performance metrics</rule>
  <rule importance="medium">Record device-specific details in the result</rule>
</execution_rules>

<coverage>
  <focus>
    <item>Install/update/uninstall</item>
    <item>Auth and key user flows</item>
    <item>Permissions and system dialogs</item>
    <item>Offline/online and network degradation</item>
    <item>Orientation, keyboard, input</item>
    <item>Deep links and push notifications</item>
  </focus>
</coverage>

<quality_rules>
  <rule importance="critical">Expected outcome is unambiguous and verifiable</rule>
  <rule importance="high">Device, OS, build, and network are stated</rule>
  <rule importance="high">No duplicate checks across devices without a reason</rule>
  <rule importance="medium">App data and state are recorded</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not test production without permission</item>
  <item importance="high">Do not use real user data</item>
  <item importance="high">Do not rely only on emulators for sensors/camera</item>
  <item importance="high">Do not skip data cleanup between scenarios when needed</item>
</do_not>

<example_checks>
  <check>Verify login after rotation and returning from background</check>
  <check>Verify list loading on 4G -> offline -> 4G transition</check>
  <check>Verify location permission request and correct denial handling</check>
</example_checks>
