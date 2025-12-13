import { Page, Locator, expect } from '@playwright/test';

/**
 * Base Page Object Model
 * Contains common methods used across all pages
 */
export class BasePage {
  protected page: Page;
  protected baseURL: string;

  constructor(page: Page) {
    this.page = page;
    this.baseURL = process.env.BASE_URL || 'http://localhost:3000';
  }

  /**
   * Navigate to a specific path
   */
  async navigate(path: string = '') {
    await this.page.goto(`${this.baseURL}${path}`);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click on an element
   */
  async click(selector: string | Locator) {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await locator.click();
  }

  /**
   * Fill input field
   */
  async fill(selector: string | Locator, value: string) {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await locator.fill(value);
  }

  /**
   * Get text content
   */
  async getText(selector: string | Locator): Promise<string> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    return await locator.textContent() || '';
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(selector: string | Locator, timeout: number = 10000) {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Check if element is visible
   */
  async isVisible(selector: string | Locator): Promise<boolean> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    return await locator.isVisible();
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}.png`,
      fullPage: true 
    });
  }

  /**
   * Wait for navigation
   */
  async waitForNavigation() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  getCurrentURL(): string {
    return this.page.url();
  }

  /**
   * Wait for timeout
   */
  async wait(ms: number) {
    await this.page.waitForTimeout(ms);
  }

  /**
   * Reload page
   */
  async reload() {
    await this.page.reload();
    await this.waitForNavigation();
  }

  /**
   * Press key
   */
  async pressKey(key: string) {
    await this.page.keyboard.press(key);
  }

  /**
   * Get element count
   */
  async getElementCount(selector: string): Promise<number> {
    return await this.page.locator(selector).count();
  }

  /**
   * Verify notification message
   */
  async verifyNotification(expectedMessage: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') {
    const notification = this.page.locator('.notification').filter({ hasText: expectedMessage });
    await expect(notification).toBeVisible({ timeout: 5000 });
  }
}