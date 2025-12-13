# Test Cases Documentation
## Online Bookstore Testing Suite

**Project:** Online Bookstore Web Application  
**Technology:** Next.js, MongoDB, Playwright  
**Test Framework:** Playwright with TypeScript  
**Total Test Cases:** 50+

---

## Test Case Format

Each test case includes:
- **Test Case ID:** Unique identifier
- **Priority:** Critical / High / Medium / Low
- **Type:** @smoke / @functional / @regression
- **Preconditions:** Setup required before execution
- **Test Steps:** Step-by-step execution
- **Expected Results:** What should happen
- **Test Data:** Data used in testing

---

## 1. Authentication Module (10 Test Cases)

### TC-AUTH-001: User Registration with Valid Data
- **Priority:** Critical
- **Type:** @smoke @functional
- **Preconditions:** 
  - Application is accessible
  - User not already registered
- **Test Steps:**
  1. Navigate to /register
  2. Enter name: "Test User"
  3. Enter unique email: "test123@example.com"
  4. Enter password: "password123"
  5. Enter confirm password: "password123"
  6. Click "Register" button
- **Expected Results:**
  - User is successfully registered
  - Redirected to home page or login
  - User can login with credentials
- **Test Data:** Name, Email, Password (6+ chars)

### TC-AUTH-002: User Registration with Password Mismatch
- **Priority:** High
- **Type:** @functional
- **Preconditions:** On registration page
- **Test Steps:**
  1. Enter all registration fields
  2. Enter password: "password123"
  3. Enter confirm password: "password456"
  4. Click Register
- **Expected Results:**
  - Error message: "Password Does not match"
  - Form not submitted
  - User remains on registration page
- **Test Data:** Mismatched passwords

### TC-AUTH-003: User Registration with Invalid Email
- **Priority:** High
- **Type:** @functional
- **Preconditions:** On registration page
- **Test Steps:**
  1. Enter name: "Test User"
  2. Enter email: "invalidemail"
  3. Enter password: "password123"
  4. Enter confirm password: "password123"
  5. Click Register
- **Expected Results:**
  - Email validation error displayed
  - Form not submitted
- **Test Data:** Invalid email format

### TC-AUTH-004: User Registration with Short Password
- **Priority:** High
- **Type:** @functional
- **Test Steps:**
  1. Enter valid name and email
  2. Enter password: "123"
  3. Click Register
- **Expected Results:**
  - Error: "Password can't be less than 6 characters"
  - Registration prevented

### TC-AUTH-005: User Login with Valid Credentials
- **Priority:** Critical
- **Type:** @smoke @regression
- **Preconditions:** Valid user exists in database
- **Test Steps:**
  1. Navigate to /login
  2. Enter email: "test@example.com"
  3. Enter password: "password123"
  4. Click "Login" button
- **Expected Results:**
  - User successfully logged in
  - Redirected to home page
  - Username displayed in header
  - Cart accessible
- **Test Data:** Valid email and password

### TC-AUTH-006: User Login with Invalid Credentials
- **Priority:** High
- **Type:** @functional
- **Test Steps:**
  1. Navigate to /login
  2. Enter email: "wrong@example.com"
  3. Enter password: "wrongpassword"
  4. Click Login
- **Expected Results:**
  - Error notification displayed
  - User not logged in
  - Remains on login page

### TC-AUTH-007: User Login with Empty Fields
- **Priority:** Medium
- **Type:** @functional
- **Test Steps:**
  1. Navigate to /login
  2. Leave email and password empty
  3. Click Login
- **Expected Results:**
  - Validation errors for required fields
  - Form not submitted

### TC-AUTH-008: Navigation Between Login and Register
- **Priority:** Low
- **Type:** @smoke
- **Test Steps:**
  1. Navigate to /login
  2. Click "Register" link
  3. Verify on register page
  4. Click "Login" link
  5. Verify back on login page
