# Security Policy

This document outlines the security policies, version support matrix, reporting protocols, and disclosure process for the ResumeFlow project.

---

## 1. Supported Versions

We actively monitor and patch vulnerabilities in the following versions:

| Version  | Supported | Notes                                            |
| :------- | :-------- | :----------------------------------------------- |
| `v1.1.x` | Yes       | Active main development branch.                  |
| `v1.0.x` | Yes       | Legacy production stable branch.                 |
| `< v1.0` | No        | Pre-release alpha/beta builds. Upgrade to v1.0+. |

---

## 2. Reporting a Vulnerability

We request that you **do not open public GitHub Issues** to report security vulnerabilities. Please report them privately to protect our users.

### Reporting Procedure

1.  Draft an email to `security@resumeflow.com`.
2.  Include:
    - A detailed description of the vulnerability.
    - Step-by-step instructions to reproduce or a Proof of Concept (POC) script.
    - The potential security impact (e.g. XSS, privilege escalation, data exposure).
3.  We will acknowledge receipt of your report within **24 hours** and supply a tracking ID.

---

## 3. Disclosure Process

We follow a responsible disclosure policy:

1.  **Investigation**: We verify the vulnerability and assess its severity.
2.  **Remediation**: We prepare a hotfix patch internally.
3.  **Release & Announcement**: We release the patched version (as a SemVer patch build) and publish a security advisory. We aim to resolve all high-severity items within **14 days** of initial reports.
