# Epic 3 Issues: Resume Builder & Editor Optimization

This document catalogs the 18 granular, one-day development issues required to implement **Epic 3: Resume Builder & Editor Optimization**.

---

## 1. Issue Index

| Issue ID | Title | Priority | Est. Time |
| :--- | :--- | :--- | :--- |
| **Issue 3.1** | Scaffold Editor Route & Dual-Pane Layout | `priority:high` | 6 hours |
| **Issue 3.2** | Form Editor Sections Skeleton UI | `priority:high` | 6 hours |
| **Issue 3.3** | Redux Store Models for Resume State | `priority:high` | 8 hours |
| **Issue 3.4** | Local Storage Auto-Save Middleware | `priority:medium` | 5 hours |
| **Issue 3.5** | Section Editor: Personal Header Details | `priority:high` | 6 hours |
| **Issue 3.6** | Section Editor: Work Experience List Panel | `priority:high` | 8 hours |
| **Issue 3.7** | Section Editor: Education List Panel | `priority:high` | 8 hours |
| **Issue 3.8** | Section Editor: Skills List Panel | `priority:high` | 8 hours |
| **Issue 3.9** | Section Editor: Projects List Panel | `priority:high` | 8 hours |
| **Issue 3.10** | Dynamic Template Context & State Hook | `priority:medium` | 6 hours |
| **Issue 3.11** | Template Styling: "Classic Minimal" CSS | `priority:medium` | 8 hours |
| **Issue 3.12** | Template Styling: "Modern Executive" CSS | `priority:medium` | 8 hours |
| **Issue 3.13** | Template Styling: "Professional Tech" CSS | `priority:medium` | 8 hours |
| **Issue 3.14** | Live PDF Preview Blob Canvas Panel | `priority:high` | 8 hours |
| **Issue 3.15** | Client-Side PDF Export Handler | `priority:high` | 8 hours |
| **Issue 3.16** | Editor Input Form Validation Rules | `priority:medium` | 6 hours |
| **Issue 3.17** | Drag-and-Drop List Reordering UI | `priority:low` | 8 hours |
| **Issue 3.18** | Jest Unit Test Coverage for Editor Core | `priority:high` | 8 hours |

---

## 2. Granular Specifications

### Issue 3.1: Scaffold Editor Route & Dual-Pane Layout
*   **Description**: Create the route `/resume-builder` under the `(app)` group, layout structure split into side-by-side editing pane (left) and PDF preview pane (right).
*   **Acceptance Criteria**:
    *   Route `/resume-builder` resolves correctly inside `AppShell`.
    *   On desktop, the layout is split 50/50. Responsive layout shifts edit forms to top on mobile.
    *   Both panels scroll independently.
*   **Priority**: `priority:high`
*   **Labels**: `type:feature`, `area:frontend`, `area:ui`, `area:resume-builder`
*   **Dependencies**: Epic 2.5 complete
*   **Estimated Time**: 6 hours
*   **Suggested Branch**: `feature/builder-layout-scaffold`
*   **Suggested Commit**: `feat: scaffold dual-pane layout for resume builder`
*   **Suggested PR Title**: `feat: Scaffold editor layout split pane`

---

### Issue 3.2: Form Editor Sections Skeleton UI
*   **Description**: Scaffold collapsible accordion panels in the left editing sidebar mapping Personal Details, Experience, Education, Skills, and Projects.
*   **Acceptance Criteria**:
    *   Accordions open and close independently.
    *   Smooth transitions between states.
    *   Focus indicators are visible and screen reader tags (`aria-expanded`) map correctly.
*   **Priority**: `priority:high`
*   **Labels**: `type:feature`, `area:frontend`, `area:ui`, `area:resume-builder`
*   **Dependencies**: Issue 3.1
*   **Estimated Time**: 6 hours
*   **Suggested Branch**: `feature/builder-sections-skeleton`
*   **Suggested Commit**: `feat: implement collapsible accordion skeleton for editor sidebar`
*   **Suggested PR Title**: `feat: Collapsible sidebar accordion skeletons`

