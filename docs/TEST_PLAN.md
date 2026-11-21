# Test Plan: SauceDemo (https://www.saucedemo.com/)

**Author:** Ashwini Kurubagond  **Version:** 1.0

## 1. Objective
Verify login, product listing/sorting, cart and checkout work correctly for the standard user, and find defects exposed by the seeded users (`problem_user`, `performance_glitch_user`, `locked_out_user`).

## 2. Scope
| In scope | Out of scope |
|---|---|
| Login / logout / session access control | Load / stress testing |
| Product list, sorting, product detail | Security penetration testing (only basic input checks) |
| Cart add / remove / persistence | Cross-browser matrix beyond Chromium (manual spot-check on Firefox/Safari) |
| Checkout (info, overview, completion) | Native mobile apps |
| Basic UI/responsive checks | Third-party social links' destination sites |

## 3. Test Users
`standard_user`, `locked_out_user`, `problem_user`, `performance_glitch_user` (password `secret_sauce`). Also `error_user` and `visual_user` for exploratory work if time permits.

## 4. Approach
- **Manual:** functional, UI, negative and edge cases (see `TEST_CASES.md`, 32 cases).
- **Automated:** Playwright UI suite (22+ checks) and API suite (9 checks), run on every push via GitHub Actions.
- **Exploratory:** 30-minute session per seeded user; defects logged as GitHub Issues.
- **Prioritisation:** High = blocks purchase flow or login; Med = wrong data/UX but workaround exists; Low = cosmetic.

## 5. Environment
Chrome latest (primary), Firefox & Safari latest (spot-check), desktop 1280x900 and mobile 375x812 viewport. Node 20 + Playwright for automation.

## 6. Entry / Exit Criteria
- **Entry:** site reachable, test users available, test cases reviewed.
- **Exit:** all High cases executed; no open Critical/High defects without a ticket; all bugs logged with evidence; automation green on CI.

## 7. Risks & Assumptions
- Public demo site may change or reset without notice; cart state is client-side (localStorage).
- Seeded bugs are intentional, so they are tracked as "known defects" and automated with expected-fail assertions.
- Performance thresholds are observational (no SLA published).

## 8. Deliverables
Test plan, test cases, bug reports (GitHub Issues + Project board), automation code, API tests, CI workflow.

## 9. Defect Management
Each bug: one GitHub Issue with Severity/Priority labels, steps, expected vs actual, inline screenshot; tracked on the Kanban board (To Do / In Progress / Done).
