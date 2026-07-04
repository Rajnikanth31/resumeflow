# Project Milestones (The 16 Epics)

This document outlines the goals, deliverables, dependencies, and Definition of Done (DoD) for each of the 16 ResumeFlow Epic Milestones.

---

## Epic 1: Foundation
*   **Goal**: Establish a performant, fully branded, dark-mode compliant workspace frame.
*   **Deliverables**:
    *   Rebranded CSS styles and Tailwind configurations.
    *   Hydration-safe `ThemeProvider` and theme toggle switch.
    *   Collapsible sidebar layout shell (`AppShell`).
*   **Dependencies**: None.
*   **Definition of Done**: Runs locally on port 3000. Compiles without warnings. Zero hydration errors.

## Epic 2: Dashboard
*   **Goal**: Develop the user's primary entry workspace detailing resume diagnostics and application states.
*   **Deliverables**:
    *   Resumes workspace grid with metadata indicators.
    *   Application tracker pipeline status cards.
    *   Custom SVG-based ATS score scan charts and diagnostic metrics.
    *   Activity logs and alert notification lists.
*   **Dependencies**: Epic 1.
*   **Definition of Done**: Dashboard routes load under `/dashboard`. CSS styles render perfectly in light/dark modes.

## Epic 2.5: Foundation Hardening & Quality Improvements
*   **Goal**: Eliminate all Critical and High issues discovered during the initial Engineering Quality Gate Review.
*   **Deliverables**:
    *   Replace CSS `@import` web fonts with `next/font/google` preloads.
    *   Integrate pre-paint theme evaluator script inside `<head>` to fix FOUC flashes.
    *   Satisfy WCAG accessibility rules (aria tags, visible outlines).
    *   Provide Jest test suites covering layout components.
    *   Integrate startup env validations using Zod.
    *   Refactor absolute imports and group route layouts.
    *   Orchestrate local container networks using Docker Compose.
*   **Dependencies**: Epic 1, Epic 2.
*   **Definition of Done**: Quality Gate score >= 8.8/10. Zero Critical/High issues. Jest tests pass cleanly.

## Epic 3: Resume Builder
*   **Goal**: Build the core interactive resume creation workspace.
*   **Deliverables**:
    *   Dual-pane editor: sidebar fields input form on the left, PDF preview panel on the right.
    *   Dynamic sections handling (Header, Work Experience, Education, Skills, Projects).
    *   Template styling switcher (Classic, Professional, Modern).
    *   Local storage auto-save engine and PDF render compiler.
*   **Dependencies**: Epic 2.5.
*   **Definition of Done**: Real-time side-by-side editing. Live PDF rendering.

## Epic 4: Authentication
*   **Goal**: Implement secure access control and session management.
*   **Deliverables**:
    *   Auth.js / NextAuth integration.
    *   Credentials database login and sign-up flows.
    *   OAuth provider bridges (GitHub, Google).
    *   Session tokens validation and route access middleware.
*   **Dependencies**: Epic 2.5.
*   **Definition of Done**: Middleware blocks unauthorized access to `/dashboard` or `/resume-builder`.

## Epic 5: Database
*   **Goal**: Transition workspace storage from local-only memory to a persistent database.
*   **Deliverables**:
    *   Prisma schema definitions for Users, Resumes, and Application Tracker models.
    *   PostgreSQL integration with tables, unique constraints, and schema indexes.
    *   Data migration hooks and repository transaction service controllers.
*   **Dependencies**: Epic 4.
*   **Definition of Done**: User resumes persist in Postgres; databases sync cleanly without leaks.

## Epic 6: AI Gateway
*   **Goal**: Integrate AI endpoints to drive parsing and optimization suggestions.
*   **Deliverables**:
    *   LM Studio connection manager client.
    *   Prompt template registries and model selector hooks.
    *   JSON schema validators for raw LLM outputs.
*   **Dependencies**: Epic 2.5.
*   **Definition of Done**: System formats LLM JSON outputs and tolerates connection retry limits.