---

### Issue 3.3: Redux Store Models for Resume State
*   **Description**: Define resume builder state schemas, reducers, and actions inside the Redux store to manage candidate form data.
*   **Acceptance Criteria**:
    *   State stores personal details and list structures for work, education, projects, and skills.
    *   Export typed selectors to access data from components.
    *   Redux unit tests cover state transitions.
*   **Priority**: `priority:high`
*   **Labels**: `type:feature`, `area:frontend`, `area:resume-builder`
*   **Dependencies**: Issue 3.2
*   **Estimated Time**: 8 hours
*   **Suggested Branch**: `feature/builder-redux-slice`
*   **Suggested Commit**: `feat: configure redux slice models for resume editor data`
*   **Suggested PR Title**: `feat: Implement redux slice for resume state`

---

### Issue 3.4: Local Storage Auto-Save Middleware
*   **Description**: Implement a Redux middleware module that automatically saves updated resume state values to `localStorage`.
*   **Acceptance Criteria**:
    *   State modifications save automatically (debounced by 1000ms).
    *   Editor restores state on startup.
    *   Displays an "All changes saved" indicator state in the editor UI.
*   **Priority**: `priority:medium`
*   **Labels**: `type:feature`, `area:frontend`, `area:resume-builder`
*   **Dependencies**: Issue 3.3
*   **Estimated Time**: 5 hours
*   **Suggested Branch**: `feature/builder-autosave-middleware`
*   **Suggested Commit**: `feat: integrate localstorage auto-save middleware for state updates`
*   **Suggested PR Title**: `feat: Add local storage auto-save middleware`

---

### Issue 3.5: Section Editor: Personal Header Details
*   **Description**: Build form inputs inside the Personal Details panel (Name, Title, Email, Phone, Website, Location).
*   **Acceptance Criteria**:
    *   Inputs update the Redux state instantly.
    *   Inputs map proper keyboard tab index mappings.
    *   Aria-labels define input helpers.
*   **Priority**: `priority:high`
*   **Labels**: `type:feature`, `area:frontend`, `area:resume-builder`, `area:ui`
*   **Dependencies**: Issue 3.3
*   **Estimated Time**: 6 hours
*   **Suggested Branch**: `feature/builder-header-editor`
*   **Suggested Commit**: `feat: implement personal header details form editor`
*   **Suggested PR Title**: `feat: Header details editor panel`

---

### Issue 3.6: Section Editor: Work Experience List Panel
*   **Description**: Build the Work Experience accordion subcomponent supporting multiple experience records.
*   **Acceptance Criteria**:
    *   Support adding, updating, and removing work records.
    *   Fields include Company, Role, Start/End Dates, Location, Description.
    *   Rich textarea supports markdown/bullet lists.
*   **Priority**: `priority:high`
*   **Labels**: `type:feature`, `area:frontend`, `area:resume-builder`, `area:ui`
*   **Dependencies**: Issue 3.3
*   **Estimated Time**: 8 hours
*   **Suggested Branch**: `feature/builder-work-editor`
*   **Suggested Commit**: `feat: implement work experience list editor with sub-records`
*   **Suggested PR Title**: `feat: Work experience list editor panel`

---

### Issue 3.7: Section Editor: Education List Panel
*   **Description**: Build the Education list editor subcomponent.
*   **Acceptance Criteria**:
    *   Add, edit, delete school records.
    *   Fields include School, Degree, Major, Graduation Date, GPA.
*   **Priority**: `priority:high`
*   **Labels**: `type:feature`, `area:frontend`, `area:resume-builder`, `area:ui`
*   **Dependencies**: Issue 3.3
*   **Estimated Time**: 8 hours
*   **Suggested Branch**: `feature/builder-education-editor`
*   **Suggested Commit**: `feat: implement education list editor component`
*   **Suggested PR Title**: `feat: Education list editor panel`

---

### Issue 3.8: Section Editor: Skills List Panel
*   **Description**: Build the Skills accordion editor using tag arrays.
*   **Acceptance Criteria**:
    *   User inputs tag values (e.g. "React"), separating with commas to build pills lists.
    *   Pills include delete controls.
