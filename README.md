# QA Assessment: Ashwini Kurubagond

![CI](https://github.com/AshwiniBK100/qa-assessment/actions/workflows/ci.yml/badge.svg)

**Repo:** https://github.com/AshwiniBK100/qa-assessment

Manual testing, bug reports, UI automation (SauceDemo) and API tests (ReqRes) in one repo.

| Part | Where |
|---|---|
| 1. Test plan + 32 test cases | [`docs/TEST_PLAN.md`](docs/TEST_PLAN.md), [`docs/TEST_CASES.md`](docs/TEST_CASES.md) |
| 2. Bug reports | [Issues tab](../../issues), [Project board](../../projects), [`bugs/BUGS.md`](bugs/BUGS.md) |
| 3. UI automation (Playwright) | [`tests/ui`](tests/ui) |
| 4. API tests (Playwright request) | [`tests/api`](tests/api) |
| Bonus: CI | [`.github/workflows/ci.yml`](.github/workflows/ci.yml) |

## Run it
```bash
npm install                      # also downloads Chromium
export REQRES_API_KEY=your_key   # free key from https://reqres.in (needed for API tests only)
npm test                         # runs UI + API suites
npm run test:ui                  # UI only (no key needed)
npm run report                   # open HTML report
```
Windows PowerShell: `$env:REQRES_API_KEY="your_key"`. Without the key, API tests are skipped with a clear message.
In CI, add the key as repository secret `REQRES_API_KEY`.

## What the tests cover
**UI** (`tests/ui`)
- `login.spec.ts`: TC-01..08: valid login, locked-out user, wrong password, empty username/password, direct URL without login, logout + back button, performance_glitch_user timing.
- `inventory.spec.ts`: TC-09..13: default sort, Z-A, price low-high, price high-low, product detail.
- `cart-checkout.spec.ts`: TC-14..21: add/remove, cart persistence, full checkout with total check, field validation (x3), special characters/XSS string, empty-cart checkout, cancel.
- `problem-user.spec.ts`: BUG-1..4 asserted with `test.fail()` (expected failures). If a bug is fixed, the test "unexpectedly passes" and fails the run, which signals the fix.
- TC-20 (empty cart) uses the same expected-failure technique for BUG-6.

**API** (`tests/api/reqres.spec.ts`). Each asserts status code **and** body shape:
- API-01/02 GET list and single user (types, email format, avatar URL)
- API-03/09 404 not found (status + empty body)
- API-04 POST create user (201, echoed fields, `id`, ISO `createdAt`)
- API-05 login success (token string)
- API-06/07/08 invalid/missing data (400 + exact error message)

## Bug workflow
```bash
npm run screenshots              # captures evidence into bugs/screenshots
git add . && git commit -m "screenshots" && git push
./scripts/create-issues.sh AshwiniBK100/qa-assessment   # creates 6 issues + Kanban board (needs gh CLI)
```
