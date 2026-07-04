# AI Guidelines & Prompt Patterns

This document details guidelines and prompt patterns for AI coding assistants working on the ResumeFlow codebase.

## 1. Quality Gates & Linting

- **Compile Checks**: Always run `npm run build` after editing component inputs or types to ensure Next.js packages compile cleanly.
- **Jest Verification**: Run the Jest test suite (`npm run test:ci`) to verify changes do not cause functional regressions.
- **Pre-commit Hook**: Keep commit summaries clean and brief; Husky validation hooks will fail if conventional commit rules are violated.

## 2. Coding Patterns

- **Preserve Comments**: Always retain existing inline descriptions, docstrings, and license headers.
- **A11y (Accessibility)**: Ensure every form input or interactive button has tab focuses, keydown triggers, and appropriate `aria-*` tags.
- **No Placeholders**: When adding test scenarios, write high-fidelity strings rather than mock placeholder texts.
