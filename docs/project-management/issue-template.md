# GitHub Issue Templates

This document details the configuration files for GitHub Issue Templates located under `.github/ISSUE_TEMPLATE/` in the ResumeFlow repository.

---

## 1. Feature Template (`.github/ISSUE_TEMPLATE/feature.md`)

```markdown
---
name: 🚀 Feature Request
about: Propose new capabilities or user-facing functionality for ResumeFlow
title: 'feat: '
labels: ['type:feature', 'status:ready']
---

## User Story
**As a** [User Type]
**I want to** [Action / Capability]
**So that** [Value / Benefit]

## Acceptance Criteria
- [ ] Criterion 1 (specific, testable)
- [ ] Criterion 2
- [ ] Accessibility (A11y): Complies with outline/contrast/aria rules.
- [ ] Cross-browser validation: Works in Chrome, Firefox, Safari.

## Implementation Details
- [Outline structural designs, React context hooks, Redux dependencies, CSS classes]

## Dependencies & Risks
- [List blocking issues or breaking risks]
```

---

## 2. Bug Template (`.github/ISSUE_TEMPLATE/bug.md`)

```markdown
---
name: 🐛 Bug Report
about: Document a software regression, error, or incorrect behavior
title: 'fix: '
labels: ['type:bug', 'priority:medium']
---

## Bug Description
A clear and concise description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. See error '....'

## Expected Behavior
A description of what should happen under correct operating parameters.

## Screenshots (If Applicable)
Add screenshots or gifs illustrating visual layout failures (Light & Dark modes).

## Remediation Plan
- [Suggested codebase fixes or directory adjustments]
```

---

## 3. Enhancement Template (`.github/ISSUE_TEMPLATE/enhancement.md`)

```markdown
---
name: ⚡ Enhancement
about: Propose iterative adjustments to existing functionality
title: 'enh: '
labels: ['type:enhancement']
---

## Current Behavior
Describe the functionality as it operates today.

## Proposed Improvement
Describe the changes that will improve the experience.

## Business / Performance Value
Explain why this enhancement should be prioritized.
```

---

## 4. Technical Debt Template (`.github/ISSUE_TEMPLATE/tech-debt.md`)

```markdown
---
name: 🧹 Technical Debt
about: Propose cleanups, structural refactors, or library upgrades
title: 'chore: '
labels: ['type:technical-debt']
---

## Problem Statement
What legacy code blocks or library configurations have accumulated debt?

## Remediation Plan
- [ ] Deprecate / remove unused parameters
- [ ] Upgrade packages
- [ ] Simplify structures

## Verification Plan
- [ ] Check compiler builds cleanly
- [ ] Check legacy tests pass
```

---

## 5. Security Template (`.github/ISSUE_TEMPLATE/security.md`)

```markdown
---
name: 🔐 Security Task
about: Vulnerability remediation, package patches, or access control audits
title: 'sec: '
labels: ['type:security', 'priority:high']
---

## Vulnerability Detail
Identify the CVE, package dependency warning, XSS/CSRF exposure, or permission leakage.

## Remediation Plan
- [Outline security steps to close the vulnerability]

## Verification
- [ ] Run validation scanners
- [ ] Verify access tokens are hidden
```

---

## 6. Performance Template (`.github/ISSUE_TEMPLATE/performance.md`)

```markdown
---
name: 📈 Performance Optimization
about: Tasks target loading speed, hydration improvements, and asset size reductions
title: 'perf: '
labels: ['type:performance']
---

## Performance Bottleneck
Describe the slow route, large bundle chunk, or rendering lag.

## Target Metric Goals
- [ ] First Contentful Paint (FCP) reduction
- [ ] Cumulative Layout Shift (CLS) target
- [ ] Bundle chunk size reduction

## Proposed Changes
- [List preloads, memoization wrappers, or code splitting logic]
```

---

## 7. Research Template (`.github/ISSUE_TEMPLATE/research.md`)

```markdown
---
name: 🧪 Research Spike
about: Technical evaluations, spikes, or documentation tasks
title: 'spike: '
labels: ['type:research']
---

## Objective
What technical architectural questions are we trying to resolve?

## Deliverables
- [ ] Design document
- [ ] POC code spike branch
- [ ] Architecture review notes
```
