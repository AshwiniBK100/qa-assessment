# Test Cases: SauceDemo

Legend: **A** = automated (Playwright), **M** = manual. Password for all users: `secret_sauce`.

| ID | Title | Preconditions | Steps | Expected Result | Priority | Type |
|---|---|---|---|---|---|---|
| TC-01 | Valid login (standard_user) | On login page | Enter standard_user / secret_sauce; click Login | Redirected to /inventory.html; "Products" title; 6 items | High | A |
| TC-02 | Locked-out user login | On login page | Login as locked_out_user | Error "Sorry, this user has been locked out."; stays on login | High | A |
| TC-03 | Wrong password | On login page | standard_user + wrong password | Error "Username and password do not match..." | High | A |
| TC-04 | Empty username | On login page | Leave username blank, enter password, Login | Error "Username is required" | Med | A |
| TC-05 | Empty password | On login page | Enter username, blank password, Login | Error "Password is required" | Med | A |
| TC-06 | Direct URL access without login | Logged out | Open /inventory.html directly | Error "You can only access '/inventory.html' when you are logged in." | High | A |
| TC-07 | Logout and back button | Logged in | Menu > Logout; press browser Back | Login page shown; protected page not accessible | High | A |
| TC-08 | performance_glitch_user login latency | On login page | Login as performance_glitch_user; time it | Login succeeds; delay recorded (observed ~5s) | Med | A |
| TC-09 | Default sort order | Logged in | Open inventory | Products sorted Name A to Z | Med | A |
| TC-10 | Sort Name Z to A | Logged in | Choose "Name (Z to A)" | Names in descending order | Med | A |
| TC-11 | Sort Price low to high | Logged in | Choose "Price (low to high)" | Prices ascending | Med | A |
| TC-12 | Sort Price high to low | Logged in | Choose "Price (high to low)" | Prices descending | Med | A |
| TC-13 | Product detail page | Logged in | Click first product name | Detail page shows same name, price, description, image | Med | A |
| TC-14 | Add item to cart | Logged in | Click Add to cart on Backpack; open cart | Badge = 1; item in cart; button changes to Remove | High | A |
| TC-15 | Remove item from cart | Item in cart | Click Remove on inventory page | Badge disappears; button reverts to Add to cart | High | A |
| TC-16 | Cart persists on reload | Item in cart | Refresh page | Badge still 1 | Med | A |
| TC-17 | Checkout happy path | Item in cart | Cart > Checkout; fill valid info; Continue; Finish | Overview total $32.39; "Thank you for your order!" | High | A |
| TC-18 | Checkout validation (3 fields) | Item in cart | Leave first name / last name / postal blank one at a time | Matching "... is required" error each time | High | A |
| TC-19 | Special characters in form | Item in cart | Enter `<script>alert(1)</script>`, `O'Brien-Ünï`, `!@#$%` | No script executes; flow continues or shows clean validation | Med | A |
| TC-20 | Empty cart checkout | Logged in, cart empty | Open cart; click Checkout | Should be blocked (**actual: allowed, BUG-6**) | High | A |
| TC-21 | Cancel at checkout step one | Item in cart | Checkout > Cancel | Returns to cart with items intact | Low | A |
| TC-22 | Back button after order complete | Order placed | Press browser Back from completion page | Cart is empty; cannot re-submit same order; no duplicate order | High | M |
| TC-23 | SQL injection string in login | On login page | Username `' OR 1=1 --`, any password | Login rejected with standard error; no server error | Med | M |
| TC-24 | Username case sensitivity | On login page | Login as STANDARD_USER | Login rejected (usernames case-sensitive) | Low | M |
| TC-25 | Leading/trailing spaces in username | On login page | Username ` standard_user ` | Rejected or trimmed consistently; no crash | Low | M |
| TC-26 | Very long input (300 chars) in checkout fields | Item in cart | Paste 300-char strings in all fields | App handles gracefully; no layout break; validation or acceptance consistent | Low | M |
| TC-27 | Price/tax calculation, multiple items | Logged in | Add Backpack + Bike Light + T-Shirt; reach overview | Item total = sum; tax = 8%; total = item total + tax | High | M |
| TC-28 | Cart reset on logout / Reset App State | Items in cart | Menu > Reset App State | Cart emptied; buttons reset to Add to cart | Med | M |
| TC-29 | Responsive layout at 375px | Logged in | Resize to 375x812 | No horizontal scroll; menu, cart and buttons usable | Med | M |
| TC-30 | Keyboard accessibility on login | On login page | Tab through fields; press Enter | Logical tab order; Enter submits form | Low | M |
| TC-31 | Error banner dismiss | Login error visible | Click X on error | Banner closes; red field highlights clear | Low | M |
| TC-32 | Refresh on checkout overview | On step two | Press F5 | Page keeps cart/summary or redirects safely; no blank page | Med | M |
