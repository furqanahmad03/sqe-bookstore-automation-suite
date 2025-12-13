import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Admin Page Object Model (Updated with data-testid selectors)
 * Handles admin dashboard functionality
 */
export class AdminPage extends BasePage {
  // Main Dashboard Selectors
  private dashboardContainer = '[data-testid="dashboard-container"]';
  private dashboardTitle = '[data-testid="dashboard-title"]';
  private dashboardTabs = '[data-testid="dashboard-tabs"]';
  private loadingContainer = '[data-testid="loading-container"]';
  
  // Tab Selectors
  private booksTab = '[data-testid="books-tab"]';
  private ordersTab = '[data-testid="orders-tab"]';
  
  // Books Section Selectors
  private booksSection = '[data-testid="books-section"]';
  private booksSectionTitle = '[data-testid="books-section-title"]';
  private addBookButton = '[data-testid="add-book-button"]';
  private bookFormCard = '[data-testid="book-form-card"]';
  private bookForm = '[data-testid="book-form"]';
  private formTitle = '[data-testid="form-title"]';
  
  // Book Form Input Selectors
  private bookNameInput = '[data-testid="book-name-input"]';
  private bookAuthorInput = '[data-testid="book-author-input"]';
  private bookDescriptionInput = '[data-testid="book-description-input"]';
  private bookCategoryInput = '[data-testid="book-category-input"]';
  private bookPriceInput = '[data-testid="book-price-input"]';
  private bookQuantityInput = '[data-testid="book-quantity-input"]';
  private submitBookButton = '[data-testid="submit-book-button"]';
  private cancelBookButton = '[data-testid="cancel-book-button"]';
  
  // Books Table Selectors
  private booksTable = '[data-testid="books-table"]';
  private booksLoading = '[data-testid="books-loading"]';
  private booksError = '[data-testid="books-error"]';
  private booksEmptyState = '[data-testid="books-empty-state"]';
  
  // Orders Section Selectors
  private ordersSection = '[data-testid="orders-section"]';
  private ordersSectionTitle = '[data-testid="orders-section-title"]';
  private ordersTable = '[data-testid="orders-table"]';
  private ordersLoading = '[data-testid="orders-loading"]';
  private ordersError = '[data-testid="orders-error"]';
  private ordersEmptyState = '[data-testid="orders-empty-state"]';
  
  // Order Stats Selectors
  private orderStats = '[data-testid="order-stats"]';
  private statTotalOrders = '[data-testid="stat-total-orders-value"]';
  private statTotalRevenue = '[data-testid="stat-total-revenue-value"]';
  private statPaidOrders = '[data-testid="stat-paid-orders-value"]';
  private statDeliveredOrders = '[data-testid="stat-delivered-orders-value"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to admin dashboard
   */
  async goto() {
    await this.navigate('/dashboard');
  }

  /**
   * Switch to Books tab
   */
  async switchToBooksTab() {
    await this.click(this.booksTab);
    await this.wait(500);
  }

  /**
   * Switch to Orders tab
   */
  async switchToOrdersTab() {
    await this.click(this.ordersTab);
    await this.wait(500);
  }

  /**
   * Check if Books tab is active
   */
  async isBooksTabActive(): Promise<boolean> {
    const isActive = await this.page.locator(this.booksTab).getAttribute('data-active');
    return isActive === 'true';
  }

  /**
   * Check if Orders tab is active
   */
  async isOrdersTabActive(): Promise<boolean> {
    const isActive = await this.page.locator(this.ordersTab).getAttribute('data-active');
    return isActive === 'true';
  }

  /**
   * Click Add New Book button
   */
  async clickAddNewBook() {
    await this.click(this.addBookButton);
    await this.wait(500);
  }

  /**
   * Check if book form is visible
   */
  async isBookFormVisible(): Promise<boolean> {
    return await this.isVisible(this.bookFormCard);
  }

  /**
   * Fill book form
   */
  async fillBookForm(
    name: string,
    author: string,
    description: string,
    category: string,
    price: string,
    quantity: string
  ) {
    await this.fill(this.bookNameInput, name);
    await this.fill(this.bookAuthorInput, author);
    await this.fill(this.bookDescriptionInput, description);
    await this.fill(this.bookCategoryInput, category);
    await this.fill(this.bookPriceInput, price);
    await this.fill(this.bookQuantityInput, quantity);
  }

