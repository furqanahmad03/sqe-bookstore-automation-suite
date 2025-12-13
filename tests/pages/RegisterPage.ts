import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Register Page Object Model
 */
export class RegisterPage extends BasePage {
  // Locators
  readonly nameInput = this.page.locator('#name');
  readonly emailInput = this.page.locator('#email');
  readonly passwordInput = this.page.locator('#password');
  readonly confirmPasswordInput = this.page.locator('#confirm_password');
  readonly registerButton = this.page.locator('button[type="submit"]');
  readonly loginLink = this.page.locator('#login_link');
  readonly alertMessages = this.page.getByRole('alert');

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to register page
   */
  async goto() {
    await this.navigate('/register');
  }

  /**
   * Fill registration form and submit
   */
  async register(
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword);
    await this.registerButton.click();
    // Wait a bit for validation errors or navigation
    await this.page.waitForTimeout(500);
  }

  /**
   * Quick register with valid data
   */
  async quickRegister(uniqueEmail?: string) {
    const email = uniqueEmail || `test${Date.now()}@example.com`;
    await this.register('Test User', email, 'password123', 'password123');
  }

  /**
   * Navigate to login page
   */
  async goToLogin() {
    await this.loginLink.click();
    await this.page.waitForURL('/login');
  }

  /**
   * Verify all register page elements are visible
   */
  async verifyRegisterPageElements() {
    await expect(this.page.locator('h2')).toContainText('Register');
    await expect(this.nameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.confirmPasswordInput).toBeVisible();
    await expect(this.registerButton).toBeVisible();
    await expect(this.loginLink).toBeVisible();
  }

  /**
   * Get all visible error messages (validation or custom)
   */
  async getErrorMessages(): Promise<string[]> {
    const alerts = await this.alertMessages.all();
    return await Promise.all(alerts.map(a => a.textContent() || '') as unknown as string[]);
  }

  /**
   * Check if any error is visible
   */
  async hasError(): Promise<boolean> {
    const errors = this.page.locator('span[class*="error"], [role="alert"]');
    try {
      await errors.first().waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if password mismatch error is displayed
   */
  async checkPasswordMismatchError(): Promise<boolean> {
    const locator = this.page.locator('text=Password Does not match');
    try {
      await locator.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }
  

  /**
   * Check if error containing specific text exists
   */
  async hasErrorContaining(text: string): Promise<boolean> {
    const locator = this.page.locator('span[class*="error"], [role="alert"]');
    try {
      await locator.filter({ hasText: text }).first().waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }
}
