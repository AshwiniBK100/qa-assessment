#!/usr/bin/env bash
# Usage: ./scripts/create-issues.sh <owner>/<repo>
# Needs GitHub CLI: gh auth login && gh auth refresh -s project
# Prereq: npm run screenshots, then commit+push bugs/screenshots so image URLs resolve.
set -euo pipefail
REPO="${1:?usage: $0 owner/repo}"
OWNER="${REPO%%/*}"
RAW="https://raw.githubusercontent.com/$REPO/main/bugs/screenshots"

for l in "bug" "severity: critical" "severity: major" "severity: minor" "priority: high" "priority: medium"; do
  gh label create "$l" --repo "$REPO" --force >/dev/null 2>&1 || true
done

PURL=$(gh project create --owner "$OWNER" --title "QA Bug Board" --format json -q .url)
PNUM=$(echo "$PURL" | grep -oE '[0-9]+$')
gh project link "$PNUM" --owner "$OWNER" --repo "$REPO" || true
echo "Board: $PURL  (Status field defaults: Todo / In Progress / Done)"

mk() { # title | severity | priority | image | steps | expected | actual
  local body="**Severity:** $2  |  **Priority:** $3

### Steps to Reproduce
$5

### Expected Result
$6

### Actual Result
$7

### Screenshot
![screenshot]($RAW/$4)"
  local url
  url=$(gh issue create --repo "$REPO" --title "$1" --label "bug,severity: $2,priority: $3" --body "$body")
  gh project item-add "$PNUM" --owner "$OWNER" --url "$url" >/dev/null
  echo "$url"
}

mk "[problem_user] All products display the same image" major high bug1-same-images.png \
"1. Open https://www.saucedemo.com
2. Login as problem_user / secret_sauce
3. View the product list" \
"Each product shows its own image." \
"All six products show the same dog photo."

mk "[problem_user] Sort dropdown does not reorder products" major high bug2-sort-broken.png \
"1. Login as problem_user
2. Select 'Name (Z to A)' in the sort dropdown" \
"Product list reorders accordingly." \
"Order does not change."

mk "[problem_user] Add to cart / Remove fails for some products" critical high bug3-add-to-cart.png \
"1. Login as problem_user
2. Click 'Add to cart' on each product
3. Watch cart badge and button text" \
"Every product is added, badge counts them, button becomes Remove." \
"Some products cannot be added/removed; badge and button do not update."

mk "[problem_user] Last Name input overwrites First Name at checkout" critical high bug4-lastname.png \
"1. Login as problem_user, add an item, open cart, click Checkout
2. Type First Name, Last Name, Postal Code
3. Click Continue" \
"Each value stays in its own field; checkout continues." \
"Typing last name changes First Name; Last Name stays empty; error 'Last Name is required'. Checkout impossible."

mk "[performance_glitch_user] Login takes ~5s with no loading indicator" minor medium bug5-slow-login.png \
"1. Login as performance_glitch_user / secret_sauce
2. Click Login and time the redirect" \
"Login completes quickly or shows a loading indicator." \
"UI appears frozen for several seconds with no feedback."

mk "[standard_user] Checkout allowed with empty cart" major medium bug6-empty-cart-checkout.png \
"1. Login as standard_user
2. Open cart without adding items
3. Click Checkout" \
"Checkout blocked or a 'cart is empty' message shown." \
"User reaches the checkout form and can complete a \$0.00 order."

echo "Done. Drag cards on the board: Todo -> In Progress -> Done."