- **Expected Results:**
  - Smooth navigation between pages
  - No errors
  - All elements load correctly

### TC-AUTH-009: Password Field Masking
- **Priority:** High
- **Type:** @functional @security
- **Test Steps:**
  1. Navigate to /login
  2. Inspect password input field
- **Expected Results:**
  - Password field type is "password"
  - Input is masked (shows dots/asterisks)

### TC-AUTH-010: Session Persistence After Login
- **Priority:** High
- **Type:** @regression
- **Test Steps:**
  1. Login successfully
  2. Open new browser tab
  3. Navigate to application
  4. Check login status
- **Expected Results:**
  - User still logged in on new tab
  - No need to login again
  - Session maintained

---

## 2. Books Management Module (10 Test Cases)

### TC-BOOKS-001: Display Books List
- **Priority:** Critical
- **Type:** @smoke
- **Preconditions:** Books exist in database
- **Test Steps:**
  1. Navigate to /books
  2. Verify books are displayed
- **Expected Results:**
  - Books list page loads successfully
  - Multiple books displayed
  - Each book shows: title, author, price, description

### TC-BOOKS-002: Search Books with Valid Query
- **Priority:** High
- **Type:** @functional
- **Test Steps:**
  1. Navigate to /books
  2. Enter search term: "Harry Potter"
  3. Observe results
- **Expected Results:**
  - Search filters books list
  - Only matching books displayed
  - Non-matching books hidden

### TC-BOOKS-003: Search Books with No Results
- **Priority:** Medium
- **Type:** @functional
- **Test Steps:**
  1. Navigate to /books
  2. Enter search: "XYZ123NonExistent"
- **Expected Results:**
  - No books displayed
  - Appropriate message or empty state

### TC-BOOKS-004: Clear Search Filter
- **Priority:** Medium
- **Type:** @functional
- **Test Steps:**
  1. Search for books
  2. Click "Clear" button
- **Expected Results:**
  - Search input cleared
  - All books displayed again

### TC-BOOKS-005: Add Single Book to Cart
- **Priority:** Critical
- **Type:** @smoke @regression
- **Test Steps:**
  1. Navigate to /books
  2. Click "Add to Cart" on any book
  3. Check cart count in header
- **Expected Results:**
  - Success notification displayed
  - Cart count increases by 1
  - Book added to cart

### TC-BOOKS-006: Add Multiple Books to Cart
- **Priority:** High
- **Type:** @functional
- **Test Steps:**
  1. Navigate to /books
  2. Add 3 different books to cart
  3. Check cart count
- **Expected Results:**
  - Cart count shows 3
  - All books added successfully
  - No errors

### TC-BOOKS-007: Add Out of Stock Book
- **Priority:** High
- **Type:** @functional
- **Test Steps:**
  1. Identify out of stock book
  2. Attempt to add to cart
- **Expected Results:**
  - "Out of Stock" button disabled
  - Cannot add to cart
  - Warning message displayed

### TC-BOOKS-008: View Book Details
- **Priority:** Medium
- **Type:** @functional
- **Test Steps:**
  1. Navigate to /books
  2. Click on book title
- **Expected Results:**
  - Navigate to book detail page
  - Show full book information
  - Display related books

### TC-BOOKS-009: Responsive Design on Mobile
- **Priority:** Medium
- **Type:** @regression
- **Test Steps:**
  1. Open books page on mobile device
  2. Verify layout
- **Expected Results:**
  - Books display in single column
  - All elements accessible
  - Touch-friendly buttons

### TC-BOOKS-010: Book Information Accuracy
- **Priority:** High
- **Type:** @functional
- **Test Steps:**
  1. Select a book
  2. Verify all displayed information
- **Expected Results:**
  - Title, author, price accurate
  - Description complete
  - Category shown
  - Quantity available displayed

---

## 3. Shopping Cart Module (10 Test Cases)

