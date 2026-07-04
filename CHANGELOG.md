# Changelog

All notable changes to this project will be documented in this file. See [Conventional Commits](https://www.conventionalcommits.org/) for commit guidelines.

## [1.1.0] - 2026-07-04

### Added

- **Editor UI**: Dual-pane builder layout (`h-[calc(100vh-8rem)]`) and collapsible input panels.
- **Autosave**: Redux debounced autosave middleware writing drafts dynamically to local storage.
- **Style templates**: Classic Minimal (serif), Modern Executive (vertical left accents), and Professional Tech (monospace Courier) layouts.
- **Accessibility**: Added ARIA radio button controls, keydown event focus, and `aria-live` validation alerts.
- **Printing**: Dynamic direct PDF printing using off-screen iframe loaders.
- **Quality Controls**: Integrated ESLint, Prettier, Husky, lint-staged, and commitlint hooks.

## [1.0.0] - 2026-06-15

### Added

- **Core Parser**: First release of PDF resume parser and extractor.
- **Dashboard**: Basic profile editor, import panels, and simple PDF viewer.
- **Redux Store**: Initial implementation of resume state actions and reducers.
