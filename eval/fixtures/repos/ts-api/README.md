# TS API Fixture

Small TypeScript API fixture used for eval runs.

Current repository facts:

- exposes a simple auth-related module in `src/auth.ts`
- models a `Session` with `userId`, `role`, and `token`
- contains role-based access logic for admin data
- is intentionally minimal and does not include a full runnable server
