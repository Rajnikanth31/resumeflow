# Sprint Process Specification

This document defines the 2-week Agile sprint process, capacity boundaries, and execution ceremonies for the ResumeFlow project.

---

## 1. Sprint Schedule & Cadence

```
[Day 1: Planning] ──> [Days 2-9: Dev Cycles] ──> [Day 10: Review & Retro]
```

*   **Sprint Length**: 2 Weeks (10 business days).
*   **Sprint Goal**: Establish one cohesive, fully-tested feature increment.
*   **Milestones mapping**: Each sprint targets deliverables within a designated Epic.

---

## 2. Sprint Ceremonies

### Sprint Planning (Day 1 - Morning)
*   **Objective**: Define the Sprint Goal and select issues from the Backlog into the active Sprint Backlog.
*   **Process**:
    1.  Confirm team capacity (adjusted for holidays/leave).
    2.  Review issue estimates (Story Points mapping hours).
    3.  Select issues from **📋 Ready** that support the Sprint Goal.
    4.  Assign owners to issues.

### Daily Standups (Days 2-9 - Morning)
*   **Objective**: Align on daily progress and identify blockers.
*   **Process**:
    *   Timeboxed to 15 minutes.
    *   Each engineer reports: What was completed yesterday, what is planned for today, and any blocking items.

### Sprint Review (Day 10 - Afternoon)
*   **Objective**: Demo the working software increment to stakeholders.
*   **Process**:
    *   Showcase completed features running on the integration environment.
    *   Receive feedback to adjust future backlog priorities.

### Sprint Retrospective (Day 10 - Afternoon)
*   **Objective**: Continuous improvement of engineering processes.
*   **Process**:
    *   Analyze what went well, what could be improved, and action items for the next sprint.

---

## 3. Sprint Capacity Boundaries
*   **Calculation**:
    *   1 Developer Capacity = 8 hours/day * 10 days = 80 hours.
    *   *Focus Factor* (accounting for reviews, admin, standups) = 75% (60 usable hours/developer/sprint).
*   **Commitment**: Do not plan work exceeding 60 hours per developer per sprint.

---

## 4. Quality Gates: DoR & DoD

### Definition of Ready (DoR)
An issue is ready to enter a sprint only if:
*   [ ] The issue title follows Conventional Commits notation (`feat:`, `fix:`, `refactor:`, `perf:`).
*   [ ] The description contains clear business value and context.
*   [ ] Acceptance criteria are documented and testable.
*   [ ] Dependencies are resolved and external APIs are available.
*   [ ] The issue is assigned a difficulty index (Story Points / Estimated hours).

### Definition of Done (DoD)
An issue is marked completed and moved to **✅ Done** only if:
*   [ ] Code compiles successfully without warnings (`npm run build`).
*   [ ] Linter checks pass cleanly (`npm run lint`).
*   [ ] TypeScript types are strictly declared (no `any` types).
*   [ ] Unit tests pass, and coverage is verified.
*   [ ] Code undergoes peer review and approval on the Pull Request.
*   [ ] Contrast, font shifts, keyboard focus, and screen reader annotations satisfy accessibility rules.
*   [ ] Deployed and verified on the staging environment.
