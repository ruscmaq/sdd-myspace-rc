---
title: Leave balance + apply-leave widget
description: Spec for the MySpace portal leave-balance widget and apply-leave form (stack-agnostic).
ms.date: 2026-05-21
---

## Context

Module: M02 Leave Management. Persona: P1 Employee (self-service). The widget surfaces an employee's current leave balance by type and allows applying for leave with a minimal form. The primary read (balance view) must meet the performance NFR so it feels instantaneous for the employee.

## User stories (prioritized)

- P1: As an Employee, I want to see my current leave balance per leave type on my dashboard so I can decide whether I have enough entitlement before requesting time off.
- P1: As an Employee, I want to apply for leave using a 3-field form (type, from-date, to-date) so I can submit requests quickly from the dashboard.
- P2: As an Employee, I want to see the status of my last 5 leave requests so I can track progress without navigating to another page.
- P3: As an Admin, I want to be able to view aggregate leave usage reports (out of scope for P1 delivery).

## Functional requirements (atomic, testable)

1. The dashboard exposes a read-only balance view showing each leave type and a numeric remaining balance for the current entitlement period.
2. The widget exposes a 3-field apply form: leave type, from-date, to-date; submitting creates a pending leave request for the current user.
3. The widget lists the user's last 5 leave requests in reverse-chronological order with status labels (Pending/Approved/Rejected/Cancelled).
4. The apply flow validates that `from-date <= to-date` and that the requested days do not produce negative balance; on validation failure the user sees an inline error message.
5. All user-visible timestamps are presented in the user's locale but stored and compared in UTC (see constitution rule on Time).

## Non-functional requirements

- NFR N5 (Performance): Primary read — the dashboard balance view must have p95 ≤ 500 ms under a realistic dataset of up to 10,000 leave records (per-tenant) and 1,000 concurrent active users. Include a perf test that seeds 10k leave records and measures p95.
- Security: Auth must use the project's single source of truth (no local accounts). User actions must be authenticated and authorized before reads/writes.
- PII handling: No PII is logged in plain text; logs must use redacted identifiers per constitution.
- Observability: Every write operation (create/update/cancel) must emit a structured event containing actor, action, and entity id.

## Acceptance criteria (Given–When–Then)

P1 story: View leave balance (happy path)
- Given I am an authenticated Employee with existing leave entitlements,
- When I open my dashboard,
- Then I see each leave type and a numeric remaining balance, and the balance view loads within p95 ≤ 500 ms (10k-record dataset assumption).

P1 story: View leave balance (edge case 1 — no entitlements)
- Given I am an authenticated Employee with zero entitlements,
- When I open my dashboard,
- Then each leave type shows zero or an explicit "no entitlement" message and no negative balances are shown.

P1 story: View leave balance (edge case 2 — partial data)
- Given some backend data is delayed/unavailable,
- When I open my dashboard,
- Then the UI shows available balances for returned types and an unobtrusive warning for missing types; the page remains responsive.

P1 story: Apply for leave (happy path)
- Given I am an authenticated Employee with sufficient balance,
- When I submit the 3-field form with valid dates,
- Then a pending leave request is created and appears in my recent requests list with status Pending.

P1 story: Apply for leave (edge case 1 — date validation)
- Given I open the apply form,
- When I enter a `from-date` after `to-date` and submit,
- Then the form shows an inline validation error and the request is not created.

P1 story: Apply for leave (edge case 2 — insufficient balance)
- Given my remaining balance is less than the requested days,
- When I submit the form,
- Then the form shows a clear error explaining the shortage and suggests contacting HR; no request is created.

## Open questions

- Should partial-day requests (hours) be supported in this spec or deferred to a follow-up?
  - Answer: Defer to a follow-up spec.
  - Rationale: Supporting hours introduces a separate calculation and UI complexity beyond the current full-day leave flow.
- What timezone should the UI present by default when users travel across regions?
  - Answer: Present timestamps in the user's current locale while storing and comparing all timestamps in UTC.
  - Rationale: This keeps the implementation aligned to the Time constitution rule while preserving local readability.
- How should overlapping requests be surfaced (auto-block vs warning)?
  - Answer: Surface an overlap warning during submission and allow confirmation only if the overlap is permitted by later policy.
  - Rationale: A warning is safer for initial rollout and avoids blocking users when the business overlap policy is not fully defined.

## Out of scope

- Payroll integrations, entitlement accrual engine, admin bulk actions, and reporting beyond the user's last-5 requests.
- UI theming and cross-browser polish are out of scope for this delivery.
- TODO: consider partial-day leave requests in the next spec.
- TODO: consider a configurable overlap policy in the next spec.
