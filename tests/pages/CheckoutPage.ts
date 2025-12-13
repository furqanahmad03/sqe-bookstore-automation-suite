import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Checkout Page Object Model
 * Handles multi-step checkout process
 */
export class CheckoutPage extends BasePage {
  // Shipping Address Selectors
  private fullNameInput = '#fullName';
  private addressInput = '#address';
  private cityInput = '#city';
  private postalCodeInput = '#postalCode';
  private countryInput = '#country';
  
  // Payment Method Selectors
  private paypalRadio = '#PayPal';
  private stripeRadio = '#Stripe';
  private codRadio = '#CashOnDelivery';
  
  // Common Selectors
  private nextButton = 'button[type="submit"]';
  private backButton = 'button:has-text("Back")';
  private placeOrderButton = 'button:has-text("Place Order")';
  private checkoutProgress = '.CheckoutProgress';
  private orderSummary = '.oder_page_summary';
  private successMessage = '.status_success';

  constructor(page: Page) {
    super(page);
  }

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

  /**
   * Fill shipping address
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
   * Fill with default shipping address
   */
  async fillDefaultShippingAddress() {
    await this.fillShippingAddress(
      'John Doe',
      '123 Main Street',
      'New York',
      '10001',
      'United States'
    );
  }

  /**
   * Select payment method
   */
  async selectPaymentMethod(method: 'PayPal' | 'Stripe' | 'CashOnDelivery') {
    const radioMap = {
      'PayPal': this.paypalRadio,
      'Stripe': this.stripeRadio,
      'CashOnDelivery': this.codRadio
    };
    
    await this.click(radioMap[method]);
  }

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
   * Place order
   */
  async placeOrder() {
    await this.click(this.placeOrderButton);
    await this.waitForNavigation();
  }

  /**
   * Complete full checkout process
   */
  async completeCheckout(
    shippingData?: {
      fullName: string,
      address: string,
      city: string,
      postalCode: string,
      country: string
    },
    paymentMethod: 'PayPal' | 'Stripe' | 'CashOnDelivery' = 'CashOnDelivery'
  ) {
    // Step 1: Shipping Address
    await this.gotoShipping();
    if (shippingData) {
      await this.fillShippingAddress(
        shippingData.fullName,
        shippingData.address,
        shippingData.city,
        shippingData.postalCode,
        shippingData.country
      );
    } else {
      await this.fillDefaultShippingAddress();
    }
    await this.clickNext();

    // Step 2: Payment Method
    await this.selectPaymentMethod(paymentMethod);
    await this.clickNext();

    // Step 3: Place Order
    await this.placeOrder();
  }

  /**
   * Get current checkout step
   */
  async getCurrentStep(): Promise<number> {
    const activeSteps = await this.page.locator('.CheckoutProgress .active').count();
    return activeSteps;
  }

  /**
   * Verify shipping page elements
   */
  async verifyShippingPageElements() {
    await expect(this.page.locator('h2')).toContainText('Shipping Address');
    await expect(this.page.locator(this.fullNameInput)).toBeVisible();
    await expect(this.page.locator(this.addressInput)).toBeVisible();
    await expect(this.page.locator(this.cityInput)).toBeVisible();
    await expect(this.page.locator(this.postalCodeInput)).toBeVisible();
    await expect(this.page.locator(this.countryInput)).toBeVisible();
  }

  /**
   * Verify payment page elements
   */
  async verifyPaymentPageElements() {
    await expect(this.page.locator('h2')).toContainText('Payment Method');
    await expect(this.page.locator(this.paypalRadio)).toBeVisible();
    await expect(this.page.locator(this.stripeRadio)).toBeVisible();
    await expect(this.page.locator(this.codRadio)).toBeVisible();
  }

  /**
   * Verify place order page elements
   */
  async verifyPlaceOrderPageElements() {
    await expect(this.page.locator('h2')).toContainText('Place Order');
    await expect(this.page.locator(this.orderSummary)).toBeVisible();
    await expect(this.page.locator(this.placeOrderButton)).toBeVisible();
  }

  /**
   * Get order total from summary
   */
  async getOrderTotal(): Promise<number> {
    const totalText = await this.page
      .locator('.order_summary_row:has-text("Total") div')
      .last()
      .textContent();
    return parseFloat(totalText?.replace('$', '') || '0');
  }

  /**
   * Get order ID after successful placement
   */
  async getOrderId(): Promise<string> {
    // Wait for navigation to order page
    await this.page.waitForURL(/\/order\/.+/);
    const url = this.getCurrentURL();
    return url.split('/order/')[1];
  }

  /**
   * Verify order success
   */
  async verifyOrderSuccess() {
    await expect(this.page).toHaveURL(/\/order\/.+/);
  }

  /**
   * Get error messages on form
   */
  async getFormErrors(): Promise<string[]> {
    const errors = await this.page.locator('.error').all();
    return await Promise.all(errors.map(e => e.textContent() || '') as unknown as string[]);
  }
}