*   **Priority**: `priority:high`
*   **Labels**: `type:feature`, `area:frontend`, `area:resume-builder`, `area:ui`
*   **Dependencies**: Issue 3.3
*   **Estimated Time**: 8 hours
*   **Suggested Branch**: `feature/builder-skills-editor`
*   **Suggested Commit**: `feat: implement tag-based skills list editor component`
*   **Suggested PR Title**: `feat: Tag-based skills editor panel`

---

### Issue 3.9: Section Editor: Projects List Panel
*   **Description**: Build the Projects list editor panel.
*   **Acceptance Criteria**:
    *   Add, modify, delete project items.
    *   Fields: Name, Role, URL, Description.
*   **Priority**: `priority:high`
*   **Labels**: `type:feature`, `area:frontend`, `area:resume-builder`, `area:ui`
*   **Dependencies**: Issue 3.3
*   **Estimated Time**: 8 hours
*   **Suggested Branch**: `feature/builder-projects-editor`
*   **Suggested Commit**: `feat: implement projects list editor component`
*   **Suggested PR Title**: `feat: Projects list editor panel`

---

### Issue 3.10: Dynamic Template Context & State Hook
*   **Description**: Configure a context provider wrapper mapping font spacing, column margins, and colors to active templates.
*   **Acceptance Criteria**:
    *   State holds the active template identifier.
    *   Theme toggle updates layout context dynamically.
*   **Priority**: `priority:medium`
*   **Labels**: `type:feature`, `area:frontend`, `area:resume-builder`
*   **Dependencies**: Issue 3.3
*   **Estimated Time**: 6 hours
*   **Suggested Branch**: `feature/builder-template-context`
*   **Suggested Commit**: `feat: establish dynamic template context mapping hooks`
*   **Suggested PR Title**: `feat: Template dynamic context hooks`

---

### Issue 3.11: Template Styling: "Classic Minimal" CSS
*   **Description**: Coder styling template for "Classic Minimal" (traditional serif layout, single column).
*   **Acceptance Criteria**:
    *   Clean layout margins.
    *   Responsive to typography spacing.
    *   Strict dark mode colors contrast map.
*   **Priority**: `priority:medium`
*   **Labels**: `type:feature`, `area:frontend`, `area:ui`, `area:resume-builder`
*   **Dependencies**: Issue 3.10
*   **Estimated Time**: 8 hours
*   **Suggested Branch**: `feature/template-classic-styling`
*   **Suggested Commit**: `feat: implement classic minimal serif resume template layout`
*   **Suggested PR Title**: `feat: Classic Minimal template styles`

---

### Issue 3.12: Template Styling: "Modern Executive" CSS
*   **Description**: Code styling template for "Modern Executive" (sans-serif, left-aligned bold accents).
*   **Acceptance Criteria**:
    *   Aligns headers and layout groups cleanly.
    *   Meets contrast standards.
*   **Priority**: `priority:medium`
*   **Labels**: `type:feature`, `area:frontend`, `area:ui`, `area:resume-builder`
*   **Dependencies**: Issue 3.10
*   **Estimated Time**: 8 hours
*   **Suggested Branch**: `feature/template-modern-styling`
*   **Suggested Commit**: `feat: implement modern executive sans-serif template layout`
*   **Suggested PR Title**: `feat: Modern Executive template styles`

---

### Issue 3.13: Template Styling: "Professional Tech" CSS
*   **Description**: Code styling template for "Professional Tech" (mono fonts headers, two-column layouts).
*   **Acceptance Criteria**:
    *   Two-column grids load dynamically without overlaps.
    *   Responsive alignment on narrow previews.
*   **Priority**: `priority:medium`
*   **Labels**: `type:feature`, `area:frontend`, `area:ui`, `area:resume-builder`
*   **Dependencies**: Issue 3.10
*   **Estimated Time**: 8 hours
*   **Suggested Branch**: `feature/template-tech-styling`
*   **Suggested Commit**: `feat: implement professional tech mono resume template layout`
*   **Suggested PR Title**: `feat: Professional Tech template styles`

