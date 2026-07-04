# Contributing to ResumeFlow

Thank you for your interest in contributing to ResumeFlow! This guide outlines our project setup, coding standards, commit structures, and quality gates.

---

## 1. Project Setup

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/resumeflow-org/resumeflow.git
    cd resumeflow
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Local Environment Config**:
    Copy the example configuration to declare variables:
    ```bash
    cp .env.example .env.local
    ```
4.  **Launch the Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to verify.

---

## 2. Branch & Commit Guidelines

### Branch Naming Conventions

- `feature/...`: New user-facing functionalities (e.g. `feature/builder-layout-scaffold`).
- `bugfix/...`: Standard bug remediation (e.g. `bugfix/sidebar-outline-ring`).
- `hotfix/...`: Production emergency patches.
- `refactor/...`: Structural improvements (e.g. `refactor/appshell-sidebar`).

### Commit Message Structure

We enforce **Conventional Commits**:

- `feat`: A new feature (e.g. `feat(builder): add input forms`).
- `fix`: A bug fix (e.g. `fix(theme): resolve hydration flash`).
- `refactor`: Structural refactoring.
- `perf`: Optimizations (e.g. preloads).
- `test`: Test additions.

---

## 3. Coding & Testing Standards

- **TypeScript**: Enforce strict types. Do not use the `any` keyword.
- **A11y**: Ensure all decorative SVGs have `aria-hidden="true"`, and buttons specify focus outlines.
- **Testing**: Write Jest unit tests under `__tests__` subdirectories for new modules. Run verification using:
  ```bash
  npm run test:ci
  ```

---

## 4. Pull Request Review & Definition of Done (DoD)

Before opening a PR, confirm:

- [ ] The codebase compiles without errors (`npm run build`).
- [ ] Linter runs cleanly (`npm run lint`).
- [ ] All Jest tests pass successfully.
- [ ] The PR description references the associated issue number.
- [ ] Accessibility checks pass.
- [ ] Staging environments reflect changes cleanly.
