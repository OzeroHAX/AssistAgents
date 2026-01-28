---
name: coder-rust-axum-api
description: Axum Web API best practices including routing, extractors, state, middleware, and error handling. Use when building REST APIs with axum.
---
<skill_overview>
  <purpose>Build robust, typed, and maintainable HTTP APIs with axum</purpose>
  <triggers>
    <trigger>Creating new axum endpoints</trigger>
    <trigger>Designing routers and route groups</trigger>
    <trigger>Using extractors for request data</trigger>
    <trigger>Sharing application state safely</trigger>
    <trigger>Implementing middleware and error mapping</trigger>
  </triggers>
  <sources>
    <source url="https://github.com/tokio-rs/axum">Axum GitHub</source>
    <source url="https://github.com/tokio-rs/axum/blob/main/axum/src/docs/extract.md">Axum Extractors Docs</source>
  </sources>
</skill_overview>
<routing>
  <rules>
    <rule>Use Router::route with method routers for clarity</rule>
    <rule>Group related endpoints with nested routers</rule>
    <rule>Prefer typed Path and Query extractors over manual parsing</rule>
    <rule>Use fallback to handle unknown routes consistently</rule>
  </rules>
  <example>
    <code>
use axum::{routing::{get, post}, Router};

let app = Router::new()
    .route("/users", get(list_users).post(create_user))
    .route("/users/{id}", get(get_user));
    </code>
  </example>
</routing>
<extractors>
  <principles>
    <principle>Compose multiple extractors in one handler</principle>
    <principle>Only one body-consuming extractor per handler</principle>
    <principle>Validate and deserialize input via extractors, not manually</principle>
  </principles>
  <common>
    <item>Path for route params</item>
    <item>Query for query string</item>
    <item>Json for JSON payloads</item>
    <item>State for shared app state</item>
  </common>
  <example>
    <code>
async fn handler(
    State(state): State<AppState>,
    Path(id): Path<u64>,
    Query(params): Query<Pagination>
) { /* ... */ }
    </code>
  </example>
</extractors>
<state_management>
  <rules>
    <rule>Keep AppState cloneable and cheap to clone</rule>
    <rule>Store shared resources behind Arc</rule>
    <rule>Use State for app-level dependencies</rule>
  </rules>
  <example>
    <code>
#[derive(Clone)]
struct AppState {
    pool: std::sync::Arc<DbPool>,
}
    </code>
  </example>
</state_management>
<middleware>
  <rules>
    <rule>Apply Router::layer for global middleware</rule>
    <rule>Use route_layer for per-route middleware</rule>
    <rule>Prefer explicit ordering of layers</rule>
  </rules>
  <example>
    <code>
use axum::{middleware, Router};

let app = Router::new()
    .route("/health", get(health))
    .route_layer(middleware::from_fn(auth_middleware));
    </code>
  </example>
</middleware>
<error_handling>
  <rules>
    <rule>Return Result from handlers and map errors to responses</rule>
    <rule>Implement IntoResponse for custom error types</rule>
    <rule>Never panic on expected errors</rule>
  </rules>
  <example>
    <code>
enum AppError { NotFound, BadRequest }

impl axum::response::IntoResponse for AppError { /* map to status */ }

async fn handler() -> Result<impl axum::response::IntoResponse, AppError> { /* ... */ }
    </code>
  </example>
</error_handling>