## Epic 7: ATS Engine
*   **Goal**: Build the diagnostic scanner providing candidate resumes evaluation.
*   **Deliverables**:
    *   Semantic keywords parser comparing resume content to target profiles.
    *   Typography, format, and structure scanning engine.
    *   Weighted scoring metrics calculator.
*   **Dependencies**: Epic 6.
*   **Definition of Done**: System processes scans and generates diagnostic score breakdowns.

## Epic 8: Job Description Analyzer
*   **Goal**: Ingest external job postings to match candidate resume bullets.
*   **Deliverables**:
    *   Job description (JD) text parsing widgets.
    *   Core skill and requirement keyword extractors.
    *   Comparison checklists mapping matching gaps.
*   **Dependencies**: Epic 7.
*   **Definition of Done**: Core keywords extract cleanly from target postings.

## Epic 9: Application Tracker
*   **Goal**: Orchestrate candidate job pipeline logs.
*   **Deliverables**:
    *   Interactive Kanban board mapping pipeline stages (Applied, Interviewing, Offer, Rejected).
    *   Company research profiles, contacts, and logs directories.
    *   Upcoming interview schedule reminders.
*   **Dependencies**: Epic 5.
*   **Definition of Done**: Pipeline stages update dynamically via drag-and-drop.

## Epic 10: Portfolio Generator
*   **Goal**: Enable candidates to host resumes as professional portfolio websites.
*   **Deliverables**:
    *   Static site generator exporting resumes as HTML/CSS/JS.
    *   Hosting deployment bridges and domain setup rules.
    *   Interactive portfolio templates.
*   **Dependencies**: Epic 5.
*   **Definition of Done**: Portfolios render correctly on staging domains.

## Epic 11: Recruiter Portal
*   **Goal**: Allow employers to view candidate portals and resumes.
*   **Deliverables**:
    *   Shared resume URLs and analytics tracking dashboards.
    *   Recruiter candidate search filters.
    *   PDF download packages builders.
*   **Dependencies**: Epic 10.
*   **Definition of Done**: Shared URL views are tracked and reported in metrics charts.

## Epic 12: Billing
*   **Goal**: Integrate monetization models.
*   **Deliverables**:
    *   Stripe Checkout and Customer Portal integration.
    *   Tier gates limiting non-paying users (e.g., max 2 resumes).
    *   Stripe Webhook controllers handling subscription states.
*   **Dependencies**: Epic 5.
*   **Definition of Done**: Non-paying accounts are gated correctly. Subscriptions process test webhooks.

## Epic 13: Template Marketplace
*   **Goal**: Support third-party resume themes.
*   **Deliverables**:
    *   Custom theme builder specification guides.
    *   Theme template registry, rating, and previews.
*   **Dependencies**: Epic 5.
*   **Definition of Done**: Custom templates install and render dynamically in the editor.

## Epic 14: Browser Extension
*   **Goal**: Scraping tool for easy job description analyzer ingestion.
*   **Deliverables**:
    *   Chrome Extension scaffolding capturing JD content (LinkedIn, Indeed).
    *   ResumeFlow API connector syncing scanned JDs to user trackers.
*   **Dependencies**: Epic 8.
*   **Definition of Done**: Scrapes active tabs and creates tracker records.

## Epic 15: VS Code Extension
*   **Goal**: Allow developers to sync resumes directly inside IDE sidebars.
*   **Deliverables**:
    *   VS Code Sidebar extension panels.
    *   Live resume bullet tracking and AI improvement recommendations inline.
*   **Dependencies**: Epic 7.
*   **Definition of Done**: Renders current match scores inside IDE workspace sidebars.

## Epic 16: Production Launch
*   **Goal**: Release the hardened platform to production.
*   **Deliverables**:
    *   Docker orchestration configurations.
    *   Telemetry monitoring, trace logs, and analytics metrics dashboards.
    *   Production deployment pipelines verification.
*   **Dependencies**: Epics 1-15.
*   **Definition of Done**: 100% production uptime, telemetry reporting, Zero Critical errors.
