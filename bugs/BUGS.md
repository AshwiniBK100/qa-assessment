# Bug Reports

All bugs are also filed as GitHub Issues (see `scripts/create-issues.sh`) and tracked on the Project board.
Run `npm run screenshots` to regenerate evidence images in `bugs/screenshots/`.

## BUG-1: problem_user: every product shows the same image
**Severity:** Major  **Priority:** High
**Steps:** 1. Go to saucedemo.com 2. Login as `problem_user` / `secret_sauce` 3. Look at the product list
**Expected:** Each product shows its own image (backpack, bike light, etc.)
**Actual:** All six products show the same dog photo.
![bug1](screenshots/bug1-same-images.png)

## BUG-2: problem_user: sorting dropdown does not reorder products
**Severity:** Major  **Priority:** High
**Steps:** 1. Login as `problem_user` 2. Select "Name (Z to A)" (or any option) in the sort dropdown
**Expected:** List reorders to match the selected option.
**Actual:** List order does not change.
![bug2](screenshots/bug2-sort-broken.png)

## BUG-3: problem_user: Add to cart / Remove buttons fail on some products
**Severity:** Critical  **Priority:** High
**Steps:** 1. Login as `problem_user` 2. Click "Add to cart" on every product, one by one 3. Check badge and button state
**Expected:** Badge counts every added item; button changes to "Remove"; Remove works.
**Actual:** Some products cannot be added/removed (button doesn't change, badge not updated). *(Note which items failed in your run.)*
![bug3](screenshots/bug3-add-to-cart.png)

## BUG-4: problem_user: Last Name input overwrites First Name at checkout
**Severity:** Critical  **Priority:** High
**Steps:** 1. Login as `problem_user` 2. Add any item, open cart, click Checkout 3. Type First Name, then Last Name, then Postal Code 4. Click Continue
**Expected:** Each value stays in its own field; checkout continues.
**Actual:** Typing the last name changes the First Name field, Last Name stays empty, and "Error: Last Name is required" appears. Checkout is impossible.
![bug4](screenshots/bug4-lastname.png)

## BUG-5: performance_glitch_user: login takes ~5 seconds with no loading feedback
**Severity:** Minor  **Priority:** Medium
**Steps:** 1. Login as `performance_glitch_user` / `secret_sauce` 2. Click Login and time the redirect
**Expected:** Login completes in about 1 second, or a loading indicator is shown.
**Actual:** Page appears frozen for several seconds with no spinner or message.
![bug5](screenshots/bug5-slow-login.png)

## BUG-6: standard_user: checkout is allowed with an empty cart
**Severity:** Major  **Priority:** Medium
**Steps:** 1. Login as `standard_user` 2. Open cart without adding items 3. Click Checkout
**Expected:** Checkout blocked (disabled button or message "Your cart is empty").
**Actual:** User proceeds to the checkout form and can complete an order with $0.00 items.
![bug6](screenshots/bug6-empty-cart-checkout.png)
