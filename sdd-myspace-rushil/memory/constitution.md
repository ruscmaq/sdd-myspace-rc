---
title: Constitution — MySpace Portal
description: Non-negotiable cross-cutting rules for the MySpace portal project.
ms.date: 2026-05-21
---

This constitution lists five short, cross-cutting, non-negotiable rules the project must honor.

1. Identity & auth — single source of truth, no local accounts.
All authentication and identity assertions must be delegated to a single trusted identity provider; the application must never accept or persist separate local credentials that create divergent identity states. ✅ Example: Users authenticate via the enterprise SSO; the app rejects requests that lack SSO-issued tokens.

2. Time — all timestamps stored and compared in UTC.
Persist every timestamp in UTC and perform all comparisons, windows, and rollups using UTC to avoid ambiguity across regions and daylight-saving transitions. ✅ Example: Database `created_at` and API payloads use RFC3339 UTC (e.g., 2026-05-21T14:00:00Z).

3. PII — never logged in plain text; redact before any log call.
Treat personally identifiable information (PII) as sensitive by default: redact or hash PII prior to logging, and use structured fields that distinguish redacted values from metadata. ✅ Example: Log `user_id: 12345, user_email: <redacted>` rather than the raw email address.

4. Secrets — never in code; environment variables only.
All secrets (API keys, DB passwords, signing keys) must be injected at runtime via environment variables or a secrets service; secrets must never be checked into source control, config files, or build artifacts. ✅ Example: Database credentials are read from `DATABASE_URL` at process start and not stored in repo files.

5. Observability — every write operation must emit a structured log event with actor, action, entity id.
Every state-changing operation must produce a structured, machine-parsable event that includes the acting principal, the action performed, and the target entity identifier to support auditing, alerting, and tracing. ✅ Example: On leave creation emit `event: "leave.create", actor: "user:AZ123", action: "create", entity_id: "leave:98765"`.
