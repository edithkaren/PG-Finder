---
name: Live city availability
description: Product decision for how city coverage and freshness are represented.
---

City availability is currently sourced from the app's PostgreSQL listings table, not an external property marketplace feed. The UI should describe coverage as cities with current listings and refresh periodically so newly added properties appear without a manual reload.

**Why:** No external real-estate data provider was connected, and inventing nationwide availability would misrepresent the data.

**How to apply:** If broader city coverage or truly external real-time inventory is requested, add an approved data provider and define its freshness, attribution, and availability guarantees before replacing the database-backed source.