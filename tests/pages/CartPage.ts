import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Cart Page Object Model (Updated with data-testid selectors)
 */
export class CartPage extends BasePage {
  // Selectors using data-testid
  private pageTitle = '[data-testid="cart-page-title"]';
  private emptyCartMessage = '[data-testid="empty-cart-message"]';
  private continueShoppingLink = '[data-testid="continue-shopping-link"]';
  private cartTable = '[data-testid="cart-table"]';
  private cartSummary = '[data-testid="cart-summary"]';
  private totalQuantity = '[data-testid="total-quantity"]';
  private totalPrice = '[data-testid="total-price"]';
  private checkoutButton = '[data-testid="checkout-button"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to cart page
   */
  async goto() {
    await this.navigate('/cart');
  }

  /**
   * Get cart item by index
   */
  private getCartItem(index: number) {
    return `[data-testid="cart-item-${index}"]`;
  }

  /**
   * Get cart item by name
   */
  private async getItemIndexByName(itemName: string): Promise<number> {
    const count = await this.page.locator('[data-testid^="cart-item-"]').count();
    for (let i = 0; i < count; i++) {
      const name = await this.page.locator(`[data-testid="cart-item-name-${i}"]`).textContent();
      if (name?.includes(itemName)) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Get number of items in cart
   */
  async getCartItemCount(): Promise<number> {
    const isEmpty = await this.isCartEmpty();
    if (isEmpty) return 0;
    
    return await this.page.locator('[data-testid^="cart-item-"]').count();
  }

  /**
   * Check if cart is empty
   */
  async isCartEmpty(): Promise<boolean> {
    return await this.isVisible(this.emptyCartMessage);
  }

  /**
   * Remove item by index
   */
  async removeItemByIndex(index: number) {
    await this.click(`[data-testid="remove-item-${index}"]`);
    await this.wait(500);
  }

  /**
   * Remove item by name
   */
  async removeItem(itemName: string) {
    const index = await this.getItemIndexByName(itemName);
    if (index !== -1) {
      await this.removeItemByIndex(index);
    }
  }

  /**
   * Remove first item
   */
  async removeFirstItem() {
    await this.removeItemByIndex(0);
  }

  /**
   * Increase quantity for an item by index
   */
  async increaseQuantityByIndex(index: number) {
    await this.click(`[data-testid="increase-quantity-${index}"]`);
    await this.wait(500);
  }

  /**
   * Increase quantity for an item by name
   */
  async increaseQuantity(itemName: string) {
    const index = await this.getItemIndexByName(itemName);
    if (index !== -1) {
      await this.increaseQuantityByIndex(index);
    }
  }

  /**
   * Decrease quantity for an item by index
   */
  async decreaseQuantityByIndex(index: number) {
    await this.click(`[data-testid="decrease-quantity-${index}"]`);
    await this.wait(500);
  }

  /**
   * Decrease quantity for an item by name
   */
  async decreaseQuantity(itemName: string) {
    const index = await this.getItemIndexByName(itemName);
    if (index !== -1) {
      await this.decreaseQuantityByIndex(index);
    }
  }

  /**
   * Get item quantity by index
   */
  async getItemQuantityByIndex(index: number): Promise<number> {
    const quantityText = await this.getText(`[data-testid="item-quantity-${index}"]`);
    return parseInt(quantityText.trim()) || 0;
  }

  /**
   * Get item quantity by name
   */
  async getItemQuantity(itemName: string): Promise<number> {
    const index = await this.getItemIndexByName(itemName);
    if (index !== -1) {
      return await this.getItemQuantityByIndex(index);
    }
    return 0;
  }

  /**
   * Get total quantity of all items
   */
  async getTotalQuantity(): Promise<number> {
    const quantityText = await this.getText(this.totalQuantity);
    return parseInt(quantityText) || 0;
  }

  /**
   * Get total price
   */
  async getTotalPrice(): Promise<number> {
    const priceText = await this.getText(this.totalPrice);
    return parseFloat(priceText.replace('$', '')) || 0;
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout() {
    await this.click(this.checkoutButton);
    await this.waitForNavigation();
  }

  /**
   * Get all item names in cart
   */
  async getCartItemNames(): Promise<string[]> {
    const count = await this.getCartItemCount();
    const names: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const name = await this.getText(`[data-testid="cart-item-name-${i}"]`);
      names.push(name);
    }
    
    return names;
  }

  /**
   * Verify cart page elements
   */
  async verifyCartPageElements() {
    await expect(this.page.locator(this.pageTitle)).toContainText('Cart');
    
    const isEmpty = await this.isCartEmpty();
    if (!isEmpty) {
      await expect(this.page.locator(this.cartTable)).toBeVisible();
      await expect(this.page.locator(this.checkoutButton)).toBeVisible();
      await expect(this.page.locator(this.cartSummary)).toBeVisible();
    } else {
      await expect(this.page.locator(this.emptyCartMessage)).toBeVisible();
      await expect(this.page.locator(this.continueShoppingLink)).toBeVisible();
    }
  }

  /**
   * Clear all items from cart
   */
  async clearCart() {
    let count = await this.getCartItemCount();
    while (count > 0) {
      await this.removeFirstItem();
      await this.wait(300);
      count = await this.getCartItemCount();
      
      // Safety check to prevent infinite loop
      if (count === 0) break;
    }
  }

  /**
   * Get item price by index
   */
  async getItemPriceByIndex(index: number): Promise<number> {
    const priceText = await this.getText(`[data-testid="item-price-${index}"]`);
    return parseFloat(priceText.replace('$', '')) || 0;
  }

  /**
   * Get item price by name
   */
  async getItemPrice(itemName: string): Promise<number> {
    const index = await this.getItemIndexByName(itemName);
    if (index !== -1) {
      return await this.getItemPriceByIndex(index);
    }
    return 0;
  }

  /**
   * Check if item exists in cart by name
   */
  async itemExistsInCart(itemName: string): Promise<boolean> {
    const index = await this.getItemIndexByName(itemName);
    return index !== -1;
  }

  /**
   * Get item data by index
   */
  async getItemDataByIndex(index: number): Promise<{
    name: string;
    quantity: number;
    price: number;
  }> {
    const name = await this.getText(`[data-testid="cart-item-name-${index}"]`);
    const quantity = await this.getItemQuantityByIndex(index);
    const price = await this.getItemPriceByIndex(index);
    
    return { name, quantity, price };
  }

  /**
   * Check if increase button is disabled for item
   */
  async isIncreaseDisabled(index: number): Promise<boolean> {
    return await this.page.locator(`[data-testid="increase-quantity-${index}"]`).isDisabled();
  }

  /**
   * Check if decrease button is disabled for item
   */
  async isDecreaseDisabled(index: number): Promise<boolean> {
    return await this.page.locator(`[data-testid="decrease-quantity-${index}"]`).isDisabled();
  }

  /**
   * Click continue shopping link
   */
  async continueShopping() {
    await this.click(this.continueShoppingLink);
    await this.waitForNavigation();
  }
}