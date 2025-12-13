import { test, expect } from '@playwright/test';
import { BooksPage } from './pages/BooksPage';
import { LoginPage } from './pages/LoginPage';

/**
 * Books Management Test Suite
 * Tests for browsing, searching, and adding books to cart
 */

test.describe('Books Management Tests @functional', () => {

  test('TC-BOOKS-001: Display books list @smoke', async ({ page }) => {
    const booksPage = new BooksPage(page);
    
    await booksPage.goto();
    await booksPage.verifyBooksPageElements();
    
    const bookCount = await booksPage.getBookCount();
    expect(bookCount).toBeGreaterThan(0);
  });

  test('TC-BOOKS-002: Search books with valid query @functional', async ({ page }) => {
    const booksPage = new BooksPage(page);
    
    await booksPage.goto();
    const initialCount = await booksPage.getBookCount();
    
    await booksPage.searchBooks('Harry Potter');
    await page.waitForTimeout(500);
    
    const titles = await booksPage.getBookTitles();
    const hasSearchTerm = titles.some(title => 
      title.toLowerCase().includes('harry') || title.toLowerCase().includes('potter')
    );
    
    if (titles.length > 0) {
      expect(hasSearchTerm).toBeTruthy();
    }
  });

  test('TC-BOOKS-003: Search books with no results @functional', async ({ page }) => {
    const booksPage = new BooksPage(page);
    
    await booksPage.goto();
    await booksPage.searchBooks('XYZ123NonExistentBook');
    await page.waitForTimeout(500);
    
    const bookCount = await booksPage.getBookCount();
    expect(bookCount).toBe(0);
  });

  test('TC-BOOKS-004: Clear search filter @functional', async ({ page }) => {
    const booksPage = new BooksPage(page);
    
    await booksPage.goto();
    const initialCount = await booksPage.getBookCount();
    
    await booksPage.searchBooks('Test');
    await page.waitForTimeout(300);
    
    await booksPage.clearSearch();
    await page.waitForTimeout(300);
    
    const finalCount = await booksPage.getBookCount();
    expect(finalCount).toBe(initialCount);
  });

  test('TC-BOOKS-005: Add single book to cart @smoke @regression', async ({ page }) => {
    const booksPage = new BooksPage(page);
    
    await booksPage.goto();
    const initialCartCount = await booksPage.getCartCount();
    
    await booksPage.addFirstBookToCart();

    const newCartCount = await booksPage.getCartCount();
    expect(newCartCount).toBe(initialCartCount + 1);

    expect(newCartCount).toBe(initialCartCount + 1);
  });

  test('TC-BOOKS-006: Add multiple books to cart @functional', async ({ page }) => {
    const booksPage = new BooksPage(page);
  
    await booksPage.goto();
    const initialCartCount = await booksPage.getCartCount();
  
    const availableBooks = await page
      .locator('[data-testid="add-to-cart"]')
      .count();
  
    const booksToAdd = Math.min(3, availableBooks);
  
    await booksPage.addMultipleBooksToCart(3);
  
    const newCartCount = await booksPage.getCartCount();
    expect(newCartCount).toBe(initialCartCount + booksToAdd);
  });
  

  test('TC-BOOKS-007: View book details @functional', async ({ page }) => {
    const booksPage = new BooksPage(page);
    
    await booksPage.goto();
    const titles = await booksPage.getBookTitles();
    
    if (titles.length > 0) {
      const firstBook = titles[0];
      await booksPage.clickBook(firstBook);
      
      await expect(page).toHaveURL(/\/books\/.+/);
      await expect(page.locator('h2')).toContainText(firstBook);
    }
  });

  test('TC-BOOKS-008: Book information accuracy @functional', async ({ page }) => {
    const booksPage = new BooksPage(page);
    
    await booksPage.goto();
    const titles = await booksPage.getBookTitles();
    
    if (titles.length > 0) {
      const bookDetails = await booksPage.getBookDetails(titles[0]);
      
      expect(bookDetails.title).toBeTruthy();
      expect(bookDetails.author).toBeTruthy();
      expect(bookDetails.price).toMatch(/\$\d+/);
    }
  });

  test('TC-BOOKS-009: Responsive design on mobile @regression', async ({ page, isMobile }) => {
    const booksPage = new BooksPage(page);
    
    await booksPage.goto();
    await booksPage.verifyBooksPageElements();
    
    const bookCount = await booksPage.getBookCount();
    expect(bookCount).toBeGreaterThan(0);
    
    // Verify elements are accessible
    await expect(page.locator('.searchbar-input')).toBeVisible();
    await expect(page.locator('[data-testid="book-item"]').first()).toBeVisible();
  });

  test('TC-BOOKS-010: Add to cart notification @functional', async ({ page }) => {
    const booksPage = new BooksPage(page);
    
    await booksPage.goto();
    await booksPage.addFirstBookToCart();
    
    // Wait for notification or cart count update
    await page.waitForTimeout(1000);
    
    const cartCount = await booksPage.getCartCount();
    expect(cartCount).toBeGreaterThan(0);
  });
});