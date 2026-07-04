# Code Style Guide

This guide defines the engineering standards, naming conventions, and coding guidelines for the ResumeFlow codebase.

## 1. Git & Commits

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat`: A new feature (e.g. `feat(builder): add Print PDF trigger`)
- `fix`: A bug fix (e.g. `fix(parser): resolve phone format extraction`)
- `docs`: Documentation improvements (e.g. `docs: update setup guide`)
- `style`: Formatting updates, missing semicolons, etc.
- `refactor`: Code restructuring without functional changes
- `test`: Adding or correcting tests

## 2. TypeScript & Code Conventions

- **Safety**: Explicitly type all variables and parameters; avoid the use of `any` where possible.
- **Functions**: Prefer ES6 arrow functions (`const MyComponent = () => {}`) for React functional components.
- **Slices**: Keep actions, selectors, and reducers consolidated in their respective slice files (e.g. `settingsSlice.ts`).

## 3. CSS & Tailwind

- **Layouts**: Rely on Tailwind grid and flex utilities instead of hardcoding pixel coordinates.
- **Tailwind Order**: Keep class listings organized (Layout first, Spacing second, Borders third, Typography last).
- **Transitions**: Include `transition-all duration-200` on hover controls to keep micro-animations smooth.
