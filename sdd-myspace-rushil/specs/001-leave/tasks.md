---
title: Leave widget task list
description: Task breakdown for the leave widget feature, grouped into phases with coverage mapping.
ms.date: 2026-05-21
ms.topic: task-list
keywords:
  - leave widget
  - tasks
  - spec
  - plan
---

## Overview

This document breaks the leave widget feature into phased implementation tasks. Each task is atomic, testable, and scoped for a single commit.

## Phase 1 — Design and schema baseline

Entry condition: `specs/001-leave/spec.md` and `specs/001-leave/plan.md` are finalized and committed.

1.1 [x] Define the leave balance and request data slice in Prisma schema. [P]

1.2 Add database migrations for leave balance and leave request models. [P]

1.3 Write schema validation rules for leave request input (leave type, start date, end date). [T]

Exit condition: database schema supports leave balances and requests for the feature.

## Phase 2 — Backend read and write surface

Entry condition: Phase 1 schema is applied and database migrations are available.

2.1 Implement authenticated server-side query for the employee's leave balances and last 5 leave requests. [T]

2.2 Implement leave request creation logic with entitlement and date-range validation. [T]

2.3 Add structured observability for leave request writes, including actor, action, and request id. [P]

2.4 Implement UTC timestamp handling and ensure stored dates are normalized to UTC. [P]

Exit condition: backend supports authenticated leave reads and validated leave request creation.

## Phase 3 — UI widget and validation

Entry condition: backend APIs for leave balance reading and leave request submission are working.

3.1 Build the leave balance dashboard widget showing current entitlement and used balance per leave type. [T]

3.2 Build the leave request form with leave type, from-date, and to-date fields. [T]

3.3 Display last 5 leave requests with their current status labels, request date, and date range. [P]

3.4 Add client-side validation for date range, future-date enforcement, and required fields. [T]

Exit condition: frontend widget displays balances, request history, and a validated apply-leave form.

## Phase 4 — Edge cases, perf, and QA

Entry condition: feature UI and API endpoints are implemented and connected.

4.1 Add zero-entitlement handling and messaging for leave types with no remaining days. [T]

4.2 Add error handling for invalid request ranges, entitlement exhaustion, and API failures. [T]

4.3 Add indexing and query optimization to ensure authenticated read performance at scale. [P]

4.4 Execute a performance test for p95 read latency using a realistic dataset assumption of 10k leave records. [T]

Exit condition: edge cases are covered, errors are handled, and performance is validated.

## Coverage Map

| Functional Requirement | Task IDs |
|------------------------|----------|
| FR1: Show current leave balance per leave type | 2.1, 3.1 |
| FR2: Apply for leave with type, from-date, to-date | 2.2, 3.2 |
| FR3: Show status of last 5 leave requests | 2.1, 3.3 |
| FR4: Validate request input and edge cases | 1.3, 3.4, 4.2 |
| FR5: Show zero-entitlement messaging when balance is exhausted | 4.1 |
| FR6: Ensure authenticated user access and observability for writes | 2.1, 2.3 |
| FR7: Use UTC timestamps consistently | 2.4 |
| NFR: p95 ≤ 500 ms on primary read with 10k leave records | 4.3, 4.4 |
