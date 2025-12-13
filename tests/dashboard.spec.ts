import { test, expect } from '@playwright/test';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';

/**
 * Admin Dashboard Test Suite (Updated with data-testid selectors)
 * Tests for admin panel functionality and CRUD operations
 */

test.describe('Admin Dashboard Tests @functional', () => {

  // Setup: Login as admin before each test
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.adminLogin();
    await page.waitForTimeout(1000);
  });

  test('TC-ADMIN-001: Access dashboard as admin @smoke', async ({ page }) => {
    const adminPage = new AdminPage(page);
    
    await adminPage.goto();
    await adminPage.verifyAdminDashboardElements();
    
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('[data-testid="dashboard-title"]')).toContainText('Admin Dashboard');
    await expect(page.locator('[data-testid="dashboard-tabs"]')).toBeVisible();
  });

test('TC-ADMIN-002: Access dashboard as non-admin @functional @security', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const adminPage = new AdminPage(page);
    
    // Properly logout: clear cookies AND navigate away
    await page.context().clearCookies();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate to login and verify we're there
    await loginPage.goto();
    await page.waitForURL('/login', { timeout: 5000 });
    await loginPage.verifyLoginPageElements(); // Ensures login form is visible
    
    // Login as regular user
    await loginPage.login('test@example.com', 'password123');
    await page.waitForLoadState('networkidle');
    
    // Try to access dashboard
    await page.goto('/dashboard');
    await page.waitForTimeout(1000);
    
    // Should be redirected to unauthorized
    const url = page.url();
    expect(url).toContain('unauthorized');
  });

  test('TC-ADMIN-003: View dashboard statistics @functional', async ({ page }) => {
    const adminPage = new AdminPage(page);
    
    await adminPage.goto();
    await adminPage.waitForOrdersToLoad();
    
    const stats = await adminPage.getDashboardStats();
    
    expect(stats.totalOrders).toBeTruthy();
    expect(stats.totalRevenue).toMatch(/\$/);
    expect(stats.paidOrders).toBeTruthy();
    expect(stats.deliveredOrders).toBeTruthy();
    
    // Verify stat elements are visible
    await expect(page.locator('[data-testid="stat-total-orders"]')).toBeVisible();
    await expect(page.locator('[data-testid="stat-total-revenue"]')).toBeVisible();
    await expect(page.locator('[data-testid="stat-paid-orders"]')).toBeVisible();
    await expect(page.locator('[data-testid="stat-delivered-orders"]')).toBeVisible();
  });

  test('TC-ADMIN-004: Add new book @smoke @regression', async ({ page }) => {
    const adminPage = new AdminPage(page);
    
    await adminPage.goto();
    await adminPage.switchToBooksTab();
    await adminPage.waitForBooksToLoad();
    
    const uniqueName = `Test Book ${Date.now()}`;
    await adminPage.createBook(
      uniqueName,
      'Test Author',
      'Test description for the book',
      'Fiction',
      '19.99',
      '10'
    );
    
    // Verify success notification
    await page.waitForTimeout(1000);
    
    // Verify book was created
    const bookExists = await adminPage.bookExists(uniqueName);
    expect(bookExists).toBeTruthy();
  });

  test('TC-ADMIN-005: Add book with missing fields @functional', async ({ page }) => {
    const adminPage = new AdminPage(page);
    
    await adminPage.goto();
    await adminPage.switchToBooksTab();
    await adminPage.waitForBooksToLoad();
    
    // Click add book button
    await adminPage.clickAddNewBook();
    
    // Verify form is visible
    const isFormVisible = await adminPage.isBookFormVisible();
    expect(isFormVisible).toBeTruthy();
    
    // Try to submit without filling required fields
    await page.locator('[data-testid="submit-book-button"]').click();
    await page.waitForTimeout(500);
    
    // Form should still be visible (validation prevented submission)
    const stillVisible = await adminPage.isBookFormVisible();
    expect(stillVisible).toBeTruthy();
  });

  test('TC-ADMIN-006: Edit existing book @functional @regression', async ({ page }) => {
    const adminPage = new AdminPage(page);
    
    await adminPage.goto();
    await adminPage.switchToBooksTab();
    await adminPage.waitForBooksToLoad();
    
    // First create a book
    const originalName = `Original Book ${Date.now()}`;
    await adminPage.createBook(
      originalName,
      'Original Author',
      'Original description',
      'Fiction',
      '15.99',
      '5'
    );
    
    await page.waitForTimeout(1000);
    
    // Edit the book
    const newName = `Updated Book ${Date.now()}`;
    await adminPage.editBook(originalName, {
      name: newName,
      price: '29.99'
    });
    
    await page.waitForTimeout(1000);
    
    // Verify updated
    const bookExists = await adminPage.bookExists(newName);
    expect(bookExists).toBeTruthy();
    
    // Verify old name no longer exists
    const oldExists = await adminPage.bookExists(originalName);
    expect(oldExists).toBeFalsy();
  });

  test('TC-ADMIN-007: Delete book @functional', async ({ page }) => {
    const adminPage = new AdminPage(page);
    
    await adminPage.goto();
    await adminPage.switchToBooksTab();
    await adminPage.waitForBooksToLoad();
    
    // Create a book to delete
    const bookName = `Book to Delete ${Date.now()}`;
    await adminPage.createBook(
      bookName,
      'Test Author',
      'Test description',
      'Fiction',
      '12.99',
      '3'
    );
    
    await page.waitForTimeout(1000);
    
    // Verify book exists
    let bookExists = await adminPage.bookExists(bookName);
    expect(bookExists).toBeTruthy();
    
    // Delete the book
    await adminPage.deleteBook(bookName, true);
    
    await page.waitForTimeout(1000);
    
    // Verify deleted
    bookExists = await adminPage.bookExists(bookName);
    expect(bookExists).toBeFalsy();
  });

  test('TC-ADMIN-008: Navigate between tabs @functional', async ({ page }) => {
    const adminPage = new AdminPage(page);
    
    await adminPage.goto();
    
    // Books tab
    await adminPage.switchToBooksTab();
    await adminPage.verifyBooksTabElements();
    let isBooksActive = await adminPage.isBooksTabActive();
    expect(isBooksActive).toBeTruthy();
    
    // Orders tab
    await adminPage.switchToOrdersTab();
    await adminPage.verifyOrdersTabElements();
    let isOrdersActive = await adminPage.isOrdersTabActive();
    expect(isOrdersActive).toBeTruthy();
    
    // Back to books
    await adminPage.switchToBooksTab();
    await expect(page.locator('[data-testid="books-section-title"]')).toContainText('Books Management');
    isBooksActive = await adminPage.isBooksTabActive();
    expect(isBooksActive).toBeTruthy();
  });

  test('TC-ADMIN-009: View all orders @functional', async ({ page }) => {
    const adminPage = new AdminPage(page);
    
    await adminPage.goto();
    await adminPage.switchToOrdersTab();
    await adminPage.waitForOrdersToLoad();
    
    const orderCount = await adminPage.getOrdersCount();
    expect(orderCount).toBeGreaterThanOrEqual(0);
    
    // Verify orders section title
    await expect(page.locator('[data-testid="orders-section-title"]')).toContainText('Orders Management');
    
    // If orders exist, verify table
    if (orderCount > 0) {
      await adminPage.verifyOrdersTableVisible();
    }
  });

  test('TC-ADMIN-010: Book form validation @functional', async ({ page }) => {
    const adminPage = new AdminPage(page);
    
    await adminPage.goto();
    await adminPage.switchToBooksTab();
    await adminPage.waitForBooksToLoad();
    
    // Open form
    await adminPage.clickAddNewBook();
    
    // Verify form elements
    await expect(page.locator('[data-testid="book-form"]')).toBeVisible();
    await expect(page.locator('[data-testid="book-name-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="book-author-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="book-description-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="book-category-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="book-price-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="book-quantity-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="submit-book-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="cancel-book-button"]')).toBeVisible();
    
    // Verify form title
    const formTitle = await adminPage.getFormTitle();
    expect(formTitle).toContain('Add New Book');
  });

  test('TC-ADMIN-011: Cancel book form @functional', async ({ page }) => {
    const adminPage = new AdminPage(page);
    
    await adminPage.goto();
    await adminPage.switchToBooksTab();
    await adminPage.waitForBooksToLoad();
    
    // Open form
    await adminPage.clickAddNewBook();
    let isFormVisible = await adminPage.isBookFormVisible();
    expect(isFormVisible).toBeTruthy();
    
    // Fill some data
    await page.locator('[data-testid="book-name-input"]').fill('Test Book');
    
    // Cancel form
    await adminPage.cancelBookForm();
    
    // Form should be hidden
    isFormVisible = await adminPage.isBookFormVisible();
    expect(isFormVisible).toBeFalsy();
    
    // Add button should be visible again
    await expect(page.locator('[data-testid="add-book-button"]')).toBeVisible();
  });

});