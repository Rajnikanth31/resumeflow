# Release Process Specification

This document defines the release pipelines, versioning conventions, and changelog guidelines for ResumeFlow.

---

## 1. Release Lifecycle Stages

```
[develop] ──> [Alpha (Dev Builds)] ──> [Beta (Staging)] ──> [RC (Release Candidate)] ──> [Production (main)]
```

### Alpha Releases
*   **Target**: Active integration branch (`develop`).
*   **Audience**: Internal developers and automated tests.
*   **Trigger**: Merges to `develop`.
*   **Version Tag**: `v[Major].[Minor].[Patch]-alpha.[Build]`

### Beta Releases
*   **Target**: Dedicated staging branch.
*   **Audience**: Internal QA team and early adopters.
*   **Trigger**: Sprint completion.
*   **Version Tag**: `v[Major].[Minor].[Patch]-beta.[Build]`

### Release Candidate (RC)
*   **Target**: Release branch (`release/...`).
*   **Audience**: Verification and regression testing.
*   **Trigger**: Milestone features frozen.
*   **Version Tag**: `v[Major].[Minor].[Patch]-rc.[Build]`

### Production Releases
*   **Target**: Production branch (`main`).
*   **Audience**: End users.
*   **Trigger**: Final QA approval.
*   **Version Tag**: `v[Major].[Minor].[Patch]`

---

## 2. Semantic Versioning (SemVer)

ResumeFlow uses standard Semantic Versioning: `vMAJOR.MINOR.PATCH`.

*   **MAJOR**: Incremented when introducing breaking API changes (e.g. database schema resets or routing updates).
*   **MINOR**: Incremented when introducing backward-compatible new features (e.g. Epic 3 Resume Builder editor launch).
*   **PATCH**: Incremented when introducing backward-compatible bug fixes or quality hardening updates (e.g. FOUC flashes and font performance fixes).

---

## 3. Release Git Tags

Every release must be tagged in git.

*   **Command to Create Tag**:
    ```bash
    git tag -a v1.1.0 -m "Release v1.1.0 - Dashboard and Font Optimization"
    ```
*   **Command to Push Tag**:
    ```bash
    git push origin v1.1.0
    ```

---

## 4. Release Notes Guidelines

Release notes must be compiled for every production build.

### Template

```markdown
# Release v1.1.0 (2026-07-05)

## 🚀 Features
- **Dashboard**: Added the user workspace landing grids, application tracker charts, and alert lists.
- **Project Management**: Automated issue templates, Kanban board columns, and workflow rules.

## 🐛 Bug Fixes
- **Performance**: Preloaded fonts via next/font/google, removing render blocking CSS import.
- **FOUC**: Resolved dark mode layout flashes using layout head evaluation script.
- **Accessibility**: Injected aria expand tags and focus outlines on all controls.

## 📦 Dependency Changes
- Added `zod` for startup environment variables schema validation.
```
