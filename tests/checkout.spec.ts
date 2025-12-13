import { test, expect } from '@playwright/test';
import { CheckoutPage } from './pages/CheckoutPage';

// Test data
const testShippingInfo = {
  fullName: 'John Doe',
  address: '123 Main Street',
  city: 'New York',
  postalCode: '10001',
  country: 'USA'
};

const testUser = {
  email: 'test@example.com',
  password: 'password123'
};

// Helper function to login
async function login(page, email: string, password: string) {
  await page.goto('/login');
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('/');
}

// Helper function to add item to cart
async function addItemToCart(page) {
  await page.goto('/books');
  await page.waitForTimeout(1000);
  const addToCartButton = page.locator('[data-testid="add-to-cart"]').first();
  await addToCartButton.click();
  await page.waitForTimeout(500);
}

test.describe('Checkout Flow Tests', () => {
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    checkoutPage = new CheckoutPage(page);
    
    // Login and add item to cart before each test
    await login(page, testUser.email, testUser.password);
    await addItemToCart(page);
  });

  test.describe('Shipping Address Tests @functional', () => {
    
    test('TC-CHECKOUT-001: Should fill and submit valid shipping address @smoke', async ({ page }) => {
      await checkoutPage.gotoShipping();
      
      // Verify page title
      await checkoutPage.verifyPageTitle('Shipping Address');
      
      // Verify form is visible
      const isFormVisible = await checkoutPage.isShippingFormVisible();
      expect(isFormVisible).toBeTruthy();
      
      // Fill shipping form
      await checkoutPage.fillShippingAddress(
        testShippingInfo.fullName,
        testShippingInfo.address,
        testShippingInfo.city,
        testShippingInfo.postalCode,
        testShippingInfo.country
      );
      
      // Submit form
      await checkoutPage.clickNext();
      
      // Verify navigation to payment page
      await checkoutPage.verifyURL('/payment');
    });

    test('TC-CHECKOUT-002: Should show validation error for empty full name', async ({ page }) => {
      await checkoutPage.gotoShipping();
      
      // Fill all fields except full name
      await page.fill('[data-testid="address-input"]', testShippingInfo.address);
      await page.fill('[data-testid="city-input"]', testShippingInfo.city);
      await page.fill('[data-testid="postalCode-input"]', testShippingInfo.postalCode);
      await page.fill('[data-testid="country-input"]', testShippingInfo.country);
      
      // Submit form
      await checkoutPage.clickNext();
      
      // Verify validation error appears
      await checkoutPage.verifyValidationError('fullName');
    });

    test('TC-CHECKOUT-003: Should show validation error for empty address', async ({ page }) => {
      await checkoutPage.gotoShipping();
      
      // Fill all fields except address
      await page.fill('[data-testid="fullName-input"]', testShippingInfo.fullName);
      await page.fill('[data-testid="city-input"]', testShippingInfo.city);
      await page.fill('[data-testid="postalCode-input"]', testShippingInfo.postalCode);
      await page.fill('[data-testid="country-input"]', testShippingInfo.country);
      
      // Submit form
      await checkoutPage.clickNext();
      
      // Verify validation error appears
      await checkoutPage.verifyValidationError('address');
    });

    test('TC-CHECKOUT-004: Should persist shipping data when navigating back @regression', async ({ page }) => {
      await checkoutPage.gotoShipping();
      
      // Fill and submit shipping form
      await checkoutPage.fillShippingAddress(
        testShippingInfo.fullName,
        testShippingInfo.address,
        testShippingInfo.city,
        testShippingInfo.postalCode,
        testShippingInfo.country
      );
      await checkoutPage.clickNext();
      
      // Go to payment page and back
      await checkoutPage.verifyURL('/payment');
      await checkoutPage.clickBack();
      
      // Verify shipping data is persisted
      const values = await checkoutPage.getShippingAddressValues();
      expect(values.fullName).toBe(testShippingInfo.fullName);
      expect(values.address).toBe(testShippingInfo.address);
      expect(values.city).toBe(testShippingInfo.city);
      expect(values.postalCode).toBe(testShippingInfo.postalCode);
      expect(values.country).toBe(testShippingInfo.country);
    });
  });

  test.describe('Payment Method Tests @functional', () => {
    
    test.beforeEach(async ({ page }) => {
      // Complete shipping step before payment tests
      await checkoutPage.completeShippingStep(
        testShippingInfo.fullName,
        testShippingInfo.address,
        testShippingInfo.city,
        testShippingInfo.postalCode,
        testShippingInfo.country
      );
    });

    test('TC-CHECKOUT-005: Should select PayPal payment method @smoke', async ({ page }) => {
      await checkoutPage.verifyPageTitle('Payment Method');
      
      // Verify form is visible
      const isFormVisible = await checkoutPage.isPaymentFormVisible();
      expect(isFormVisible).toBeTruthy();
      
      // Select PayPal
      await checkoutPage.selectPaymentMethod('PayPal');
      
      // Verify PayPal is selected
      const isSelected = await checkoutPage.isPaymentMethodSelected('PayPal');
      expect(isSelected).toBeTruthy();
      
      // Submit and verify navigation
      await checkoutPage.clickNext();
      await checkoutPage.verifyURL('/placeorder');
    });

    test('TC-CHECKOUT-006: Should select Stripe payment method', async ({ page }) => {
      await checkoutPage.selectPaymentMethod('Stripe');
      
      const isSelected = await checkoutPage.isPaymentMethodSelected('Stripe');
      expect(isSelected).toBeTruthy();
      
      await checkoutPage.clickNext();
      await checkoutPage.verifyURL('/placeorder');
    });

    test('TC-CHECKOUT-007: Should select Cash on Delivery payment method', async ({ page }) => {
      await checkoutPage.selectPaymentMethod('CashOnDelivery');
      
      const isSelected = await checkoutPage.isPaymentMethodSelected('CashOnDelivery');
      expect(isSelected).toBeTruthy();
      
      await checkoutPage.clickNext();
      await checkoutPage.verifyURL('/placeorder');
    });

    test('TC-CHECKOUT-008: Should navigate back to shipping from payment', async ({ page }) => {
      await checkoutPage.clickBack();
      
      await checkoutPage.verifyURL('/shipping');
      await checkoutPage.verifyPageTitle('Shipping Address');
    });
  });

  test.describe('Place Order Tests @functional', () => {
    
    test.beforeEach(async ({ page }) => {
      // Complete shipping and payment steps
      await checkoutPage.completeShippingStep(
        testShippingInfo.fullName,
        testShippingInfo.address,
        testShippingInfo.city,
        testShippingInfo.postalCode,
        testShippingInfo.country
      );
      
      await checkoutPage.completePaymentStep('PayPal');
    });

    test('TC-CHECKOUT-009: Should display order summary correctly @smoke', async ({ page }) => {
      await checkoutPage.verifyPageTitle('Place Order');
      
      // Verify order summary is visible
      const isVisible = await checkoutPage.isOrderSummaryVisible();
      expect(isVisible).toBeTruthy();
      
      // Verify all sections are displayed
      await checkoutPage.verifyPlaceOrderSections();
      
      // Verify shipping address
      await checkoutPage.verifyShippingAddress(
        testShippingInfo.fullName,
        testShippingInfo.address,
        testShippingInfo.city,
        testShippingInfo.postalCode,
        testShippingInfo.country
      );
      
      // Verify payment method
      await checkoutPage.verifyPaymentMethod('PayPal');
      
      // Verify order items
      await checkoutPage.verifyOrderItemsDisplayed();
      
      // Verify order summary
      await checkoutPage.verifyOrderSummaryDisplayed();
    });

    test('TC-CHECKOUT-010: Should edit shipping address from place order page', async ({ page }) => {
      await checkoutPage.clickEditShipping();
      
      await checkoutPage.verifyURL('/shipping');
      
      // Verify shipping data is still there
      const values = await checkoutPage.getShippingAddressValues();
      expect(values.fullName).toBe(testShippingInfo.fullName);
    });

    test('TC-CHECKOUT-011: Should edit payment method from place order page', async ({ page }) => {
      await checkoutPage.clickEditPayment();
      
      await checkoutPage.verifyURL('/payment');
      
      // Verify PayPal is still selected
      const isSelected = await checkoutPage.isPaymentMethodSelected('PayPal');
      expect(isSelected).toBeTruthy();
    });

    test('TC-CHECKOUT-012: Should complete order placement successfully @smoke', async ({ page }) => {
      // Verify place order button is not disabled
      const isDisabled = await checkoutPage.isPlaceOrderButtonDisabled();
      expect(isDisabled).toBeFalsy();
      
      // Place order
      await checkoutPage.clickPlaceOrder();
      
      // Wait for order confirmation page
      await checkoutPage.waitForOrderConfirmation();
      
      // Verify order details page is displayed
      await checkoutPage.verifyOrderSuccess();
    });

    test('TC-CHECKOUT-013: Should display correct price calculations', async ({ page }) => {
      // Get order summary data
      const summary = await checkoutPage.getOrderSummaryData();
      
      // Verify all prices are numbers and greater than 0
      expect(summary.itemsPrice).toBeGreaterThan(0);
      expect(summary.taxPrice).toBeGreaterThanOrEqual(0);
      expect(summary.shippingPrice).toBeGreaterThanOrEqual(0);
      expect(summary.totalPrice).toBeGreaterThan(0);
      
      // Verify shipping price calculation
      await checkoutPage.verifyShippingPriceCalculation();
      
      // Verify total price calculation
      await checkoutPage.verifyTotalPriceCalculation();
    });
  });

  test.describe('End-to-End Checkout Tests @regression', () => {
    
    test('TC-CHECKOUT-014: Should complete full checkout flow with PayPal @smoke', async ({ page }) => {
      await checkoutPage.completeCheckout(testShippingInfo, 'PayPal');
      await checkoutPage.verifyOrderSuccess();
    });

    test('TC-CHECKOUT-015: Should complete full checkout flow with Stripe', async ({ page }) => {
      await checkoutPage.completeCheckout(testShippingInfo, 'Stripe');
      await checkoutPage.verifyOrderSuccess();
    });

    test('TC-CHECKOUT-016: Should complete full checkout flow with Cash on Delivery', async ({ page }) => {
      await checkoutPage.completeCheckout(testShippingInfo, 'CashOnDelivery');
      await checkoutPage.verifyOrderSuccess();
    });
  });

  test.describe('Navigation Tests @functional', () => {
    
    test('TC-CHECKOUT-017: Should navigate through entire checkout flow', async ({ page }) => {
      // Start at shipping
      await checkoutPage.gotoShipping();
      await checkoutPage.verifyURL('/shipping');
      
      // Complete shipping
      await checkoutPage.fillShippingAddress(
        testShippingInfo.fullName,
        testShippingInfo.address,
        testShippingInfo.city,
        testShippingInfo.postalCode,
        testShippingInfo.country
      );
      await checkoutPage.clickNext();
      
      // Verify payment page
      await checkoutPage.verifyURL('/payment');
      
      // Complete payment
      await checkoutPage.selectPaymentMethod('PayPal');
      await checkoutPage.clickNext();
      
      // Verify place order page
      await checkoutPage.verifyURL('/placeorder');
      
      // Verify all sections
      await checkoutPage.verifyPlaceOrderSections();
    });
  });
});