import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Admin Dashboard Page Object Model
 */
export class AdminPage extends BasePage {
  // Tab Selectors
  private booksTab = 'button:has-text("Books")';
  private ordersTab = 'button:has-text("Orders")';
  
  // Books Management Selectors
  private addBookButton = 'button:has-text("Add New Book")';
  private bookNameInput = 'input[id="name"], input[placeholder*="book name"]';
  private bookAuthorInput = 'input[id="author"], input[placeholder*="author"]';
  private bookDescriptionInput = 'textarea';
  private bookCategoryInput = 'input[id="category"], input[placeholder*="category"]';
  private bookPriceInput = 'input[type="number"][step="0.01"]';
  private bookQuantityInput = 'input[type="number"]:not([step])';
  private createBookButton = 'button[type="submit"]:has-text("Create Book")';
  private updateBookButton = 'button[type="submit"]:has-text("Update Book")';
  private cancelButton = 'button:has-text("Cancel")';
  
  // Table Selectors
  private booksTable = 'table';
  private bookRows = 'tbody tr';
  private editButtons = 'button:has-text("Edit")';
  private deleteButtons = 'button:has-text("Delete")';
  
  // Modal Selectors
  private confirmModal = '.modal';
  private confirmButton = '.confirm_button';
  private cancelModalButton = '.cancel_button';
  
  // Orders Selectors
  private ordersTable = 'table';
  private orderRows = 'tbody tr';
  private viewDetailsLinks = 'a:has-text("View Details")';
  private statsCards = '.stat_card';

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
   * Click Add New Book button
   */
  async clickAddNewBook() {
    await this.click(this.addBookButton);
    await this.wait(500);
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
    await this.click(this.createBookButton);
    await this.wait(1000);
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
    const row = this.page.locator(this.bookRows).filter({ hasText: bookName });
    const editButton = row.locator(this.editButtons);
    await editButton.click();
    await this.wait(500);

    if (newData.name) await this.fill(this.bookNameInput, newData.name);
    if (newData.author) await this.fill(this.bookAuthorInput, newData.author);
    if (newData.description) await this.fill(this.bookDescriptionInput, newData.description);
    if (newData.category) await this.fill(this.bookCategoryInput, newData.category);
    if (newData.price) await this.fill(this.bookPriceInput, newData.price);
    if (newData.quantity) await this.fill(this.bookQuantityInput, newData.quantity);

    await this.click(this.updateBookButton);
    await this.wait(1000);
  }

  /**
   * Delete book by name
   */
  async deleteBook(bookName: string, confirmDeletion: boolean = true) {
    const row = this.page.locator(this.bookRows).filter({ hasText: bookName });
    const deleteButton = row.locator(this.deleteButtons);
    await deleteButton.click();
    await this.wait(500);

    if (confirmDeletion) {
      await this.click(this.confirmButton);
      await this.wait(1000);
    } else {
      await this.click(this.cancelModalButton);
    }
  }

  /**
   * Cancel book form
   */
  async cancelBookForm() {
    await this.click(this.cancelButton);
    await this.wait(500);
  }

  /**
   * Get number of books in table
   */
  async getBooksCount(): Promise<number> {
    return await this.getElementCount(this.bookRows);
  }

  /**
   * Get number of orders
   */
  async getOrdersCount(): Promise<number> {
    return await this.getElementCount(this.orderRows);
  }

  /**
   * Check if book exists in table
   */
  async bookExists(bookName: string): Promise<boolean> {
    const row = this.page.locator(this.bookRows).filter({ hasText: bookName });
    return await row.count() > 0;
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
    const stats = await this.page.locator(this.statsCards).all();
    
    if (stats.length < 4) {
      return {
        totalOrders: '0',
        totalRevenue: '$0.00',
        paidOrders: '0',
        deliveredOrders: '0'
      };
    }

    const [totalOrders, totalRevenue, paidOrders, deliveredOrders] = await Promise.all([
      stats[0].locator('.stat_value').textContent(),
      stats[1].locator('.stat_value').textContent(),
      stats[2].locator('.stat_value').textContent(),
      stats[3].locator('.stat_value').textContent(),
    ]);

    return {
      totalOrders: totalOrders || '0',
      totalRevenue: totalRevenue || '$0.00',
      paidOrders: paidOrders || '0',
      deliveredOrders: deliveredOrders || '0'
    };
  }

  /**
   * Verify admin dashboard elements
   */
  async verifyAdminDashboardElements() {
    await expect(this.page.locator('h2')).toContainText('Admin Dashboard');
    await expect(this.page.locator(this.booksTab)).toBeVisible();
    await expect(this.page.locator(this.ordersTab)).toBeVisible();
  }

  /**
   * Verify books tab elements
   */
  async verifyBooksTabElements() {
    await this.switchToBooksTab();
    await expect(this.page.locator('h3')).toContainText('Books Management');
    await expect(this.page.locator(this.addBookButton)).toBeVisible();
  }

  /**
   * Verify orders tab elements
   */
  async verifyOrdersTabElements() {
    await this.switchToOrdersTab();
    await expect(this.page.locator('h3')).toContainText('Orders Management');
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
}