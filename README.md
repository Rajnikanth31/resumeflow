# ResumeFlow: AI-Powered Career Intelligence Platform

ResumeFlow is an enterprise-grade, high-performance, open-source resume builder, ATS optimizer, and career platform built on Next.js. It features a real-time responsive form editor, live PDF rendering, local storage autosaving, and a fully integrated AI request pipeline supporting match-scoring, skill gap analysis, and job tailoring.

---

## Tech Stack

*   **Core Framework**: Next.js (App Router & Pages Router hybrid)
*   **Database & ORM**: PostgreSQL, Prisma ORM
*   **State Management**: Redux Toolkit (with custom debounced autosave middleware)
*   **Styling & UI Components**: Vanilla CSS & Tailwind CSS
*   **PDF Compiler**: `@react-pdf/renderer` & PDF.js
*   **AI Gateway Stack**: OpenAI compatible REST client with LM Studio, Gemini, Anthropic, Ollama, and Azure OpenAI providers
*   **Testing Suite**: Jest & React Testing Library
*   **Git Quality Gates**: Husky, lint-staged, commitlint

---

## Key Features

1.  **AI Request Pipeline**: A unified pipeline with authentication, authorization, rate limiting, provider selection, and response validation.
2.  **Job Matching & Match Scores**: Computes percentage compatibility scores comparing candidate resumes with job descriptions (skills, tech stack, experience, seniority).
3.  **Skill Gap & Heatmap Analysis**: Generates keyword heatmaps (matched, weak, missing), missing skill gap summaries, and suggested learning resources.
4.  **AI Resume Tailoring**: Contextually rewrites profile summaries, work history, and projects to align with job descriptions while preserving core facts.
5.  **Dual-Pane Editor Layout**: Side-by-side editing pane and pixel-perfect PDF rendering pane.
6.  **Autosave & Local Storage**: Debounced middleware automatically saves state changes to localStorage to prevent layout lag.
7.  **Dynamic Style Templates**: Classic Minimal (serif), Modern Executive (accented sans-serif), and Professional Tech (monospace) layouts.

---

## Screenshots Placeholders

```
+------------------------------------------+
|  [ Sidebar: AI Suggestions ]             |
|  - Matched Skills (React, TypeScript)    |
|  - Missing Skills (Next.js, PostgreSQL)  |
|  - ATS Match Score: 85%                  |
+------------------------------------------+
|  [ Main Pane: Dual Editor Layout ]       |
|  - Resume Form Editor                    |
|  - Real-time PDF compiler view           |
+------------------------------------------+
```

---

## Architectural Layout

```
                  +-------------------------+
                  |    Next.js Frontend     |
                  +------------+------------+
                               |
                               v
                  +-------------------------+
                  |   AI Gateway Pipeline   |
                  +------------+------------+
                               |
            +------------------+------------------+
            |                  |                  |
            v                  v                  v
     +------------+     +------------+     +------------+
     | LM Studio  |     |   OpenAI   |     |   Gemini   |
     +------------+     +------------+     +------------+
```

---

## Installation & Running Locally

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Database Migration**:
    ```bash
    npx prisma db push
    ```

3.  **Run development server**:
    ```bash
    npm run dev
    ```

4.  **Run test suite**:
    ```bash
    npm run test:ci
    ```

5.  **Compile production bundle**:
    ```bash
    npm run build
    ```

---

## Roadmap

*   [x] Epic 1-5: Resume Core Engine & Autosave persistence
*   [x] Epic 6: AI Provider Factory & Switchboard Middleware
*   [x] Epic 7: AI Resume Intelligence & Categories Optimization
*   [x] Epic 8: Job Intelligence Platform, Match Scores & Tailoring
*   [ ] Epic 9: ATS Evaluator, Parsing Analytics & Job Tracker

---

## Contributing

We welcome open-source contributions! Please review our [CONTRIBUTING.md](CONTRIBUTING.md) and [STYLE_GUIDE.md](STYLE_GUIDE.md) for details on code style, lint gates, and PR approvals.

---

## License

MIT License. See [LICENSE](LICENSE) for details.
