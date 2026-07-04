# ResumeFlow - AI Career Operating System

ResumeFlow is a modern, enterprise-grade open source resume builder, parser, and ATS analyzer.

[![Continuous Integration](https://github.com/resumeflow-org/resumeflow/actions/workflows/ci.yml/badge.svg)](https://github.com/resumeflow-org/resumeflow/actions/workflows/ci.yml)
[![CodeQL Security Scan](https://github.com/resumeflow-org/resumeflow/actions/workflows/codeql.yml/badge.svg)](https://github.com/resumeflow-org/resumeflow/actions/workflows/codeql.yml)
[![Dependabot](https://img.shields.io/badge/dependabot-enabled-blue.svg)](https://github.com/resumeflow-org/resumeflow/blob/main/.github/dependabot.yml)
[![Docker](https://img.shields.io/badge/docker-compose-blue.svg)](file:///e:/code/ResumeFlow/open-resume/docker-compose.yml)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## 🗺️ Project Milestones Dashboard

| Milestone    | Goal                                | Status         |
| :----------- | :---------------------------------- | :------------- |
| **Epic 1**   | Foundation Framework                | ✅ `COMPLETED` |
| **Epic 2**   | Unified Dashboard Workspace         | ✅ `COMPLETED` |
| **Epic 2.5** | Foundation Hardening & Quality Gate | ✅ `COMPLETED` |
| **Epic 3**   | AI Resume Builder & Editor          | 🚀 `UP NEXT`   |
| **Epic 4**   | Access Control & Authentication     | 📋 `PLANNED`   |
| **Epic 5**   | Prisma Database Persistence         | 📋 `PLANNED`   |
| **Epic 6**   | AI LLM Connection Gateway           | 📋 `PLANNED`   |
| **Epic 7**   | ATS Match Evaluation Engine         | 📋 `PLANNED`   |
| **Epic 8**   | Job Description Analyzer            | 📋 `PLANNED`   |
| **Epic 9**   | Candidate Job Application Tracker   | 📋 `PLANNED`   |
| **Epic 10**  | Static Portfolio Generator          | 📋 `PLANNED`   |
| **Epic 11**  | Recruiter Access Portal             | 📋 `PLANNED`   |
| **Epic 12**  | Monetization & Stripe Billing       | 📋 `PLANNED`   |
| **Epic 13**  | Template Marketplace Hub            | 📋 `PLANNED`   |
| **Epic 14**  | Browser Scraper Extension           | 📋 `PLANNED`   |
| **Epic 15**  | VS Code Sidebar Plugin              | 📋 `PLANNED`   |
| **Epic 16**  | Telemetry & Production Launch       | 📋 `PLANNED`   |

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 13](https://nextjs.org/) (App Router, Route Groups, Tailwind CSS)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict compilation configurations)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) (Slice actions)
- **Validation**: [Zod](https://zod.dev/) (Fail-fast environment parsing schemas)
- **Test Suite**: [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/)

---

## 💻 Local Development

### 1. npm Setup

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Duplicate the example environment file:
    ```bash
    cp .env.example .env.local
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view.

### 2. Docker Compose

Start the Next.js app containerized alongside PostgreSQL and Redis cache instances:

```bash
docker-compose up --build
```

Verify instructions in [DOCKER.md](file:///e:/code/ResumeFlow/open-resume/DOCKER.md).

---

## 📚 Project Specifications & Guides

- **Kanban Workflow**: [kanban.md](file:///e:/code/ResumeFlow/open-resume/docs/project-management/kanban.md)
- **Git & Branch Strategy**: [repository-workflow.md](file:///e:/code/ResumeFlow/open-resume/docs/project-management/repository-workflow.md)
- **Sprint Cycles**: [sprints.md](file:///e:/code/ResumeFlow/open-resume/docs/project-management/sprints.md)
- **Docker Instructions**: [DOCKER.md](file:///e:/code/ResumeFlow/open-resume/DOCKER.md)
- **Contributing Guidelines**: [CONTRIBUTING.md](file:///e:/code/ResumeFlow/open-resume/CONTRIBUTING.md)
- **Security Disclosures**: [SECURITY.md](file:///e:/code/ResumeFlow/open-resume/SECURITY.md)