### TC-CART-001: View Cart with Items
- **Priority:** Critical
- **Type:** @smoke
- **Preconditions:** Items already in cart
- **Test Steps:**
  1. Navigate to /cart
  2. Verify cart contents
- **Expected Results:**
  - All cart items displayed
  - Shows: name, quantity, price
  - Total calculated correctly

### TC-CART-002: View Empty Cart
- **Priority:** Medium
- **Type:** @functional
- **Test Steps:**
  1. Ensure cart is empty
  2. Navigate to /cart
- **Expected Results:**
  - Empty cart message displayed
  - No items shown
  - Link to continue shopping

### TC-CART-003: Remove Item from Cart
- **Priority:** High
- **Type:** @functional @regression
- **Test Steps:**
  1. Add items to cart
  2. Navigate to /cart
  3. Click remove button for an item
- **Expected Results:**
  - Item removed from cart
  - Cart count decreases
  - Total price updated

### TC-CART-004: Update Item Quantity
- **Priority:** High
- **Type:** @functional
- **Test Steps:**
  1. Add item to cart
  2. Navigate to /cart
  3. Click increase (+) button
  4. Click decrease (-) button
- **Expected Results:**
  - Quantity updates correctly
  - Price recalculated
  - Cart total updates

### TC-CART-005: Calculate Total Price
- **Priority:** Critical
- **Type:** @functional
- **Test Steps:**
  1. Add multiple items with different prices
  2. Check cart total
- **Expected Results:**
  - Total = sum of (price × quantity) for each item
  - Accurate calculation
  - Updates dynamically

### TC-CART-006: Proceed to Checkout from Cart
- **Priority:** Critical
- **Type:** @smoke
- **Test Steps:**
  1. Have items in cart
  2. Click "Checkout" button
- **Expected Results:**
  - If not logged in: redirect to login
  - If logged in: proceed to shipping
  - Cart preserved

### TC-CART-007: Cart Persistence Across Sessions
- **Priority:** Medium
- **Type:** @regression
- **Test Steps:**
  1. Add items to cart
  2. Close browser
  3. Reopen and navigate to site
  4. Check cart
- **Expected Results:**
  - Cart items still present
  - Quantities preserved
  - Session maintained

### TC-CART-008: Decrease Quantity to Minimum
- **Priority:** Medium
- **Type:** @functional
- **Test Steps:**
  1. Have item with quantity 1
  2. Click decrease button
- **Expected Results:**
  - Decrease button disabled at quantity 1
  - Cannot go below 1
  - Must use remove to delete

### TC-CART-009: Increase Quantity to Maximum Stock
- **Priority:** High
- **Type:** @functional
- **Test Steps:**
  1. Add item to cart
  2. Keep increasing quantity
  3. Reach stock limit
- **Expected Results:**
  - Cannot exceed available stock
  - Warning message displayed
  - Increase button disabled

### TC-CART-010: Remove All Items from Cart
- **Priority:** Medium
- **Type:** @functional
- **Test Steps:**
  1. Have multiple items in cart
  2. Remove items one by one
- **Expected Results:**
  - All items removed successfully
  - Cart shows empty state
  - Cart count shows 0

---

## 4. Checkout Process Module (12 Test Cases)

### TC-CHECKOUT-001: Complete Checkout with Credit Card
- **Priority:** Critical
- **Type:** @smoke @regression
- **Preconditions:** User logged in, items in cart
- **Test Steps:**
  1. Navigate to /cart
  2. Click Checkout
  3. Fill shipping address
  4. Select "Stripe" payment
  5. Click Place Order
- **Expected Results:**
  - Order placed successfully
  - Redirect to order confirmation
  - Order ID generated

### TC-CHECKOUT-002: Complete Checkout with COD
- **Priority:** Critical
- **Type:** @smoke
- **Test Steps:**
  1. Proceed through checkout
  2. Select "CashOnDelivery"
  3. Place order
