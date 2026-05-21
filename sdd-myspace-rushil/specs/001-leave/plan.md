---
title: Leave widget implementation plan
description: Plan for implementing the MySpace portal leave balance widget and apply-leave flow using Next.js, Prisma, and Postgres.
ms.date: 2026-05-21
---

# Stack and Scope

Stack: Next.js 14 + Prisma + Postgres.

This plan focuses on the leave balance view, apply-leave widget, recent request list, and the data interactions required to satisfy the P1 stories while honoring the project constitution.

## Constitution alignment

- Identity & auth: Use the central identity provider for all auth flows and user context. The app never accepts local credentials or bypasses the enterprise SSO identity token.
- Time: Persist all timestamps in UTC and perform all comparisons in UTC, while rendering dates in the user's locale.
- PII: Do not log raw identifiers; use redacted or hashed references in any diagnostic event.
- Secrets: Read DB credentials and analytics/secrets exclusively from environment configuration, never from source.
- Observability: Emit structured events for each write operation with actor, action, and entity id.

## NFR responses

| NFR | Requirement | Plan response |
|-----|-------------|----------------|
| N5 performance | p95 ≤ 500 ms for the primary balance read with up to 10k leave records and 1,000 concurrent users | Query only the current user's balances and last 5 requests using indexed filters; avoid N+1 reads; use pagination or limit semantics for recent requests. Performance tests will seed 10k records and measure p95. |
| Security | Auth via single source of truth, no local accounts | Use request context from the identity provider and enforce user-specific SQL filters for all reads/writes. |
| PII handling | No plain-text PII in logs | Log actor and entity IDs only; redact emails/usernames in diagnostics. |
| Observability | Structured write events with actor/action/entity_id | Emit normalized events for create, update, cancel actions with `actor`, `action`, `entity_id` fields and payload metadata. |

## Design approach

### Read path

- Build a balance query for the current employee scoped to the current entitlement period.
- Query last 5 leave requests sorted by request date descending, returning explicit status labels such as Pending, Approved, Rejected, or Cancelled.
- Use a lightweight API route or server handler that returns only the necessary fields for the dashboard.
- Ensure response size is bounded by selecting only the required leave types and statuses.
- Render zero balances or an explicit "no entitlement" message when the employee has no remaining entitlement; do not display negative balances.

### Write path

- The apply form will submit `leaveType`, `fromDate`, and `toDate` for the authenticated user.
- Server-side validation will check `fromDate <= toDate` and calculate requested days in UTC.
- Verify available balance before creating a pending leave request; if insufficient, return a validation error.
- Emit a structured event on successful request creation with actor, action, and entity id.

### Data model slice

This plan uses only what P1 needs.

- `Employee` / user identity is assumed to exist via the auth provider.
- `LeaveType` with name and display label.
- `LeaveBalance` storing the user's remaining balance per leave type for the current period.
- `LeaveRequest` storing request dates, type, status, requested days, and actor reference.

### Failure modes and trade-offs

1. Slow balance evaluation under large history.
   - Trade-off: Precompute or cache current balances in a single per-user slice versus dynamic historical aggregation. Chosen: keep a narrow current balance table and update it on write to avoid scanning large history during reads.
2. Overlap detection ambiguity.
   - Trade-off: Strictly block overlapping requests versus warn and let policy decide. Chosen: warn on overlap and preserve the user's ability to submit, deferring strict policy enforcement to later specs.
3. Missing entitlement metadata or partial backend response.
   - Trade-off: Fail the dashboard versus render available data with a warning. Chosen: render available balances and show a soft warning for missing data to keep the dashboard responsive.

## Implementation notes

- Use server-rendered or edge-friendly handlers in Next.js for the primary balance read.
- Use Prisma client with prepared queries and custom select shapes to avoid fetching unused fields.
- Add an index on `LeaveRequest(employeeId, createdAt)` and `LeaveBalance(employeeId, leaveTypeId)` in Postgres.
- Validate date arithmetic in UTC and convert displayed dates to the user's locale on the client.
- Keep secret material (database URL, any tokens) in environment variables such as `DATABASE_URL` and `NEXTAUTH_SECRET`.

## Tuple-Fit note

This plan prioritizes the self-service employee persona by minimizing dashboard latency and reducing friction in leave submission, while the N5 performance focus drives current-balance-only reads and bounded recent-request queries.
