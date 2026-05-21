# SDD MySpace Rushil

This repository contains the Session 1 SpecKit artifacts and initial implementation work for the Leave widget feature in the MySpace portal project.

## What is included

- `memory/constitution.md` — architectural rules for the project
- `specs/001-leave/spec.md` — leave widget feature spec
- `specs/001-leave/plan.md` — implementation plan for Next.js + Prisma + Postgres
- `specs/001-leave/tasks.md` — task breakdown for the feature
- `prisma/schema.prisma` — initial leave data slice model
- `tests/schema.test.js` — schema validation test harness
- `review_report.md` — top findings from task 1.1 implementation review

## Project structure

- `.git/` — repository metadata
- `memory/` — project constitution and memory artifacts
- `specs/` — feature spec, plan, and task artifacts
- `prisma/` — Prisma schema
- `tests/` — test files

## How to run tests

```bash
npm test
```

## Notes

- Task `1.1` has been implemented and validated with a passing test.
- All Session 1 artifacts are committed and the repository was briefly pushed to GitHub before the remote `master` branch was deleted.
- The repo is ready for the next phase of implementation.
