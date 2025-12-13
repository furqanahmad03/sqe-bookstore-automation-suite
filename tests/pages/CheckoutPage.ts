import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Checkout Page Object Model
 * Handles Shipping, Payment, and Place Order pages
 */
export class CheckoutPage extends BasePage {
  // Shipping Page Selectors (data-testid)
  private shippingForm = '[data-testid="shipping-form"]';
  private fullNameInput = '[data-testid="fullName-input"]';
  private addressInput = '[data-testid="address-input"]';
  private cityInput = '[data-testid="city-input"]';
  private postalCodeInput = '[data-testid="postalCode-input"]';
  private countryInput = '[data-testid="country-input"]';
  
  // Payment Page Selectors (data-testid)
  private paymentForm = '[data-testid="payment-form"]';
  private paymentPayPal = '[data-testid="payment-PayPal"]';
  private paymentStripe = '[data-testid="payment-Stripe"]';
  private paymentCashOnDelivery = '[data-testid="payment-CashOnDelivery"]';
  
  // Place Order Page Selectors (data-testid)
  private orderSummary = '[data-testid="order-summary"]';
  private shippingSection = '[data-testid="shipping-section"]';
  private shippingAddress = '[data-testid="shipping-address"]';
  private paymentSection = '[data-testid="payment-section"]';
  private paymentMethod = '[data-testid="payment-method"]';
  private orderItemsSection = '[data-testid="order-items-section"]';
  private orderSummarySection = '[data-testid="order-summary-section"]';
  private itemsPrice = '[data-testid="items-price"]';
  private taxPrice = '[data-testid="tax-price"]';
  private shippingPrice = '[data-testid="shipping-price"]';
  private totalPrice = '[data-testid="total-price"]';
  private placeOrderButton = '[data-testid="place-order-button"]';
  
  // Common Selectors
  private pageTitle = '[data-testid="page-title"]';
  private nextButton = '[data-testid="next-button"]';
  private backButton = '[data-testid="back-button"]';
  private editShipping = '[data-testid="edit-shipping"]';
  private editPayment = '[data-testid="edit-payment"]';
  private editCart = '[data-testid="edit-cart"]';
  private emptyCart = '[data-testid="empty-cart"]';

  constructor(page: Page) {
    super(page);
  }

  // ==================== Navigation Methods ====================

  /**
   * Navigate to shipping page
   */
  async gotoShipping() {
    await this.navigate('/shipping');
  }

  /**
   * Navigate to payment page
   */
  async gotoPayment() {
    await this.navigate('/payment');
  }

  /**
   * Navigate to place order page
   */
  async gotoPlaceOrder() {
    await this.navigate('/placeorder');
  }

  // ==================== Shipping Page Methods ====================

  /**
   * Fill shipping address form
   */
  async fillShippingAddress(
    fullName: string,
    address: string,
    city: string,
    postalCode: string,
    country: string
  ) {
    await this.fill(this.fullNameInput, fullName);
    await this.fill(this.addressInput, address);
    await this.fill(this.cityInput, city);
    await this.fill(this.postalCodeInput, postalCode);
    await this.fill(this.countryInput, country);
  }

  /**
   * Get shipping address values
   */
  async getShippingAddressValues(): Promise<{
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  }> {
    return {
      fullName: await this.page.locator(this.fullNameInput).inputValue(),
      address: await this.page.locator(this.addressInput).inputValue(),
      city: await this.page.locator(this.cityInput).inputValue(),
      postalCode: await this.page.locator(this.postalCodeInput).inputValue(),
      country: await this.page.locator(this.countryInput).inputValue(),
    };
  }

  /**
   * Check if shipping form is visible
   */
  async isShippingFormVisible(): Promise<boolean> {
    return await this.isVisible(this.shippingForm);
  }

  // ==================== Payment Page Methods ====================

  /**
   * Select payment method
   */
  async selectPaymentMethod(method: 'PayPal' | 'Stripe' | 'CashOnDelivery') {
    const selector = method === 'PayPal' 
      ? this.paymentPayPal 
      : method === 'Stripe' 
      ? this.paymentStripe 
      : this.paymentCashOnDelivery;
    
    await this.page.check(selector);
    await this.wait(300);
  }

  /**
   * Check if payment method is selected
   */
  async isPaymentMethodSelected(method: 'PayPal' | 'Stripe' | 'CashOnDelivery'): Promise<boolean> {
    const selector = method === 'PayPal' 
      ? this.paymentPayPal 
      : method === 'Stripe' 
      ? this.paymentStripe 
      : this.paymentCashOnDelivery;
    
    return await this.page.isChecked(selector);
  }

  /**
   * Check if payment form is visible
   */
  async isPaymentFormVisible(): Promise<boolean> {
    return await this.isVisible(this.paymentForm);
  }

  // ==================== Place Order Page Methods ====================

  /**
   * Get displayed shipping address
   */
  async getDisplayedShippingAddress(): Promise<string> {
    return await this.getText(this.shippingAddress);
  }

