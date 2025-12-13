import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Login Page Object Model
 */
export class LoginPage extends BasePage {
  private emailInput = '#email';
  private passwordInput = '#password';
  private loginButton = 'button[type="submit"]';
  private registerLink = '#register_link';
  private errorMessage = 'span[class*="error"]';
  private headerUserName = 'nav ul li span[aria-hidden]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to login page
   */
  async goto() {
    await this.navigate('/login');
  }

  /**
   * Fill login form and submit
   */
  async login(email: string, password: string) {
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
    // Wait a bit for validation errors or page navigation
    await this.page.waitForTimeout(500);
  }

  /**
   * Admin login for tests
   */
  async adminLogin() {
    await this.fill(this.emailInput, 'admin@example.com');
    await this.fill(this.passwordInput, 'admin123');
    await this.click(this.loginButton);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if user is logged in
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      await this.waitForElement(this.headerUserName, 5000);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if any validation or login error is visible
   */
  async hasErrorContaining(text: string): Promise<boolean> {
    const locator = this.page.locator(`text=${text}`);
    try {
      await locator.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get first error message text
   */
  async getErrorMessage(): Promise<string> {
    try {
      return await this.page.locator(this.errorMessage).first().textContent() || '';
    } catch {
      return '';
    }
  }

  /**
   * Navigate to register page
   */
  async goToRegister() {
    await this.click(this.registerLink);
    await this.page.waitForURL('/register');
  }

  /**
   * Verify all login page elements are visible
   */
  async verifyLoginPageElements() {
    await expect(this.page.locator('h2')).toContainText('Login');
    await expect(this.page.locator(this.emailInput)).toBeVisible();
    await expect(this.page.locator(this.passwordInput)).toBeVisible();
    await expect(this.page.locator(this.loginButton)).toBeVisible();
    await expect(this.page.locator(this.registerLink)).toBeVisible();
  }

  /**
   * Check if password input type is 'password' (masked)
   */
  async isPasswordMasked(): Promise<boolean> {
    const type = await this.page.locator(this.passwordInput).getAttribute('type');
    return type === 'password';
  }
}
