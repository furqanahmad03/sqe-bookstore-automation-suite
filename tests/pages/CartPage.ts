import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Cart Page Object Model
 */
export class CartPage extends BasePage {
  // Selectors
  private cartTable = '.cart_table table';
  private cartItems = '.cart_table tbody tr';
  private removeButtons = '.remove_product';
  private quantityDecrease = '.action_button:has-text("-")';
  private quantityIncrease = '.action_button:has-text("+")';
  private quantityDisplay = '.cart_number';
  private totalQuantity = '.cart_action_block p:has-text("Quantity") strong';
  private totalPrice = '.cart_action_block p:has-text("Subtotal") strong';
  private checkoutButton = '.checkout_button';
  private emptyCartMessage = '.notice_wrap';

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
   * Get number of items in cart
   */
  async getCartItemCount(): Promise<number> {
    const isEmpty = await this.isCartEmpty();
    if (isEmpty) return 0;
    
    return await this.getElementCount(this.cartItems);
  }

  /**
   * Check if cart is empty
   */
  async isCartEmpty(): Promise<boolean> {
    return await this.isVisible(this.emptyCartMessage);
  }

  /**
   * Remove item by name
   */
  async removeItem(itemName: string) {
    const row = this.page.locator(this.cartItems).filter({ hasText: itemName });
    const removeButton = row.locator(this.removeButtons);
    await removeButton.click();
    await this.wait(500);
  }

  /**
   * Remove first item
   */
  async removeFirstItem() {
    const firstRemoveButton = this.page.locator(this.removeButtons).first();
    await firstRemoveButton.click();
    await this.wait(500);
  }

  /**
   * Increase quantity for an item
   */
  async increaseQuantity(itemName: string) {
    const row = this.page.locator(this.cartItems).filter({ hasText: itemName });
    const increaseButton = row.locator(this.quantityIncrease);
    await increaseButton.click();
    await this.wait(500);
  }

  /**
   * Decrease quantity for an item
   */
  async decreaseQuantity(itemName: string) {
    const row = this.page.locator(this.cartItems).filter({ hasText: itemName });
    const decreaseButton = row.locator(this.quantityDecrease);
    await decreaseButton.click();
    await this.wait(500);
  }

  /**
   * Get item quantity
   */
  async getItemQuantity(itemName: string): Promise<number> {
    const row = this.page.locator(this.cartItems).filter({ hasText: itemName });
    const quantityText = await row.locator(this.quantityDisplay).textContent();
    return parseInt(quantityText || '0');
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
    const items = await this.page.locator(this.cartItems + ' .product_name strong').all();
    return await Promise.all(items.map(item => item.textContent() || '') as unknown as string[]);
  }

  /**
   * Verify cart page elements
   */
  async verifyCartPageElements() {
    await expect(this.page.locator('h2')).toContainText('Cart');
    
    const isEmpty = await this.isCartEmpty();
    if (!isEmpty) {
      await expect(this.page.locator(this.cartTable)).toBeVisible();
      await expect(this.page.locator(this.checkoutButton)).toBeVisible();
    }
  }

  /**
   * Clear all items from cart
   */
  async clearCart() {
    while (!(await this.isCartEmpty())) {
      await this.removeFirstItem();
      await this.wait(300);
    }
  }

  /**
   * Get item price by name
   */
  async getItemPrice(itemName: string): Promise<number> {
    const row = this.page.locator(this.cartItems).filter({ hasText: itemName });
    const priceCell = await row.locator('td').nth(2).textContent();
    return parseFloat(priceCell?.replace('$', '') || '0');
  }

  /**
   * Check if item exists in cart
   */
  async itemExistsInCart(itemName: string): Promise<boolean> {
    const items = await this.getCartItemNames();
    return items.some(name => name.includes(itemName));
  }
}