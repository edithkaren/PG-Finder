---
name: Auth session schema
description: Durable setup constraint for Replit Auth session persistence.
---

Replit Auth's PostgreSQL session store expects a `sessions` table to exist before the server starts. Declaring the table only in a separate auth model is not enough for the project's Drizzle schema push; it must also be included in the schema used by `drizzle.config.ts`.

**Why:** The app can start while the session store repeatedly logs `relation "sessions" does not exist`, making authentication unreliable.

**How to apply:** When setting up or repairing Replit Auth, verify the development database contains `sessions` with `sid`, `sess`, and `expire`, and keep that table represented in the tracked schema.