  /**
   * Submit book form
   */
  async submitBookForm() {
    await this.click(this.submitBookButton);
    await this.wait(1000);
  }

  /**
   * Cancel book form
   */
  async cancelBookForm() {
    await this.click(this.cancelBookButton);
    await this.wait(500);
  }

  /**
   * Create new book
   */
  async createBook(
    name: string,
    author: string,
    description: string,
    category: string,
    price: string,
    quantity: string
  ) {
    await this.clickAddNewBook();
    await this.fillBookForm(name, author, description, category, price, quantity);
    await this.submitBookForm();
  }

  /**
   * Get book index by name
   */
  private async getBookIndexByName(bookName: string): Promise<number> {
    const count = await this.page.locator('[data-testid^="book-row-"]').count();
    for (let i = 0; i < count; i++) {
      const name = await this.page.locator(`[data-testid="book-name-${i}"]`).textContent();
      if (name?.includes(bookName)) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Edit book by index
   */
  async editBookByIndex(index: number, newData: Partial<{
    name: string,
    author: string,
    description: string,
    category: string,
    price: string,
    quantity: string
  }>) {
    await this.page.locator(`[data-testid="edit-book-${index}"]`).click();
    await this.wait(500);

    if (newData.name) await this.fill(this.bookNameInput, newData.name);
    if (newData.author) await this.fill(this.bookAuthorInput, newData.author);
    if (newData.description) await this.fill(this.bookDescriptionInput, newData.description);
    if (newData.category) await this.fill(this.bookCategoryInput, newData.category);
    if (newData.price) await this.fill(this.bookPriceInput, newData.price);
    if (newData.quantity) await this.fill(this.bookQuantityInput, newData.quantity);

    await this.submitBookForm();
  }

  /**
   * Edit book by name
   */
  async editBook(bookName: string, newData: Partial<{
    name: string,
    author: string,
    description: string,
    category: string,
    price: string,
    quantity: string
  }>) {
    const index = await this.getBookIndexByName(bookName);
    if (index !== -1) {
      await this.editBookByIndex(index, newData);
    }
  }

  /**
   * Delete book by index
   */
  async deleteBookByIndex(index: number, confirmDeletion: boolean = true) {
    await this.page.locator(`[data-testid="delete-book-${index}"]`).click();
    await this.wait(500);
  
    if (confirmDeletion) {
      // Click confirm button by text
      await this.page.getByRole('button', { name: 'Confirm' }).click();
      await this.wait(1000);
    } else {
      // Click cancel button by text
      await this.page.getByRole('button', { name: 'Cancel' }).click();
    }
  }

  /**
   * Delete book by name
   */
  async deleteBook(bookName: string, confirmDeletion: boolean = true) {
    const index = await this.getBookIndexByName(bookName);
    if (index !== -1) {
      await this.deleteBookByIndex(index, confirmDeletion);
    }
  }

  /**
   * Get number of books in table
   */
  async getBooksCount(): Promise<number> {
    return await this.page.locator('[data-testid^="book-row-"]').count();
  }

  /**
   * Get number of orders
   */
  async getOrdersCount(): Promise<number> {
    return await this.page.locator('[data-testid^="order-row-"]').count();
  }

  /**
   * Check if book exists by name
   */
  async bookExists(bookName: string): Promise<boolean> {
    const index = await this.getBookIndexByName(bookName);
    return index !== -1;
  }

  /**
   * Get book data by index
   */
  async getBookDataByIndex(index: number): Promise<{
    name: string;
    author: string;
    category: string;
    price: string;
    quantity: string;
  }> {
    const name = await this.getText(`[data-testid="book-name-${index}"]`);
    const author = await this.getText(`[data-testid="book-author-${index}"]`);
    const category = await this.getText(`[data-testid="book-category-${index}"]`);
    const price = await this.getText(`[data-testid="book-price-${index}"]`);
    const quantity = await this.getText(`[data-testid="book-quantity-${index}"]`);

    return { name, author, category, price, quantity };
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<{
    totalOrders: string,
    totalRevenue: string,
    paidOrders: string,
    deliveredOrders: string
  }> {
    await this.switchToOrdersTab();
    
    // Check if stats are visible
    const hasStats = await this.isVisible(this.orderStats);
    if (!hasStats) {
      return {
        totalOrders: '0',
        totalRevenue: '$0.00',
        paidOrders: '0',
        deliveredOrders: '0'
      };
    }

    const totalOrders = await this.getText(this.statTotalOrders);
    const totalRevenue = await this.getText(this.statTotalRevenue);
    const paidOrders = await this.getText(this.statPaidOrders);
    const deliveredOrders = await this.getText(this.statDeliveredOrders);

    return { totalOrders, totalRevenue, paidOrders, deliveredOrders };
  }

  /**
   * Get order data by index
   */
  async getOrderDataByIndex(index: number): Promise<{
    orderId: string;
    user: string;
    date: string;
    total: string;
    paid: string;
    delivered: string;
  }> {
    const orderId = await this.getText(`[data-testid="order-id-${index}"]`);
    const user = await this.getText(`[data-testid="order-user-${index}"]`);
    const date = await this.getText(`[data-testid="order-date-${index}"]`);
    const total = await this.getText(`[data-testid="order-total-${index}"]`);
    const paid = await this.getText(`[data-testid="order-paid-${index}"]`);
    const delivered = await this.getText(`[data-testid="order-delivered-${index}"]`);

    return { orderId, user, date, total, paid, delivered };
  }

  /**
   * Click view order details
   */
  async viewOrderDetails(index: number) {
    await this.page.locator(`[data-testid="view-order-${index}"]`).click();
    await this.waitForNavigation();
  }

  /**
   * Verify admin dashboard elements
   */
  async verifyAdminDashboardElements() {
    await expect(this.page.locator(this.dashboardTitle)).toContainText('Admin Dashboard');
    await expect(this.page.locator(this.dashboardTabs)).toBeVisible();
    await expect(this.page.locator(this.booksTab)).toBeVisible();
    await expect(this.page.locator(this.ordersTab)).toBeVisible();
  }

  /**
   * Verify books tab elements
   */
  async verifyBooksTabElements() {
    await this.switchToBooksTab();
    await expect(this.page.locator(this.booksSectionTitle)).toContainText('Books Management');
    
    const hasForm = await this.isBookFormVisible();
    if (!hasForm) {
      await expect(this.page.locator(this.addBookButton)).toBeVisible();
    }
  }

  /**
   * Verify orders tab elements
   */
  async verifyOrdersTabElements() {
    await this.switchToOrdersTab();
    await expect(this.page.locator(this.ordersSectionTitle)).toContainText('Orders Management');
  }

  /**
   * Check if user can access admin page
   */
  async canAccessAdminPage(): Promise<boolean> {
    try {
      await this.goto();
      await this.page.waitForURL(/dashboard|unauthorized/, { timeout: 5000 });
      return this.getCurrentURL().includes('dashboard');
    } catch {
      return false;
    }
  }

  /**
   * Verify books table is visible
   */
  async verifyBooksTableVisible() {
    await expect(this.page.locator(this.booksTable)).toBeVisible();
  }

  /**
   * Verify orders table is visible
   */
  async verifyOrdersTableVisible() {
    await expect(this.page.locator(this.ordersTable)).toBeVisible();
  }

  /**
   * Check if books section is empty
   */
  async isBooksEmpty(): Promise<boolean> {
    return await this.isVisible(this.booksEmptyState);
  }

  /**
   * Check if orders section is empty
   */
  async isOrdersEmpty(): Promise<boolean> {
    return await this.isVisible(this.ordersEmptyState);
  }

  /**
   * Get form title text
   */
  async getFormTitle(): Promise<string> {
    return await this.getText(this.formTitle);
  }

  /**
   * Wait for books to load
   */
  async waitForBooksToLoad() {
    // Wait for loading to disappear
    await this.page.waitForSelector(this.booksLoading, { state: 'hidden', timeout: 10000 }).catch(() => {});
    await this.wait(500);
  }

  /**
   * Wait for orders to load
   */
  async waitForOrdersToLoad() {
    // Wait for loading to disappear
    await this.page.waitForSelector(this.ordersLoading, { state: 'hidden', timeout: 10000 }).catch(() => {});
    await this.wait(500);
  }
}