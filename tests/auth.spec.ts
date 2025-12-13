import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

test.describe('Authentication Tests @functional', () => {
  
  test('TC-AUTH-001: User registration with valid data @smoke', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const uniqueEmail = `testuser${Date.now()}@example.com`;
    
    await registerPage.goto();
    await registerPage.verifyRegisterPageElements();
    await registerPage.register('Test User', uniqueEmail, 'password123', 'password123');
    
    // Expect to stay on register page only if there is an error
    const hasError = await registerPage.checkPasswordMismatchError();
    expect(hasError).toBeFalsy();
  });

  test('TC-AUTH-002: User registration with password mismatch @functional', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    
    await registerPage.goto();
    await registerPage.register('Test User', 'test@example.com', 'password123', 'password456');
    
    // Password mismatch error should be visible
    const hasError = await registerPage.checkPasswordMismatchError();
    expect(hasError).toBeTruthy();
  });

  test('TC-AUTH-003: User registration with invalid email format @functional', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    
    await registerPage.goto();
    await registerPage.register('Test User', 'invalid-email', 'password123', 'password123');
    
    // Email validation error
    const errors = await registerPage.getErrorMessages();
    expect(errors.some(e => e.includes('valid email'))).toBeTruthy();
  });

  test('TC-AUTH-004: User registration with short password @functional', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    
    await registerPage.goto();
    await registerPage.register('Test User', 'test@example.com', '123', '123');
    
    // Password length validation error
    const errors = await registerPage.getErrorMessages();
    expect(errors.some(e => e.includes('6 characters'))).toBeTruthy();
  });

  test('TC-AUTH-005: User login with valid credentials @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.verifyLoginPageElements();
    
    await loginPage.login('test@example.com', 'password123');
    
    // Verify successful login
    const isLoggedIn = await loginPage.isLoggedIn();
    expect(isLoggedIn).toBeTruthy();
  });

  test('TC-AUTH-006: User login with invalid credentials @functional', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.login('wrong@example.com', 'wrongpassword');
    
    // Verify error message is visible
    const hasError = await loginPage.hasErrorContaining('Invalid credentials');
    expect(hasError).toBeTruthy();
  });

  test('TC-AUTH-007: User login with empty fields @functional', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.click('button[type="submit"]');
    
    // Validation errors should appear
    const hasError = await loginPage.hasErrorContaining('Please provide your email address');
    expect(hasError).toBeTruthy();
  });

  test('TC-AUTH-008: Navigation between login and register pages @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const registerPage = new RegisterPage(page);
    
    await loginPage.goto();
    await expect(page.locator('h2')).toContainText('Login');
    
    await loginPage.goToRegister();
    await expect(page.locator('h2')).toContainText('Register');
    
    await registerPage.goToLogin();
    await expect(page.locator('h2')).toContainText('Login');
  });

  test('TC-AUTH-009: Password field security (masked input) @functional', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    
    const isMasked = await loginPage.isPasswordMasked();
    expect(isMasked).toBeTruthy();
  });

  test('TC-AUTH-010: Session persistence after login @regression', async ({ page, context }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.login('test@example.com', 'password123');
    
    const isLoggedIn = await loginPage.isLoggedIn();
    expect(isLoggedIn).toBeTruthy();
    
    const newPage = await context.newPage();
    await newPage.goto(loginPage['baseURL']);
    const newLoginPage = new LoginPage(newPage);
    const stillLoggedIn = await newLoginPage.isLoggedIn();
    expect(stillLoggedIn).toBeTruthy();
    
    await newPage.close();
  });

});