- **Expected Results:**
  - Order created with COD payment
  - Confirmation shown

### TC-CHECKOUT-003: Shipping Address Validation
- **Priority:** High
- **Type:** @functional
- **Test Steps:**
  1. Leave shipping fields empty
  2. Try to proceed
- **Expected Results:**
  - Required field validations trigger
  - Cannot proceed with empty fields

### TC-CHECKOUT-004: Edit Shipping Address
- **Priority:** Medium
- **Type:** @functional
- **Test Steps:**
  1. Fill shipping address
  2. Proceed to payment
  3. Click "Back" to edit
  4. Modify address
  5. Proceed again
- **Expected Results:**
  - Can return to edit address
  - Changes saved
  - Can continue checkout

### TC-CHECKOUT-005: Payment Method Selection Required
- **Priority:** High
- **Type:** @functional
- **Test Steps:**
  1. Reach payment step
  2. Don't select any method
  3. Try to proceed
- **Expected Results:**
  - Validation error
  - Must select payment method
  - Cannot proceed without selection

### TC-CHECKOUT-006: Checkout Progress Indicator
- **Priority:** Low
- **Type:** @functional
- **Test Steps:**
  1. Observe checkout progress steps
  2. Navigate through checkout
- **Expected Results:**
  - Progress indicator shows: Login → Shipping → Payment → Order
  - Current step highlighted
  - Completed steps marked

### TC-CHECKOUT-007: Order Summary Display
- **Priority:** Medium
- **Type:** @functional
- **Test Steps:**
  1. Reach Place Order page
  2. Review order summary
- **Expected Results:**
  - Shows all items
  - Displays subtotal
  - Shows tax (15%)
  - Shows shipping cost
  - Shows total price

### TC-CHECKOUT-008: Empty Cart Checkout Prevention
- **Priority:** High
- **Type:** @functional
- **Test Steps:**
  1. Empty cart
  2. Try to access /shipping directly
- **Expected Results:**
  - Cannot proceed with empty cart
  - Redirect to cart page
  - Message to add items

### TC-CHECKOUT-009: Guest Checkout Prevention
- **Priority:** Critical
- **Type:** @functional
- **Test Steps:**
  1. Logout if logged in
  2. Try to access checkout
- **Expected Results:**
  - Redirect to login page
  - Must authenticate first
  - Redirect back after login

### TC-CHECKOUT-010: Order Confirmation Details
- **Priority:** High
- **Type:** @functional
- **Test Steps:**
  1. Complete order
  2. View confirmation page
- **Expected Results:**
  - Shows order ID
  - Lists all ordered items
  - Shows delivery address
  - Shows payment method
  - Order status visible

### TC-CHECKOUT-011: Multiple Payment Methods Available
- **Priority:** Medium
- **Type:** @functional
- **Test Steps:**
  1. Navigate to payment step
  2. Verify all payment options
- **Expected Results:**
  - PayPal option available
  - Stripe option available
  - Cash on Delivery available
  - All options selectable

### TC-CHECKOUT-012: Postal Code Format Validation
- **Priority:** Medium
- **Type:** @functional
- **Test Steps:**
  1. Enter invalid postal code format
  2. Try to proceed
- **Expected Results:**
  - Validation error if format wrong
  - Must correct to proceed

---

## 5. Admin Dashboard Module (10 Test Cases)

### TC-ADMIN-001: Access Dashboard as Admin
- **Priority:** Critical
- **Type:** @smoke
- **Preconditions:** Admin user logged in
- **Test Steps:**
  1. Login with admin credentials
  2. Navigate to /dashboard
- **Expected Results:**
  - Dashboard accessible
  - Admin panels visible
  - Books and Orders tabs shown

### TC-ADMIN-002: Access Dashboard as Non-Admin
- **Priority:** Critical
- **Type:** @functional @security
- **Preconditions:** Regular user logged in
- **Test Steps:**
  1. Login as regular user
  2. Try to access /dashboard