  /**
   * Get displayed payment method
   */
  async getDisplayedPaymentMethod(): Promise<string> {
    return await this.getText(this.paymentMethod);
  }

  /**
   * Get order item by index
   */
  private getOrderItem(index: number) {
    return `[data-testid="order-item-${index}"]`;
  }

  /**
   * Get number of order items
   */
  async getOrderItemCount(): Promise<number> {
    return await this.getElementCount('[data-testid^="order-item-"]');
  }

  /**
   * Get order item name by index
   */
  async getOrderItemName(index: number): Promise<string> {
    return await this.getText(`[data-testid="item-name-${index}"]`);
  }

  /**
   * Get order item quantity by index
   */
  async getOrderItemQuantity(index: number): Promise<number> {
    const quantityText = await this.getText(`[data-testid="item-quantity-${index}"]`);
    return parseInt(quantityText) || 0;
  }

  /**
   * Get order item price by index
   */
  async getOrderItemPrice(index: number): Promise<number> {
    const priceText = await this.getText(`[data-testid="item-price-${index}"]`);
    return parseFloat(priceText.replace('$', '')) || 0;
  }

  /**
   * Get items price total
   */
  async getItemsPrice(): Promise<number> {
    const priceText = await this.getText(this.itemsPrice);
    return parseFloat(priceText.replace('$', '')) || 0;
  }

  /**
   * Get tax price
   */
  async getTaxPrice(): Promise<number> {
    const priceText = await this.getText(this.taxPrice);
    return parseFloat(priceText.replace('$', '')) || 0;
  }

  /**
   * Get shipping price
   */
  async getShippingPrice(): Promise<number> {
    const priceText = await this.getText(this.shippingPrice);
    return parseFloat(priceText.replace('$', '')) || 0;
  }

  /**
   * Get total price
   */
  async getTotalPrice(): Promise<number> {
    const priceText = await this.getText(this.totalPrice);
    return parseFloat(priceText.replace('$', '')) || 0;
  }

  /**
   * Check if order summary is visible
   */
  async isOrderSummaryVisible(): Promise<boolean> {
    return await this.isVisible(this.orderSummary);
  }

  /**
   * Check if cart is empty
   */
  async isCartEmpty(): Promise<boolean> {
    return await this.isVisible(this.emptyCart);
  }

  // ==================== Action Methods ====================

  /**
   * Click next button
   */
  async clickNext() {
    await this.click(this.nextButton);
    await this.waitForNavigation();
  }

  /**
   * Click back button
   */
  async clickBack() {
    await this.click(this.backButton);
    await this.waitForNavigation();
  }

  /**
   * Click place order button
   */
  async clickPlaceOrder() {
    await this.click(this.placeOrderButton);
    await this.wait(1000);
  }

  /**
   * Click edit shipping link
   */
  async clickEditShipping() {
    await this.click(this.editShipping);
    await this.waitForNavigation();
  }

  /**
   * Click edit payment link
   */
  async clickEditPayment() {
    await this.click(this.editPayment);
    await this.waitForNavigation();
  }

  /**
   * Click edit cart link
   */
  async clickEditCart() {
    await this.click(this.editCart);
    await this.waitForNavigation();
  }

  // ==================== Verification Methods ====================

  /**
   * Verify page title
   */
  async verifyPageTitle(expectedTitle: string) {
    await expect(this.page.locator(this.pageTitle)).toContainText(expectedTitle);
  }

  /**
   * Verify validation error for field
   */
  async verifyValidationError(fieldName: string) {
    const errorSelector = `[data-testid="${fieldName}-error"]`;
    await expect(this.page.locator(errorSelector)).toBeVisible();
  }

  /**
   * Verify shipping address on place order page
   */
  async verifyShippingAddress(
    fullName: string,
    address: string,
    city: string,
    postalCode: string,
    country: string
  ) {
    const displayedAddress = await this.getDisplayedShippingAddress();
    expect(displayedAddress).toContain(fullName);
    expect(displayedAddress).toContain(address);
    expect(displayedAddress).toContain(city);
    expect(displayedAddress).toContain(postalCode);
    expect(displayedAddress).toContain(country);
  }

  /**
   * Verify payment method on place order page
   */
  async verifyPaymentMethod(expectedMethod: string) {
    const displayedMethod = await this.getDisplayedPaymentMethod();
    expect(displayedMethod).toContain(expectedMethod);
  }

  /**
   * Verify order items section is displayed
   */
  async verifyOrderItemsDisplayed() {
    await expect(this.page.locator(this.orderItemsSection)).toBeVisible();
    const itemCount = await this.getOrderItemCount();
    expect(itemCount).toBeGreaterThan(0);
  }

  /**
   * Verify order summary section is displayed
   */
  async verifyOrderSummaryDisplayed() {
    await expect(this.page.locator(this.orderSummarySection)).toBeVisible();
    await expect(this.page.locator(this.itemsPrice)).toBeVisible();
    await expect(this.page.locator(this.taxPrice)).toBeVisible();
    await expect(this.page.locator(this.shippingPrice)).toBeVisible();
    await expect(this.page.locator(this.totalPrice)).toBeVisible();
  }

