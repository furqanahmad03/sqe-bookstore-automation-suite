import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Books Page Object Model
 */
export class BooksPage extends BasePage {
  // Selectors
  private searchInput = '.searchbar-input';
  private searchClearButton = '.searchbar-button';
  private bookItems = '[data-testid="book-item"]';
  private bookTitles = '.book_item h3 a';
  private addToCartButtons = '[data-testid="add-to-cart"]';
  private cartLink = 'a[href="/cart"]';
  private cartCount = '[data-testid="cart-count"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to books page
   */
  async goto() {
    await this.navigate('/books');
  }

  async waitForCartCount(expected: number) {
    await expect(this.page.locator(this.cartCount))
      .toHaveText(String(expected));
  }
  

  /**
   * Search for books
   */
  async searchBooks(query: string) {
    await this.fill(this.searchInput, query);
    await this.wait(500); // Wait for filter to apply
  }

  /**
   * Clear search
   */
  async clearSearch() {
    await this.click(this.searchClearButton);
  }

  /**
   * Get number of displayed books
   */
  async getBookCount(): Promise<number> {
    return await this.getElementCount(this.bookItems);
  }

  /**
   * Get all book titles
   */
  async getBookTitles(): Promise<string[]> {
    const titles = await this.page.locator(this.bookTitles).all();
    return await Promise.all(titles.map(t => t.textContent() || '')) as string[];
  }

  /**
   * Add book to cart by name
   */
  async addBookToCart(bookName: string) {
    const bookItem = this.page.locator(this.bookItems).filter({ hasText: bookName });
    const addButton = bookItem.locator(this.addToCartButtons);
    await addButton.click();
    await this.wait(500);
  }

  /**
   * Add first available book to cart
   */
  async addFirstBookToCart() {
    const button = this.page.locator(this.addToCartButtons).first();
    await expect(button).toBeVisible();
  
    const before = await this.getCartCount();
    await button.click();
  
    await this.waitForCartCount(before + 1);
  }
  

  /**
   * Add multiple books to cart
   */
  async addMultipleBooksToCart(count: number) {
    const buttons = this.page.locator(this.addToCartButtons);
    const total = await buttons.count();
    const toAdd = Math.min(count, total);
  
    const before = await this.getCartCount();
  
    for (let i = 0; i < toAdd; i++) {
      await buttons.nth(i).click();
    }
  
    await this.waitForCartCount(before + toAdd);
  }
  

  /**
   * Get cart item count
   */
  async getCartCount(): Promise<number> {
    const locator = this.page.locator(this.cartCount);
    await expect(locator).toBeVisible();
  
    const text = await locator.textContent();
    return Number(text?.trim() || 0);
  }
  

  /**
   * Navigate to cart
   */
  async goToCart() {
    await this.click(this.cartLink);
    await this.waitForNavigation();
  }

  /**
   * Click on a book by name
   */
  async clickBook(bookName: string) {
    const bookTitle = this.page.locator(this.bookTitles).filter({ hasText: bookName });
    await bookTitle.click();
    await this.waitForNavigation();
  }

  /**
   * Check if book exists
   */
  async bookExists(bookName: string): Promise<boolean> {
    const titles = await this.getBookTitles();
    return titles.some(title => title.includes(bookName));
  }

  /**
   * Verify books page elements
   */
  async verifyBooksPageElements() {
    await expect(this.page.locator('h2')).toContainText('Browse Books');
    await expect(this.page.locator(this.searchInput)).toBeVisible();
    await expect(this.page.locator(this.searchClearButton)).toBeVisible();
  }

  /**
   * Get book details by name
   */
  async getBookDetails(bookName: string): Promise<{title: string, author: string, price: string}> {
    const bookItem = this.page.locator(this.bookItems).filter({ hasText: bookName });
    const title = await bookItem.locator('h3 a').textContent() || '';
    const author = await bookItem.locator('.book_author').textContent() || '';
    const price = await bookItem.locator('.book_price').textContent() || '';
    
    return { title, author, price };
  }

  /**
   * Check if add to cart button is disabled for a book
   */
  async isAddToCartDisabled(bookName: string): Promise<boolean> {
    const bookItem = this.page.locator(this.bookItems).filter({ hasText: bookName });
    const button = bookItem.locator(this.addToCartButtons);
    return await button.isDisabled();
  }
}