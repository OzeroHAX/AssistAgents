---
name: coder-rust-serde
description: Serde serialization and deserialization best practices. Use when designing JSON or config models.
---
<skill_overview>
  <purpose>Serialize and deserialize Rust types safely and predictably</purpose>
  <triggers>
    <trigger>Designing request/response DTOs</trigger>
    <trigger>Parsing JSON or config files</trigger>
    <trigger>Customizing field names or defaults</trigger>
    <trigger>Handling versioned schemas</trigger>
  </triggers>
  <sources>
    <source url="https://github.com/serde-rs/serde">Serde GitHub</source>
    <source url="https://docs.rs/serde">Serde Docs</source>
  </sources>
</skill_overview>
<derive>
  <rules>
    <rule>Use #[derive(Serialize, Deserialize)] for DTOs</rule>
    <rule>Keep DTOs separate from domain entities</rule>
    <rule>Prefer strongly typed structs over Value</rule>
  </rules>
</derive>
<field_attributes>
  <rules>
    <rule>Use #[serde(rename_all = "camelCase")] for JSON APIs</rule>
    <rule>Use #[serde(default)] for optional fields</rule>
    <rule>Use #[serde(skip_serializing_if = "Option::is_none")] for omitting nulls</rule>
    <rule>Use #[serde(flatten)] to merge nested fields</rule>
  </rules>
  <example>
    <code>
#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct UserDto {
    #[serde(default)]
    display_name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    email: Option<String>,
}
    </code>
  </example>
</field_attributes>
<validation_and_schema>
  <rules>
    <rule>Use #[serde(deny_unknown_fields)] for strict inputs</rule>
    <rule>Version payloads via enums or tagged variants</rule>
  </rules>
</validation_and_schema>
<custom_serialization>
  <rules>
    <rule>Use serialize_with/deserialize_with only when necessary</rule>
    <rule>Prefer newtype wrappers for custom formats</rule>
  </rules>
</custom_serialization>
<anti_patterns>
  <avoid name="untagged_everywhere">Avoid untagged enums for public APIs</avoid>
  <avoid name="stringly_typed">Avoid mapping enums to raw strings manually</avoid>
  <avoid name="value_for_core">Avoid serde_json::Value for core flows</avoid>
</anti_patterns>
