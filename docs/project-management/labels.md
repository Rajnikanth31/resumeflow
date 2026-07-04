# GitHub Labels Specification

This document defines the structured label taxonomy utilized in the ResumeFlow repository to categorize issues and pull requests.

---

## 1. Priority Labels

These labels dictate urgency and SLA response times.

| Label | Color | Description |
| :--- | :--- | :--- |
| `priority:critical` | `#DC2626` (Red) | Blocks release, production outage, or security breach. Resolve immediately. |
| `priority:high` | `#F97316` (Orange) | Core functionality blocked, or high-priority feature. |
| `priority:medium` | `#FBBF24` (Amber) | Standard feature or minor bug. Regular sprint priority. |
| `priority:low` | `#3B82F6` (Blue) | Enhancements, copy changes, or minor aesthetic tweaks. |

---

## 2. Type Labels

These labels categorize the nature of the issue.

| Label | Color | Description |
| :--- | :--- | :--- |
| `type:feature` | `#0E7490` (Teal) | New system capabilities or user-facing functionality. |
| `type:bug` | `#EF4444` (Light Red) | Software regressions, incorrect behavior, or compilation errors. |
| `type:enhancement` | `#8B5CF6` (Purple) | Iterative improvements to existing functionality. |
| `type:refactor` | `#EC4899` (Pink) | Structural code changes without functional adjustments. |
| `type:technical-debt` | `#6B7280` (Gray) | Code cleanups, deprecations, and library upgrades. |
| `type:security` | `#991B1B` (Dark Red) | Audits, dependency vulnerabilities, and authorization updates. |
| `type:performance` | `#10B981` (Emerald) | Optimization tasks for load speed, memory footprint, and CLS. |
| `type:testing` | `#06B6D4` (Cyan) | Spec coverage additions, mock utilities, and e2e testing. |
| `type:research` | `#14B8A6` (Mint) | Technical spikes, POCs, and design review briefs. |
| `type:documentation` | `#6B7280` (Gray) | Updates to setup guides, wiki pages, or project docs. |

---

## 3. Area Labels

These labels locate the module or layer of the codebase affected.

| Label | Color | Description |
| :--- | :--- | :--- |
| `area:frontend` | `#38BDF8` (Sky) | Next.js client layouts, React state, or CSS styles. |
| `area:backend` | `#6366F1` (Indigo) | Server routing, business logic, or parsing services. |
| `area:api` | `#818CF8` (Light Indigo) | REST API endpoints, DTO validations, or routing handlers. |
| `area:database` | `#F472B6` (Pink) | Prisma models, migrations, or seed configurations. |
| `area:authentication` | `#A78BFA` (Lavender) | Auth.js/NextAuth integrations, session middleware, or cookie rules. |
| `area:resume-builder` | `#34D399` (Mint) | Resume editor panels, dynamic forms, and PDF output preloads. |
| `area:ats` | `#A855F7` (Grape) | ATS Match Scanner algorithms, scoring frameworks, and parsing. |
| `area:career` | `#10B981` (Green) | Job tracker boards, interview triggers, and match scoring. |
| `area:portfolio` | `#F59E0B` (Amber) | Candidates website builder and template engines. |
| `area:dashboard` | `#38BDF8` (Sky) | Workspace landing panels, chart summaries, and metrics dashboards. |
| `area:billing` | `#10B981` (Green) | Stripe webhooks, pricing plans, and monetization gateways. |
| `area:notifications` | `#FBBF24` (Amber) | Alert widgets, action logs, and dashboard notification feeds. |
| `area:ai` | `#EC4899` (Pink) | LLM Studio integrations, parser heuristics, and recommendation loops. |
| `area:devops` | `#3B82F6` (Blue) | Docker configs, Compose files, CI/CD scripts, and deployment rules. |
| `area:ui` | `#6366F1` (Indigo) | Design token compliance, component styles, and dark mode controls. |
| `area:ux` | `#14B8A6` (Teal) | Interactivity flow improvements, keyboard focus, and layouts. |

---

## 4. Status Labels

These labels describe the current state of reviews and blockages.

| Label | Color | Description |
| :--- | :--- | :--- |
| `status:blocked` | `#B91C1C` (Dark Red) | Waiting on dependency, upstream PR, or design approval. |
| `status:needs-review` | `#FBBF24` (Amber) | PR or issue awaits architect or security approval. |
| `status:ready` | `#10B981` (Green) | Meets DoR, ready for developer to pull into progress. |
| `status:testing` | `#06B6D4` (Cyan) | Deployed on staging, undergoing QA verification. |
| `status:done` | `#6B7280` (Gray) | Tasks fully resolved, verified, and closed. |
