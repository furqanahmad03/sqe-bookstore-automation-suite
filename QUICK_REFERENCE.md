# Quick Reference Guide
## SQE Assignment - Bookstore Test Automation

---

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Create project folder
mkdir bookstore-automation && cd bookstore-automation

# 2. Initialize project
npm init -y

# 3. Install dependencies
npm install -D @playwright/test typescript @types/node ts-node
npm install axios lighthouse

# 4. Install browsers
npx playwright install

# 5. Create folder structure
mkdir -p tests/pages tests/performance tests/security .github/workflows test-results/screenshots

# 6. Copy all provided files to their respective folders

# 7. Update configuration
# Edit playwright.config.ts - set your BASE_URL
# Edit test files - set your credentials

# 8. Run tests
npm run test:ui
```

---

## 📁 Files You Need to Create

### 1. Configuration Files (Root Directory)
```
✅ playwright.config.ts       - Main Playwright configuration
✅ package.json               - Dependencies and scripts
✅ tsconfig.json              - TypeScript configuration
✅ .gitignore                 - Git ignore file
```

### 2. Page Object Models (tests/pages/)
```
✅ BasePage.ts                - Base page with common methods
✅ LoginPage.ts               - Login page interactions
✅ RegisterPage.ts            - Registration page
✅ BooksPage.ts               - Books browsing page
✅ CartPage.ts                - Shopping cart page
✅ CheckoutPage.ts            - Checkout process
✅ AdminPage.ts               - Admin dashboard
```

### 3. Test Specifications (tests/)
```
✅ auth.spec.ts               - Authentication tests (10 tests)
✅ books.spec.ts              - Books management tests (10 tests)
✅ cart.spec.ts               - Cart functionality tests (10 tests)
✅ checkout.spec.ts           - Checkout process tests (12 tests)
✅ admin.spec.ts              - Admin dashboard tests (10 tests)
```

### 4. Performance & Security (tests/)
```
✅ performance/performance-tests.ts    - Performance testing
✅ security/security-tests.ts          - Security testing
```

### 5. CI/CD (.github/workflows/)
```
✅ playwright.yml             - GitHub Actions workflow
```

### 6. Documentation (Root Directory)
```
✅ README.md                  - Project overview
✅ TEST_CASES.md              - All 50+ test cases documented
✅ EXECUTION_REPORT.md        - Test execution report template
✅ COMPLETE_SETUP_GUIDE.md    - Detailed setup instructions
✅ QUICK_REFERENCE.md         - This file!
```

---

## ⚙️ Critical Configuration Steps

### Step 1: Update BASE_URL
**File:** `playwright.config.ts`
```typescript
use: {
  baseURL: 'http://localhost:3000',  // 👈 Change this!
}
```

### Step 2: Create Test Users
Add these users to your MongoDB database:
```javascript
// Regular User
{
  name: "Test User",
  email: "test@example.com",
  password: bcrypt.hashSync("password123", 10),
  isAdmin: false
}

// Admin User
{
  name: "Admin User",
  email: "admin@example.com",
  password: bcrypt.hashSync("admin123", 10),
  isAdmin: true
}
```

### Step 3: Update Selectors
**Most Important!** Update selectors in Page Objects to match your HTML:

**Example - LoginPage.ts:**
```typescript
// Find your actual selectors using browser DevTools
private emailInput = '#email';        // 👈 Update if different
private passwordInput = '#password';  // 👈 Update if different
private loginButton = 'button[type="submit"]'; // 👈 Update if different
```

**How to find selectors:**
1. Open your app in Chrome
2. Right-click element → Inspect
3. Look for `id` or `class` attributes
4. Update in Page Object files

---

## 🧪 Test Commands Cheatsheet

### Essential Commands
```bash
npm test                    # Run all tests
npm run test:ui             # Interactive mode (BEST for learning!)
npm run test:headed         # See browser while testing
npm run test:debug          # Debug mode
npm run report              # View HTML report
```

### Run Specific Test Suites
```bash
npm run test:auth           # Authentication tests only
npm run test:books          # Books tests only
npm run test:cart           # Cart tests only
npm run test:checkout       # Checkout tests only
npm run test:admin          # Admin tests only
```

### Run by Test Type
```bash
npm run test:smoke          # Critical tests (fast!)
npm run test:functional     # All functional tests
npm run test:regression     # Regression suite
```

### Run in Specific Browsers
```bash
npm run test:chromium       # Chrome only
npm run test:firefox        # Firefox only
npm run test:webkit         # Safari only
npm run test:mobile         # Mobile browsers
```

### Performance & Security
```bash
npm run test:performance    # Performance metrics
npm run test:security       # Security checks
npm run test:all            # Everything!
```

---

## 🐛 Common Issues & Quick Fixes

### Issue 1: "Element not found"
**Cause:** Selectors don't match your HTML  
**Fix:** Update selectors in Page Object files
```bash
# Use codegen to help find selectors
npm run codegen
```

### Issue 2: "Timeout waiting for element"
**Cause:** Page loads slowly  
**Fix:** Increase timeout in `playwright.config.ts`
```typescript
timeout: 60 * 1000,  // Change from 30s to 60s
```

### Issue 3: "Invalid credentials"
**Cause:** Test users don't exist in database  
**Fix:** Create test users (see Step 2 above)

### Issue 4: "Port 3000 already in use"
**Fix:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Issue 5: Tests pass locally, fail in CI/CD
**Fix:** Check environment variables and BASE_URL in GitHub Actions

---

## 📊 Understanding Test Results

### Console Output
```
✓ = Test passed
✗ = Test failed
⊘ = Test skipped