---

### Issue 3.14: Live PDF Preview Blob Canvas Panel
*   **Description**: Create the preview iframe/canvas component generating live outputs based on form updates.
*   **Acceptance Criteria**:
    *   Input changes trigger preview re-renders (debounced by 300ms).
    *   Shows spinner state during compilation.
*   **Priority**: `priority:high`
*   **Labels**: `type:feature`, `area:frontend`, `area:ui`, `area:resume-builder`
*   **Dependencies**: Issue 3.11, Issue 3.12, Issue 3.13
*   **Estimated Time**: 8 hours
*   **Suggested Branch**: `feature/builder-pdf-preview`
*   **Suggested Commit**: `feat: build live PDF preview canvas compiler panel`
*   **Suggested PR Title**: `feat: PDF live preview canvas panel`

---

### Issue 3.15: Client-Side PDF Export Handler
*   **Description**: Develop the trigger button converting styled HTML contents into downloadable PDF documents.
*   **Acceptance Criteria**:
    *   Uses print stylesheets or `window.print()` wrappers styled for A4/Letter size.
    *   Resulting PDF includes correct metadata (producer "ResumeFlow").
*   **Priority**: `priority:high`
*   **Labels**: `type:feature`, `area:frontend`, `area:resume-builder`
*   **Dependencies**: Issue 3.14
*   **Estimated Time**: 8 hours
*   **Suggested Branch**: `feature/builder-pdf-export`
*   **Suggested Commit**: `feat: build client-side PDF export compiler handler`
*   **Suggested PR Title**: `feat: Client PDF export compiler`

---

### Issue 3.16: Editor Input Form Validation Rules
*   **Description**: Configure client validations for input elements (date overlaps, malformed URLs, empty names).
*   **Acceptance Criteria**:
    *   Failing elements show warning text with `aria-live="polite"`.
    *   Prevents export if validation fails.
*   **Priority**: `priority:medium`
*   **Labels**: `type:feature`, `area:frontend`, `area:resume-builder`, `area:ux`
*   **Dependencies**: Issue 3.5, Issue 3.6
*   **Estimated Time**: 6 hours
*   **Suggested Branch**: `feature/builder-validation-rules`
*   **Suggested Commit**: `feat: configure client-side form input validation schema checks`
*   **Suggested PR Title**: `feat: Form validation and validation styling`

---

### Issue 3.17: Drag-and-Drop List Reordering UI
*   **Description**: Add drag handles to work, education, and project lists allowing users to reorder records.
*   **Acceptance Criteria**:
    *   User drags items to reorder them in the list.
    *   Updates Redux state correctly.
    *   Keyboard controls support reordering (Space select, arrows move, Enter drop).
*   **Priority**: `priority:low`
*   **Labels**: `type:feature`, `area:frontend`, `area:resume-builder`, `area:ux`
*   **Dependencies**: Issue 3.6, Issue 3.7
*   **Estimated Time**: 8 hours
*   **Suggested Branch**: `feature/builder-drag-drop`
*   **Suggested Commit**: `feat: integrate drag-and-drop record list reordering controls`
*   **Suggested PR Title**: `feat: Drag and drop list reordering`

---

### Issue 3.18: Jest Unit Test Coverage for Editor Core
*   **Description**: Write Jest tests to verify editor components and state operations.
*   **Acceptance Criteria**:
    *   Covers personal details updates, item additions, and validation alerts.
    *   Mock Redux provider matches store changes.
*   **Priority**: `priority:high`
*   **Labels**: `type:testing`, `area:frontend`, `area:resume-builder`
*   **Dependencies**: Issue 3.16
*   **Estimated Time**: 8 hours
*   **Suggested Branch**: `feature/builder-unit-tests`
*   **Suggested Commit**: `test: write unit test coverage for builder forms and middleware`
*   **Suggested PR Title**: `test: Editor core unit tests suite`