  /**
   * Verify all place order sections are displayed
   */
  async verifyPlaceOrderSections() {
    await expect(this.page.locator(this.shippingSection)).toBeVisible();
    await expect(this.page.locator(this.paymentSection)).toBeVisible();
    await expect(this.page.locator(this.orderItemsSection)).toBeVisible();
    await expect(this.page.locator(this.orderSummarySection)).toBeVisible();
  }

  /**
   * Verify checkout progress steps
   */
  async verifyCheckoutProgress(activeStep: number) {
    const steps = ['User Login', 'Shipping Address', 'Payment Method', 'Place Order'];
    
    for (const step of steps) {
      await expect(this.page.locator(`text=${step}`)).toBeVisible();
    }
  }

  /**
   * Verify URL matches expected path
   */
  async verifyURL(expectedPath: string) {
    await expect(this.page).toHaveURL(new RegExp(expectedPath));
  }

  /**
   * Wait for order confirmation page
   */
  async waitForOrderConfirmation() {
    await this.page.waitForURL(/\/order\/[a-z0-9]+/, { timeout: 15000 });
  }

  /**
   * Verify order success (on order details page)
   */
  async verifyOrderSuccess() {
    await this.waitForOrderConfirmation();
    await expect(this.page.locator('h2')).toBeVisible();
  }

  /**
   * Verify shipping price calculation
   */
  async verifyShippingPriceCalculation() {
    const itemsPrice = await this.getItemsPrice();
    const shippingPrice = await this.getShippingPrice();
    
    // Shipping is $15 if items price <= $200, otherwise free
    const expectedShipping = itemsPrice > 200 ? 0 : 15;
    expect(shippingPrice).toBe(expectedShipping);
  }

  /**
   * Verify total price calculation
   */
  async verifyTotalPriceCalculation() {
    const items = await this.getItemsPrice();
    const tax = await this.getTaxPrice();
    const shipping = await this.getShippingPrice();
    const total = await this.getTotalPrice();
    
    const expectedTotal = parseFloat((items + tax + shipping).toFixed(2));
    expect(total).toBe(expectedTotal);
  }

  // ==================== Complete Flow Methods ====================

  /**
   * Complete shipping step
   */
  async completeShippingStep(
    fullName: string,
    address: string,
    city: string,
    postalCode: string,
    country: string
  ) {
    await this.gotoShipping();
    await this.fillShippingAddress(fullName, address, city, postalCode, country);
    await this.clickNext();
  }

  /**
   * Complete payment step
   */
  async completePaymentStep(method: 'PayPal' | 'Stripe' | 'CashOnDelivery') {
    await this.selectPaymentMethod(method);
    await this.clickNext();
  }

  /**
   * Complete full checkout flow
   */
  async completeCheckout(
    shippingInfo: {
      fullName: string;
      address: string;
      city: string;
      postalCode: string;
      country: string;
    },
    paymentMethod: 'PayPal' | 'Stripe' | 'CashOnDelivery'
  ) {
    // Complete shipping
    await this.completeShippingStep(
      shippingInfo.fullName,
      shippingInfo.address,
      shippingInfo.city,
      shippingInfo.postalCode,
      shippingInfo.country
    );

    // Complete payment
    await this.completePaymentStep(paymentMethod);

    // Place order
    await this.clickPlaceOrder();
    await this.waitForOrderConfirmation();
  }

  /**
   * Get complete order summary data
   */
  async getOrderSummaryData(): Promise<{
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
  }> {
    return {
      itemsPrice: await this.getItemsPrice(),
      taxPrice: await this.getTaxPrice(),
      shippingPrice: await this.getShippingPrice(),
      totalPrice: await this.getTotalPrice(),
    };
  }

  /**
   * Get all order items data
   */
  async getAllOrderItems(): Promise<Array<{
    name: string;
    quantity: number;
    price: number;
  }>> {
    const count = await this.getOrderItemCount();
    const items: Array<{
      name: string;
      quantity: number;
      price: number;
    }> = [];
    
    for (let i = 0; i < count; i++) {
      items.push({
        name: await this.getOrderItemName(i),
        quantity: await this.getOrderItemQuantity(i),
        price: await this.getOrderItemPrice(i),
      });
    }
    
    return items;
  }

  /**
   * Check if place order button is disabled
   */
  async isPlaceOrderButtonDisabled(): Promise<boolean> {
    return await this.page.locator(this.placeOrderButton).isDisabled();
  }

  /**
   * Check if next button is visible
   */
  async isNextButtonVisible(): Promise<boolean> {
    return await this.isVisible(this.nextButton);
  }

  /**
   * Check if back button is visible
   */
  async isBackButtonVisible(): Promise<boolean> {
    return await this.isVisible(this.backButton);
  }
}