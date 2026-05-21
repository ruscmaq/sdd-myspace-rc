---
title: Leave widget review report
description: Top findings from the task 1.1 implementation review for the leave widget feature.
ms.date: 2026-05-21
ms.topic: review
keywords:
  - review
  - leave widget
  - prisma
  - schema
---

# Review Report

## Summary
This review covers the staged and committed changes for task 1.1: defining the leave data slice in Prisma schema, adding a schema validation test, and updating the task list.

## Top Findings

1. **Status field should be an enum**
   - Severity: medium
   - Recommended action: replace `LeaveRequest.status String` with a Prisma `enum` for `Pending`, `Approved`, `Rejected`, and `Cancelled`.
   - Rationale: the plan explicitly expects fixed status labels and an enum prevents invalid or inconsistent values.

2. **`requestedDays` type may be too broad**
   - Severity: low
   - Recommended action: if the current spec remains full-day only, change `requestedDays Float` to `Int`; otherwise keep `Float` and document the future partial-day intent.
   - Rationale: full-day leave requests are better represented as an integer count unless partial-day support is explicitly planned.

3. **Test coverage is syntactic, not semantic**
   - Severity: low
   - Recommended action: upgrade `tests/schema.test.js` later to a real Prisma schema validation or compilation check instead of string matching.
   - Rationale: string-based assertions confirm text presence but do not guarantee a valid or complete Prisma schema.

4. **Schema baseline is aligned but minimal**
   - Severity: low
   - Recommended action: continue with task 2.x to implement auth, read/write behavior, and observability in the next phase.
   - Rationale: task 1.1 is schema-focused; no divergence was found, but the current source tree does not yet fulfill higher-level plan behavior.

5. **No package dependency manifest for Prisma yet**
   - Severity: low
   - Recommended action: add `prisma`/`@prisma/client` to `package.json` when implementation advances beyond schema structure into runtime validation or migrations.
   - Rationale: the current test harness works, but future schema compilation and migrations will require Prisma packages to be installed.

## Conclusion
The current implementation is acceptable for task 1.1, with one medium-priority schema improvement recommended and several low-priority enhancements for future phases.