Running 50 tests using 4 workers
  ✓ TC-AUTH-001: User registration (2.5s)
  ✓ TC-AUTH-002: User login (1.8s)
  ✗ TC-CART-003: Add to cart (failed)
```

### Where to Find Results
```
test-results/
  ├── results.json          # Raw test data
  ├── junit.xml             # For CI/CD integration
  ├── screenshots/          # Failure screenshots
  └── videos/               # Failure videos

playwright-report/
  └── index.html            # 👈 Open this in browser!
```

### Viewing HTML Report
```bash
npm run report
# OR manually open: playwright-report/index.html
```

---

## 📝 Assignment Submission Checklist

### Before Submission
- [ ] All tests passing (at least smoke tests)
- [ ] HTML report generated
- [ ] Screenshots taken
- [ ] Execution report filled
- [ ] CI/CD pipeline working
- [ ] All documentation complete
- [ ] Code properly commented

### What to Submit
1. **Source Code**
   - All `.ts` test files
   - Page Object Models
   - Configuration files
   
2. **Documentation**
   - README.md
   - TEST_CASES.md (50+ cases)
   - EXECUTION_REPORT.md (with evidence)
   - SETUP_GUIDE.md
   
3. **Test Reports**
   - HTML report (playwright-report/)
   - Screenshots of passing tests
   - Performance report
   - Security report
   
4. **CI/CD Evidence**
   - GitHub Actions workflow file
   - Screenshot of successful pipeline run
   - Link to GitHub repository

---

## 🎯 Grading Criteria Quick Check

### Implementation (40 points)
- ✅ Playwright configured properly (5 pts)
- ✅ 50+ test cases implemented (15 pts)
- ✅ Page Object Model used (10 pts)
- ✅ All features covered (10 pts)

### Documentation (60 points)
- ✅ Test cases documented (15 pts)
- ✅ Execution reports with evidence (15 pts)
- ✅ Code documentation (10 pts)
- ✅ Performance metrics (10 pts)
- ✅ Security testing (10 pts)

**Target Score: 95-100/100**

---

## 🔍 Selector Finding Guide

### Using Chrome DevTools
1. Right-click on element → "Inspect"
2. Note the attributes:
   ```html
   <input id="email" name="email" class="input-field" />
   ```
3. Choose selector:
   - By ID: `#email` (best!)
   - By name: `input[name="email"]`
   - By class: `.input-field`

### Using Playwright Inspector
```bash
npm run codegen
```
- Click on elements
- Playwright suggests selectors
- Copy to your Page Objects

### Selector Priority
1. **ID** (best): `#email`
2. **Name**: `input[name="email"]`
3. **Test IDs**: `[data-testid="email-input"]`
4. **Classes**: `.email-input` (less reliable)
5. **Text**: `button:has-text("Login")` (fallback)

---

## ⏱️ Time Estimates

### Setup Phase
- Initial setup: 30 minutes
- Configuration: 15 minutes
- Selector updates: 1-2 hours
- **Total: 2-3 hours**

### Testing Phase
- Running all tests: 5-10 minutes
- Fixing failures: 1-2 hours
- Documentation: 1-2 hours
- **Total: 2-4 hours**

### Total Project Time: 4-7 hours

---

## 🎓 Pro Tips

### Tip 1: Start with Smoke Tests
```bash
npm run test:smoke
```
These are the most critical tests. Get these passing first!

### Tip 2: Use Interactive Mode
```bash
npm run test:ui
```
Best way to debug and understand tests!

### Tip 3: Test One Suite at a Time
```bash
npm run test:auth    # Master auth first
npm run test:books   # Then books
# ... continue
```

### Tip 4: Take Screenshots Early
Document your passing tests as you go!

### Tip 5: Read Error Messages
Playwright gives VERY detailed error messages with:
- What went wrong
- Where it happened
- Screenshots
- Suggested fixes

---

## 📞 Need Help?

### Resources
1. **Playwright Docs**: https://playwright.dev/
2. **TypeScript Docs**: https://www.typescriptlang.org/
3. **This Project**: Check COMPLETE_SETUP_GUIDE.md

### Debug Steps
1. Check error message in console
2. Look at failure screenshot
3. Verify selector exists in your HTML
4. Test in headed mode: `npm run test:headed`
5. Use inspector: `npm run test:debug`

---

## ✅ Success Criteria

### You're Ready to Submit When:
- [x] All smoke tests passing
- [x] Most functional tests passing (>80%)
- [x] HTML report looks good
- [x] Documentation complete
- [x] CI/CD pipeline running
- [x] No critical issues
- [x] Code is clean and commented
- [x] Screenshots captured
- [x] Confident in your work!

---

## 🚦 Getting Started NOW

```bash
# 1. Create folder
mkdir bookstore-automation && cd bookstore-automation

# 2. Copy this into terminal:
npm init -y && \
npm install -D @playwright/test typescript @types/node ts-node && \
npm install axios lighthouse && \
npx playwright install && \
mkdir -p tests/pages tests/performance tests/security .github/workflows

# 3. Copy all provided files

# 4. Update playwright.config.ts (BASE_URL)

# 5. Run first test
npm run test:ui

# 🎉 You're testing!
```

---

*Quick Reference Version 1.0*  
*For SQE Assignment - December 2024*

**Good luck! You've got this! 🚀**