- **Expected Results:**
  - Access denied
  - Redirect to unauthorized page
  - Error message displayed

### TC-ADMIN-003: View Dashboard Statistics
- **Priority:** High
- **Type:** @functional
- **Test Steps:**
  1. Access dashboard as admin
  2. Switch to Orders tab
  3. View statistics
- **Expected Results:**
  - Total orders count shown
  - Total revenue displayed
  - Paid orders count
  - Delivered orders count

### TC-ADMIN-004: Add New Book
- **Priority:** Critical
- **Type:** @smoke @regression
- **Test Steps:**
  1. Go to Books tab
  2. Click "Add New Book"
  3. Fill: name, author, description, category, price, quantity
  4. Click "Create Book"
- **Expected Results:**
  - Book added successfully
  - Success notification
  - Book appears in table
  - Form closes

### TC-ADMIN-005: Add Book with Missing Fields
- **Priority:** High
- **Type:** @functional
- **Test Steps:**
  1. Click Add New Book
  2. Leave required fields empty
  3. Try to submit
- **Expected Results:**
  - Validation errors shown
  - Form not submitted
  - All required fields marked

### TC-ADMIN-006: Edit Existing Book
- **Priority:** High
- **Type:** @functional @regression
- **Test Steps:**
  1. Select a book
  2. Click "Edit"
  3. Modify fields
  4. Click "Update Book"
- **Expected Results:**
  - Book updated successfully
  - Changes reflected in table
  - Success notification

### TC-ADMIN-007: Delete Book
- **Priority:** High
- **Type:** @functional
- **Test Steps:**
  1. Select a book
  2. Click "Delete"
  3. Confirm deletion
- **Expected Results:**
  - Confirmation modal appears
  - After confirming: book deleted
  - Success message
  - Book removed from table

### TC-ADMIN-008: Cancel Delete Operation
- **Priority:** Medium
- **Type:** @functional
- **Test Steps:**
  1. Click Delete on a book
  2. Click "Cancel" in modal
- **Expected Results:**
  - Modal closes
  - Book NOT deleted
  - Still in table

### TC-ADMIN-009: View All Orders
- **Priority:** High
- **Type:** @functional
- **Test Steps:**
  1. Switch to Orders tab
  2. View orders table
- **Expected Results:**
  - All orders displayed
  - Shows: Order ID, User, Date, Total, Status
  - Can view details

### TC-ADMIN-010: Admin Panel Responsiveness
- **Priority:** Low
- **Type:** @regression
- **Test Steps:**
  1. Access dashboard on mobile
  2. Test all features
- **Expected Results:**
  - Dashboard responsive
  - Tables scrollable
  - Forms usable
  - All buttons accessible

---

## 6. Performance Testing (5 Test Cases)

### TC-PERF-001: Page Load Time - Home Page
- **Priority:** High
- **Type:** @performance
- **Test Steps:**
  1. Measure home page load time
- **Expected Results:**
  - Load time < 3 seconds
  - First Contentful Paint < 1.5s
  - Time to Interactive < 3s

### TC-PERF-002: Page Load Time - Books Page
- **Priority:** High
- **Type:** @performance
- **Test Steps:**
  1. Measure books page load time
- **Expected Results:**
  - Load time < 4 seconds (with multiple books)
  - Smooth scrolling
  - No lag

### TC-PERF-003: API Response Time
- **Priority:** Medium
- **Type:** @performance
- **Test Steps:**
  1. Measure API endpoints response time
- **Expected Results:**
  - GET requests < 500ms
  - POST requests < 1s
  - Database queries optimized

### TC-PERF-004: Cart Operations Performance
- **Priority:** Medium
- **Type:** @performance
- **Test Steps:**
  1. Add/remove items rapidly
  2. Measure update time
- **Expected Results:**
  - Cart updates < 200ms
  - No UI freezing
  - Smooth animations

