# Repository Workflow & Git Standards

This document defines Git branching, commit conventions, code reviews, and rollback policies for ResumeFlow.

---

## 1. Branch Strategy (GitFlow)

We use GitFlow to manage code integration and deployment pipelines.

```
[main] <─────────────── [hotfix/*]
  ▲                        │
  │ (Release Merge)        ▼
  │                     [develop] <──────── [feature/*]
[release/*] <──────────────┘                [bugfix/*]
                                            [refactor/*]
```

### Protected Branches
*   `main`: The production codebase. Direct commits are blocked. Code must merge from `release/*` or `hotfix/*` branches.
*   `develop`: The integration branch. Features merge here.

### Developer Branches
*   `feature/...`: For new feature implementation (e.g. `feature/builder-layout-scaffold`).
*   `bugfix/...`: For standard bug fixes (e.g. `bugfix/sidebar-outline-ring`).
*   `hotfix/...`: For emergency patches to the production codebase.
*   `refactor/...`: For structural improvements (e.g. `refactor/appshell-sidebar`).

---

## 2. Commit Convention (Conventional Commits)

Commit messages must follow the Conventional Commits specification:
`<type>(<scope>): <description>`

### Allowed Types
*   `feat`: A new feature (e.g., `feat(builder): add Personal Header input fields`).
*   `fix`: A bug fix (e.g., `fix(theme): resolve dark theme hydration flash`).
*   `refactor`: Code restructuring without functional updates (e.g., `refactor(shell): extract sidebar component`).
*   `perf`: Performance improvements (e.g., `perf(fonts): load fonts via next/font`).
*   `test`: Adding tests or fixing existing tests (e.g., `test(sidebar): add unit tests for collapsed state`).
*   `style`: Formatting updates, missing semi-colons (no code changes).
*   `chore`: Updating build tasks, package configurations (no code changes).

---

## 3. Merge & Pull Request Policy
*   **Merge Strategy**: **Squash and Merge** is enforced for all feature merges to keep history clean.
*   **Approval Gate**:
    *   Every Pull Request requires at least one approving review from a Senior/Lead engineer.
    *   PRs must pass all linter checks, TypeScript compilation, and Jest tests.

---

## 4. Rollback & Hotfix Policies

### Rollback Process
If a release causes critical failures on production:
1.  Identify the stable tag (e.g. `v1.0.1`).
2.  Deploy the stable tag to production immediately.
3.  Revert the breaking commits on `develop` to resolve issues before the next release cycle.

### Hotfix Process
For urgent patches to production:
1.  Branch out of `main` into `hotfix/[description]`.
2.  Implement and verify the fix.
3.  Merge the hotfix branch back into `main` and `develop` concurrently, incrementing the patch version.
