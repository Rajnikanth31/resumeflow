# Repository Health Checklist

This document details the checks, rules, and automations required to maintain the ResumeFlow repository at enterprise-grade quality standards.

---

## 1. Branch Protection Rules

Confirm that branch protection is configured on GitHub for the `main` and `develop` branches:

- [ ] **Require Pull Request Reviews**:
  - Minimum of 1 approving review from a code owner required before merging.
  - Dismiss stale pull request approvals when new commits are pushed.
- [ ] **Require Status Checks**:
  - `Continuous Integration` (CI) workflow must pass.
  - `Pull Request Validation` workflow must pass.
  - `Docker Build Validation` workflow must pass.
- [ ] **Block Direct Commits**:
  - Enforce restrictions on administrators to prevent bypass.
- [ ] **Require Linear History**:
  - Enforce squash-and-merge commit policies.

---

## 2. Automated Git Hooks (Husky & lint-staged)

Ensure local hooks prevent malformed pushes:

- [ ] **Pre-commit Linter**:
  - Running `npx lint-staged` automatically formats and fixes lint warnings on staged files before commit.
- [ ] **Commit Message Validation**:
  - Commitlint validates that commit headers adhere to Conventional Commits style.

---

## 3. Vulnerability Scanning & Updates

Ensure automated security monitoring:

- [ ] **CodeQL Static Analysis**:
  - Triggered on weekly schedules and pushes to main/develop to identify code weaknesses.
- [ ] **Dependabot Grouped Upgrades**:
  - Automated scans run weekly on Mondays for npm packages and GitHub Actions.
  - Related packages are grouped to minimize PR noise.
- [ ] **Weekly Dependency Audits**:
  - Automated `npm audit` runs weekly to identify high-severity library disclosures.

---

## 4. Documentation Compliance

Verify repository documentation is accessible and up to date:

- [ ] **Setup & Guides**: `README.md`, `DOCKER.md`, and `CONTRIBUTING.md` match current folder structures.
- [ ] **Support & Conduct**: `SUPPORT.md` and `CODE_OF_CONDUCT.md` are linked in repository profiles.
- [ ] **Security Protocols**: `SECURITY.md` defines supported versions and vulnerability contact channels.