### TC-PERF-005: Concurrent User Load
- **Priority:** Low
- **Type:** @performance
- **Test Steps:**
  1. Simulate 50 concurrent users
  2. Monitor performance
- **Expected Results:**
  - No errors under load
  - Response times acceptable
  - Server stable

---

## 7. Security Testing (5 Test Cases)

### TC-SEC-001: SQL Injection Prevention
- **Priority:** Critical
- **Type:** @security
- **Test Steps:**
  1. Enter SQL injection payloads in forms
  2. Try: `' OR '1'='1`
- **Expected Results:**
  - SQL injection blocked
  - Input sanitized
  - No database errors

### TC-SEC-002: XSS Prevention
- **Priority:** Critical
- **Type:** @security
- **Test Steps:**
  1. Enter XSS payloads: `<script>alert('XSS')</script>`
  2. Submit in forms
- **Expected Results:**
  - Scripts not executed
  - Input escaped
  - No alert boxes

### TC-SEC-003: CSRF Protection
- **Priority:** High
- **Type:** @security
- **Test Steps:**
  1. Check form submissions
  2. Verify CSRF tokens
- **Expected Results:**
  - CSRF tokens present
  - Requests validated
  - Protection active

### TC-SEC-004: Authentication Headers
- **Priority:** High
- **Type:** @security
- **Test Steps:**
  1. Check HTTP response headers
- **Expected Results:**
  - Security headers present:
    - X-Frame-Options
    - X-Content-Type-Options
    - Strict-Transport-Security

### TC-SEC-005: Password Security
- **Priority:** Critical
- **Type:** @security
- **Test Steps:**
  1. Check password storage
  2. Verify hashing
- **Expected Results:**
  - Passwords hashed (bcrypt)
  - Not stored in plain text
  - Minimum length enforced

---

## Test Execution Summary

### Coverage Matrix

| Module | Test Cases | Critical | High | Medium | Low |
|--------|-----------|----------|------|--------|-----|
| Authentication | 10 | 2 | 5 | 2 | 1 |
| Books Management | 10 | 2 | 4 | 3 | 1 |
| Shopping Cart | 10 | 3 | 4 | 3 | 0 |
| Checkout Process | 12 | 4 | 5 | 3 | 0 |
| Admin Dashboard | 10 | 3 | 4 | 2 | 1 |
| Performance | 5 | 0 | 2 | 2 | 1 |
| Security | 5 | 3 | 2 | 0 | 0 |
| **TOTAL** | **62** | **17** | **26** | **15** | **4** |

### Test Types Distribution
- **Smoke Tests:** 12
- **Functional Tests:** 40
- **Regression Tests:** 15
- **Performance Tests:** 5
- **Security Tests:** 5

### Browser Compatibility
All tests executed on:
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari/WebKit
- ✅ Mobile Chrome
- ✅ Mobile Safari

---

## Test Data Requirements

### User Accounts
```
Regular User:
- Email: test@example.com
- Password: password123
- Name: Test User

Admin User:
- Email: admin@example.com
- Password: admin123
- Name: Admin User
```

### Sample Books
```
Book 1:
- Name: "Harry Potter and the Sorcerer's Stone"
- Author: "J.K. Rowling"
- Category: "Fiction"
- Price: $19.99
- Quantity: 10

Book 2:
- Name: "The Great Gatsby"
- Author: "F. Scott Fitzgerald"
- Category: "Classic"
- Price: $14.99
- Quantity: 15
```

---

## Execution Environment

- **Operating System:** Windows 10/11, macOS, Linux
- **Browsers:** Chrome 120+, Firefox 120+, Safari 17+
- **Node.js:** v18.0.0+
- **Test Framework:** Playwright 1.40.0+
- **Language:** TypeScript 5.3+

---

*Document Version: 1.0*  
*Last Updated: December 2024*  
*Prepared By: SQE Testing Team*