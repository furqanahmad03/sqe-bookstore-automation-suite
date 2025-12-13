import { test, expect } from '@playwright/test';
import { CartPage } from './pages/CartPage';
import { BooksPage } from './pages/BooksPage';

/**
 * Shopping Cart Test Suite (Updated with data-testid selectors)
 * Tests for cart functionality and operations
 */

test.describe('Shopping Cart Tests @functional', () => {

  test('TC-CART-001: View cart with items @smoke', async ({ page }) => {
    const booksPage = new BooksPage(page);
    const cartPage = new CartPage(page);
    
    // Add items to cart first
    await booksPage.goto();
    await booksPage.addMultipleBooksToCart(2);
    
    await cartPage.goto();
    await cartPage.verifyCartPageElements();
    
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBeGreaterThan(0);
    
    // Verify cart table is visible
    await expect(page.locator('[data-testid="cart-table"]')).toBeVisible();
    await expect(page.locator('[data-testid="cart-summary"]')).toBeVisible();
  });

  test('TC-CART-002: View empty cart @functional', async ({ page }) => {
    const cartPage = new CartPage(page);
    
    await cartPage.goto();
    
    // Clear cart if it has items
    const isEmpty = await cartPage.isCartEmpty();
    if (!isEmpty) {
      await cartPage.clearCart();
      await page.reload();
      await cartPage.waitForNavigation();
    }
    
    const isNowEmpty = await cartPage.isCartEmpty();
    expect(isNowEmpty).toBeTruthy();
    
    // Verify empty cart message
    await expect(page.locator('[data-testid="empty-cart-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="continue-shopping-link"]')).toBeVisible();
  });

  test('TC-CART-003: Update item quantity - increase @functional', async ({ page }) => {
    const booksPage = new BooksPage(page);
    const cartPage = new CartPage(page);
    
    // Add item to cart
    await booksPage.goto();
    await booksPage.addFirstBookToCart();
    
    await cartPage.goto();
    const itemCount = await cartPage.getCartItemCount();
    
    if (itemCount > 0) {
      const initialQty = await cartPage.getItemQuantityByIndex(0);
      
      // Click increase button
      await cartPage.increaseQuantityByIndex(0);
      
      const newQty = await cartPage.getItemQuantityByIndex(0);
      expect(newQty).toBe(initialQty + 1);
    }
  });

  test('TC-CART-004: Update item quantity - decrease @functional', async ({ page }) => {
    const booksPage = new BooksPage(page);
    const cartPage = new CartPage(page);
    
    // Add item with quantity > 1
    await booksPage.goto();
    await booksPage.addFirstBookToCart();
    await page.waitForTimeout(300);
    await booksPage.addFirstBookToCart();
    
    await cartPage.goto();
    const itemCount = await cartPage.getCartItemCount();
    
    if (itemCount > 0) {
      const initialQty = await cartPage.getItemQuantityByIndex(0);
      
      if (initialQty > 1) {
        await cartPage.decreaseQuantityByIndex(0);
        
        const newQty = await cartPage.getItemQuantityByIndex(0);
        expect(newQty).toBe(initialQty - 1);
      }
    }
  });

  test('TC-CART-005: Calculate total price @functional', async ({ page }) => {
    const booksPage = new BooksPage(page);
    const cartPage = new CartPage(page);
    
    // Add items
    await booksPage.goto();
    await booksPage.addMultipleBooksToCart(2);
    
    await cartPage.goto();
    
    // Verify total price is displayed and greater than 0
    const totalPrice = await cartPage.getTotalPrice();
    expect(totalPrice).toBeGreaterThan(0);
    
    // Verify total quantity
    const totalQuantity = await cartPage.getTotalQuantity();
    expect(totalQuantity).toBeGreaterThan(0);
    
    // Verify totals are visible
    await expect(page.locator('[data-testid="total-price"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-quantity"]')).toBeVisible();
  });

  test('TC-CART-006: Proceed to checkout @smoke', async ({ page }) => {
    const booksPage = new BooksPage(page);
    const cartPage = new CartPage(page);
    
    // Add items
    await booksPage.goto();
    await booksPage.addFirstBookToCart();
    
    await cartPage.goto();
    
    // Verify checkout button is visible
    await expect(page.locator('[data-testid="checkout-button"]')).toBeVisible();
    
    // Click checkout button and wait for navigation
    await page.locator('[data-testid="checkout-button"]').click();
    await page.waitForURL(/\/(login|shipping)/, { timeout: 10000 });
    
    // Verify navigation happened
    const url = page.url();
    expect(url).toMatch(/\/(login|shipping)/);
  });

  test('TC-CART-007: Cart persistence @regression', async ({ page, context }) => {
    const booksPage = new BooksPage(page);
    const cartPage = new CartPage(page);
    
    // Add items
    await booksPage.goto();
    await booksPage.addMultipleBooksToCart(2);
    
    await cartPage.goto();
    const cartCount = await cartPage.getCartItemCount();
    expect(cartCount).toBeGreaterThan(0);
    
    // Open new tab
    const newPage = await context.newPage();
    const newCartPage = new CartPage(newPage);
    await newCartPage.goto();
    
    const newPageCount = await newCartPage.getCartItemCount();
    expect(newPageCount).toBe(cartCount);
    
    await newPage.close();
  });

  test('TC-CART-008: Remove all items from cart @functional', async ({ page }) => {
    const booksPage = new BooksPage(page);
    const cartPage = new CartPage(page);
    
    // Add multiple items
    await booksPage.goto();
    await booksPage.addMultipleBooksToCart(3);
    
    await cartPage.goto();
    const initialCount = await cartPage.getCartItemCount();
    expect(initialCount).toBeGreaterThan(0);
    
    // Clear cart
    await cartPage.clearCart();
    
    // Reload to see empty state
    await page.reload();
    await cartPage.waitForNavigation();
    
    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBeTruthy();
  });

  test('TC-CART-009: Display item information @functional', async ({ page }) => {
    const booksPage = new BooksPage(page);
    const cartPage = new CartPage(page);
    
    // Add item
    await booksPage.goto();
    await booksPage.addFirstBookToCart();
    
    await cartPage.goto();
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBeGreaterThan(0);
    
    if (itemCount > 0) {
      // Get item data using data-testid
      const itemData = await cartPage.getItemDataByIndex(0);
      
      expect(itemData.name).toBeTruthy();
      expect(itemData.quantity).toBeGreaterThan(0);
      expect(itemData.price).toBeGreaterThan(0);
      
      // Verify elements are visible
      await expect(page.locator('[data-testid="cart-item-name-0"]')).toBeVisible();
      await expect(page.locator('[data-testid="item-quantity-0"]')).toBeVisible();
      await expect(page.locator('[data-testid="item-price-0"]')).toBeVisible();
    }
  });

  test('TC-CART-010: Quantity buttons functionality @functional', async ({ page }) => {
    const booksPage = new BooksPage(page);
    const cartPage = new CartPage(page);
    
    // Add item
    await booksPage.goto();
    await booksPage.addFirstBookToCart();
    
    await cartPage.goto();
    const itemCount = await cartPage.getCartItemCount();
    
    if (itemCount > 0) {
      // Verify decrease button is disabled when quantity is 1
      const qty = await cartPage.getItemQuantityByIndex(0);
      if (qty === 1) {
        const isDisabled = await cartPage.isDecreaseDisabled(0);
        expect(isDisabled).toBeTruthy();
      }
      
      // Verify buttons are visible
      await expect(page.locator('[data-testid="increase-quantity-0"]')).toBeVisible();
      await expect(page.locator('[data-testid="decrease-quantity-0"]')).toBeVisible();
    }
  });

  test('TC-CART-011: Item link navigation @functional', async ({ page }) => {
    const booksPage = new BooksPage(page);
    const cartPage = new CartPage(page);
    
    // Add item
    await booksPage.goto();
    await booksPage.addFirstBookToCart();
    
    await cartPage.goto();
    const itemCount = await cartPage.getCartItemCount();
    
    if (itemCount > 0) {
      // Get the book slug/name for verification
      const itemName = await page.locator('[data-testid="cart-item-name-0"]').textContent();
      
      // Click on item link and wait for navigation
      await page.locator('[data-testid="cart-item-link-0"]').click();
      await page.waitForURL(/\/books\/.+/, { timeout: 10000 });
      
      // Should navigate to book details page
      const url = page.url();
      expect(url).toMatch(/\/books\/.+/);
      
      // Verify we're on the book detail page
      await expect(page.locator('h2')).toBeVisible();
    }
  });
});