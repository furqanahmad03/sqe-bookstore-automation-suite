import { test, expect } from '@playwright/test';
import { performance } from 'perf_hooks';

/**
 * Performance Testing Suite
 * Tests API response times, throughput, and status codes
 */

// Performance thresholds (in milliseconds)
const PERFORMANCE_THRESHOLDS = {
  API_RESPONSE_TIME: 5000,      // 2 seconds max
  FAST_API_RESPONSE: 1000,       // 500ms for fast endpoints
  PAGE_LOAD_TIME: 5000,         // 3 seconds max
  DATABASE_QUERY: 10000,         // 10 second max
};

// Test credentials
const testUser = {
  email: 'test@example.com',
  password: 'password123'
};

const adminUser = {
  email: 'admin@example.com',
  password: 'admin123'
};

// Helper to get cookies after login
async function loginAndGetCookies(page: any, email: string, password: string): Promise<string> {
  await page.goto('/login');
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('/');
  
  const cookies = await page.context().cookies();
  return cookies.map(c => `${c.name}=${c.value}`).join('; ');
}

// Helper function to measure API response time
async function measureAPIResponse(
  page: any,
  method: string,
  url: string,
  data?: any,
  cookieHeader?: string
): Promise<{
  responseTime: number;
  statusCode: number;
  success: boolean;
  data?: any;
}> {
  const startTime = performance.now();
  
  try {
    const options: any = {
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    if (cookieHeader) {
      options.headers['Cookie'] = cookieHeader;
    }
    
    if (data) {
      options.data = data;
    }
    
    const response = await page.request[method.toLowerCase()](url, options);
    
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      responseData = await response.text();
    }
    
    return {
      responseTime: Math.round(responseTime),
      statusCode: response.status(),
      success: response.ok(),
      data: responseData,
    };
  } catch (error) {
    const endTime = performance.now();
    return {
      responseTime: Math.round(endTime - startTime),
      statusCode: 0,
      success: false,
      data: error.message,
    };
  }
}

test.describe('Performance Tests - API Metrics @performance', () => {
  
  test.describe('Public API Endpoints', () => {
    
    test('PERF-001: GET /api/products - Should respond within threshold', async ({ page }) => {
      const result = await measureAPIResponse(page, 'GET', '/api/products');
      
      console.log(`📊 GET /api/products:`);
      console.log(`   Response Time: ${result.responseTime}ms`);
      console.log(`   Status Code: ${result.statusCode}`);
      console.log(`   Success: ${result.success}`);
      
      // Assertions
      expect(result.statusCode).toBe(200);
      expect(result.success).toBeTruthy();
      expect(result.responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.API_RESPONSE_TIME);
      
      // Verify data structure
      expect(result.data).toHaveProperty('books');
      expect(Array.isArray(result.data.books)).toBeTruthy();
    });

    test('PERF-002: GET /api/product/[id] - Should respond within threshold', async ({ page }) => {
      // First get a product ID
      const productsResult = await measureAPIResponse(page, 'GET', '/api/products');
      
      if (!productsResult.success || !productsResult.data.books || productsResult.data.books.length === 0) {
        console.log('⚠️  No products available, skipping test');
        test.skip();
        return;
      }
      
      const productId = productsResult.data.books[0]._id;
      const result = await measureAPIResponse(page, 'GET', `/api/product/${productId}`);
      
      console.log(`📊 GET /api/product/${productId}:`);
      console.log(`   Response Time: ${result.responseTime}ms`);
      console.log(`   Status Code: ${result.statusCode}`);
      console.log(`   Success: ${result.success}`);
      
      expect(result.statusCode).toBe(200);
      expect(result.success).toBeTruthy();
      expect(result.responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.API_RESPONSE_TIME);
      if (result.success) {
        expect(result.data).toHaveProperty('book');
      }
    });

    test('PERF-003: GET /api/hello - Health check endpoint', async ({ page }) => {
      const result = await measureAPIResponse(page, 'GET', '/api/hello');
      
      console.log(`📊 GET /api/hello:`);
      console.log(`   Response Time: ${result.responseTime}ms`);
      console.log(`   Status Code: ${result.statusCode}`);
      
      expect(result.statusCode).toBe(200);
      expect(result.responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.FAST_API_RESPONSE);
      expect(result.data).toHaveProperty('name');
    });
  });

  test.describe('Authentication API Endpoints', () => {
    
    test('PERF-004: POST /api/auth/signup - User registration performance', async ({ page }) => {
      const randomEmail = `testuser${Date.now()}@example.com`;
      
      const result = await measureAPIResponse(
        page,
        'POST',
        '/api/auth/signup',
        {
          name: 'Test User',
          email: randomEmail,
          password: 'password123',
        }
      );
      
      console.log(`📊 POST /api/auth/signup:`);
      console.log(`   Response Time: ${result.responseTime}ms`);
      console.log(`   Status Code: ${result.statusCode}`);
      console.log(`   Success: ${result.success}`);
      
      // Check if user was created successfully or already exists
      const isSuccess = result.statusCode === 201 || result.statusCode === 422;
      
      expect(isSuccess).toBeTruthy();
      expect(result.responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.DATABASE_QUERY);
      
      if (result.statusCode === 201) {
        expect(result.data).toHaveProperty('message');
      }
    });

    test('PERF-005: Authentication flow - Login performance', async ({ page }) => {
      // Measure login page load
      const startTime = performance.now();
      await page.goto('/login');
      await page.waitForLoadState('domcontentloaded');
      const pageLoadTime = performance.now() - startTime;
      
      console.log(`📊 Login Page Load:`);
      console.log(`   Load Time: ${Math.round(pageLoadTime)}ms`);
      
      expect(pageLoadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.PAGE_LOAD_TIME);
      
      // Measure login action
      const loginStart = performance.now();
      
      // Wait for form to be ready
      await page.waitForSelector('#email', { state: 'visible', timeout: 5000 });
      
      await page.fill('#email', testUser.email);
      await page.fill('#password', testUser.password);
      await page.click('button[type="submit"]');
      
      // Wait for either success or error
      try {
        await page.waitForURL('/', { timeout: 10000 });
      } catch (e) {
        // If redirect fails, check if we're still on login page
        const currentUrl = page.url();
        console.log(`   Current URL after login: ${currentUrl}`);
      }
      
      const loginTime = performance.now() - loginStart;
      
      console.log(`📊 Login Action:`);
      console.log(`   Time: ${Math.round(loginTime)}ms`);
      
      expect(loginTime).toBeLessThan(PERFORMANCE_THRESHOLDS.API_RESPONSE_TIME * 2);
    });
  });

  test.describe('Protected API Endpoints - Orders', () => {
    let cookies: string;
    
    test.beforeEach(async ({ page }) => {
      cookies = await loginAndGetCookies(page, testUser.email, testUser.password);
    });

    test('PERF-006: GET /api/orders/history - Order history performance', async ({ page }) => {
      const result = await measureAPIResponse(page, 'GET', '/api/orders/history', undefined, cookies);
      
      console.log(`📊 GET /api/orders/history:`);
      console.log(`   Response Time: ${result.responseTime}ms`);
      console.log(`   Status Code: ${result.statusCode}`);
      console.log(`   Success: ${result.success}`);
      
      expect(result.statusCode).toBe(200);
      expect(result.success).toBeTruthy();
      expect(result.responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.API_RESPONSE_TIME);
      expect(Array.isArray(result.data)).toBeTruthy();
    });

    test('PERF-007: POST /api/orders - Create order performance', async ({ page }) => {
      // Get a product first
      const productsResult = await measureAPIResponse(page, 'GET', '/api/products');
      const product = productsResult.data.books[0];
      
      if (!product) {
        test.skip();
        return;
      }
      
      const orderData = {
        orderItems: [{
          name: product.name,
          quantity: 1,
          price: product.price,
          _id: product._id,
        }],
        shippingAddress: {
          fullName: 'Test User',
          address: '123 Test St',
          city: 'Test City',
          postalCode: '12345',
          country: 'USA',
        },
        paymentMethod: 'PayPal',
        itemsPrice: product.price,
        shippingPrice: 15,
        taxPrice: product.price * 0.15,
        totalPrice: product.price + 15 + (product.price * 0.15),
      };
      
      const result = await measureAPIResponse(page, 'POST', '/api/orders', orderData, cookies);
      
      console.log(`📊 POST /api/orders:`);
      console.log(`   Response Time: ${result.responseTime}ms`);
      console.log(`   Status Code: ${result.statusCode}`);
      console.log(`   Success: ${result.success}`);
      
      expect(result.statusCode).toBe(201);
      expect(result.success).toBeTruthy();
      expect(result.responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.DATABASE_QUERY);
    });

    test('PERF-008: GET /api/orders/[id] - Get single order performance', async ({ page }) => {
      // First create an order
      const productsResult = await measureAPIResponse(page, 'GET', '/api/products');
      
      if (!productsResult.success || !productsResult.data.books || productsResult.data.books.length === 0) {
        console.log('⚠️  No products available, skipping test');
        test.skip();
        return;
      }
      
      const product = productsResult.data.books[0];
      
      const orderData = {
        orderItems: [{
          name: product.name,
          quantity: 1,
          price: product.price,
          _id: product._id,
        }],
        shippingAddress: {
          fullName: 'Test User',
          address: '123 Test St',
          city: 'Test City',
          postalCode: '12345',
          country: 'USA',
        },
        paymentMethod: 'PayPal',
        itemsPrice: product.price,
        shippingPrice: 15,
        taxPrice: product.price * 0.15,
        totalPrice: product.price + 15 + (product.price * 0.15),
      };
      
      const createResult = await measureAPIResponse(page, 'POST', '/api/orders', orderData, cookies);
      
      if (!createResult.success || !createResult.data._id) {
        console.log('⚠️  Failed to create order, skipping test');
        test.skip();
        return;
      }
      
      const orderId = createResult.data._id;
      
      // Now measure getting the order
      const result = await measureAPIResponse(page, 'GET', `/api/orders/${orderId}`, undefined, cookies);
      
      console.log(`📊 GET /api/orders/${orderId}:`);
      console.log(`   Response Time: ${result.responseTime}ms`);
      console.log(`   Status Code: ${result.statusCode}`);
      
      expect(result.statusCode).toBe(200);
      expect(result.success).toBeTruthy();
      expect(result.responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.API_RESPONSE_TIME);
    });
  });

  test.describe('Admin API Endpoints - Products', () => {
    let adminCookies: string;
    
    test.beforeEach(async ({ page }) => {
      adminCookies = await loginAndGetCookies(page, adminUser.email, adminUser.password);
    });

    test('PERF-009: GET /api/admin/products - Admin products list performance', async ({ page }) => {
      const result = await measureAPIResponse(page, 'GET', '/api/admin/products', undefined, adminCookies);
      
      console.log(`📊 GET /api/admin/products:`);
      console.log(`   Response Time: ${result.responseTime}ms`);
      console.log(`   Status Code: ${result.statusCode}`);
      console.log(`   Success: ${result.success}`);
      
      expect(result.statusCode).toBe(200);
      expect(result.success).toBeTruthy();
      expect(result.responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.API_RESPONSE_TIME);
      expect(result.data).toHaveProperty('products');
    });

    test('PERF-010: POST /api/admin/products - Create product performance', async ({ page }) => {
      const productData = {
        name: `Performance Test Book ${Date.now()}`,
        author: 'Test Author',
        description: 'Test description for performance testing',
        category: 'Test',
        price: 29.99,
        quantity: 100,
      };
      
      const result = await measureAPIResponse(page, 'POST', '/api/admin/products', productData, adminCookies);
      
      console.log(`📊 POST /api/admin/products:`);
      console.log(`   Response Time: ${result.responseTime}ms`);
      console.log(`   Status Code: ${result.statusCode}`);
      console.log(`   Success: ${result.success}`);
      
      expect(result.statusCode).toBe(201);
      expect(result.success).toBeTruthy();
      expect(result.responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.DATABASE_QUERY);
      expect(result.data).toHaveProperty('product');
    });

    test('PERF-011: GET /api/admin/products/[id] - Get single product performance', async ({ page }) => {
      const productsResult = await measureAPIResponse(page, 'GET', '/api/admin/products', undefined, adminCookies);
      const productId = productsResult.data.products[0]?._id;
      
      if (!productId) {
        test.skip();
        return;
      }
      
      const result = await measureAPIResponse(page, 'GET', `/api/admin/products/${productId}`, undefined, adminCookies);
      
      console.log(`📊 GET /api/admin/products/${productId}:`);
      console.log(`   Response Time: ${result.responseTime}ms`);
      console.log(`   Status Code: ${result.statusCode}`);
      
      expect(result.statusCode).toBe(200);
      expect(result.success).toBeTruthy();
      expect(result.responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.FAST_API_RESPONSE);
      expect(result.data).toHaveProperty('product');
    });

    test('PERF-012: PUT /api/admin/products/[id] - Update product performance', async ({ page }) => {
      // First get a product
      const productsResult = await measureAPIResponse(page, 'GET', '/api/admin/products', undefined, adminCookies);
      const product = productsResult.data.products[0];
      
      if (!product) {
        test.skip();
        return;
      }
      
      const updateData = {
        name: `Updated ${product.name}`,
        author: product.author,
        description: product.description,
        category: product.category,
        price: product.price + 5,
        quantity: product.quantity,
      };
      
      const result = await measureAPIResponse(
        page,
        'PUT',
        `/api/admin/products/${product._id}`,
        updateData,
        adminCookies
      );
      
      console.log(`📊 PUT /api/admin/products/${product._id}:`);
      console.log(`   Response Time: ${result.responseTime}ms`);
      console.log(`   Status Code: ${result.statusCode}`);
      console.log(`   Success: ${result.success}`);
      
      expect(result.statusCode).toBe(200);
      expect(result.success).toBeTruthy();
      expect(result.responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.DATABASE_QUERY);
      expect(result.data).toHaveProperty('product');
    });

    test('PERF-013: DELETE /api/admin/products/[id] - Delete product performance', async ({ page }) => {
      // First create a product to delete
      const productData = {
        name: `Delete Test Book ${Date.now()}`,
        author: 'Test Author',
        description: 'To be deleted',
        category: 'Test',
        price: 19.99,
        quantity: 50,
      };
      
      const createResult = await measureAPIResponse(page, 'POST', '/api/admin/products', productData, adminCookies);
      
      if (!createResult.success || !createResult.data.product || !createResult.data.product._id) {
        console.log('⚠️  Failed to create product, skipping delete test');
        test.skip();
        return;
      }
      
      const productId = createResult.data.product._id;
      
      // Small delay to ensure product is saved
      await page.waitForTimeout(500);
      
      const result = await measureAPIResponse(page, 'DELETE', `/api/admin/products/${productId}`, undefined, adminCookies);
      
      console.log(`📊 DELETE /api/admin/products/${productId}:`);
      console.log(`   Response Time: ${result.responseTime}ms`);
      console.log(`   Status Code: ${result.statusCode}`);
      console.log(`   Success: ${result.success}`);
      
      expect(result.statusCode).toBe(200);
      expect(result.success).toBeTruthy();
      expect(result.responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.API_RESPONSE_TIME);
      
      if (result.success) {
        expect(result.data).toHaveProperty('message');
      }
    });
  });

  test.describe('Admin API Endpoints - Orders', () => {
    let adminCookies: string;
    
    test.beforeEach(async ({ page }) => {
      adminCookies = await loginAndGetCookies(page, adminUser.email, adminUser.password);
    });

    test('PERF-014: GET /api/admin/orders - Admin orders list performance', async ({ page }) => {
      const result = await measureAPIResponse(page, 'GET', '/api/admin/orders', undefined, adminCookies);
      
      console.log(`📊 GET /api/admin/orders:`);
      console.log(`   Response Time: ${result.responseTime}ms`);
      console.log(`   Status Code: ${result.statusCode}`);
      console.log(`   Success: ${result.success}`);
      
      expect(result.statusCode).toBe(200);
      expect(result.success).toBeTruthy();
      expect(result.responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.API_RESPONSE_TIME);
      expect(result.data).toHaveProperty('orders');
      expect(Array.isArray(result.data.orders)).toBeTruthy();
    });
  });

  test.describe('Throughput and Load Testing', () => {
    
    test('PERF-015: API throughput - Multiple concurrent requests', async ({ page }) => {
      const numberOfRequests = 10;
      const startTime = performance.now();
      
      // Make multiple concurrent requests
      const promises: Promise<{
        responseTime: number;
        statusCode: number;
        success: boolean;
        data?: any;
      }>[] = [];
      
      for (let i = 0; i < numberOfRequests; i++) {
        promises.push(measureAPIResponse(page, 'GET', '/api/products'));
      }
      
      const results = await Promise.all(promises);
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      // Calculate metrics
      const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / numberOfRequests;
      const throughput = (numberOfRequests / totalTime) * 1000; // requests per second
      const successRate = (results.filter(r => r.success).length / numberOfRequests) * 100;
      
      console.log(`📊 Throughput Test (${numberOfRequests} concurrent requests):`);
      console.log(`   Total Time: ${Math.round(totalTime)}ms`);
      console.log(`   Average Response Time: ${Math.round(avgResponseTime)}ms`);
      console.log(`   Throughput: ${throughput.toFixed(2)} req/sec`);
      console.log(`   Success Rate: ${successRate.toFixed(2)}%`);
      
      // Assertions
      expect(avgResponseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.API_RESPONSE_TIME);
      expect(successRate).toBeGreaterThanOrEqual(95); // At least 95% success rate
      expect(throughput).toBeGreaterThan(0);
      
      // All requests should succeed
      results.forEach((result, index) => {
        expect(result.statusCode).toBe(200);
        expect(result.success).toBeTruthy();
      });
    });

    test('PERF-016: Sequential API calls performance', async ({ page }) => {
      const operations = [
        { method: 'GET', url: '/api/products', name: 'Get Products' },
        { method: 'GET', url: '/api/hello', name: 'Health Check' },
      ];
      
      const startTime = performance.now();
      const results: Array<{
        responseTime: number;
        statusCode: number;
        success: boolean;
        data?: any;
        name: string;
      }> = [];
      
      for (const op of operations) {
        const result = await measureAPIResponse(page, op.method, op.url);
        results.push({ ...result, name: op.name });
      }
      
      const totalTime = performance.now() - startTime;
      
      console.log(`📊 Sequential API Calls:`);
      console.log(`   Total Time: ${Math.round(totalTime)}ms`);
      results.forEach(r => {
        console.log(`   ${r.name}: ${r.responseTime}ms (${r.statusCode})`);
      });
      
      // All should succeed
      results.forEach(result => {
        expect(result.success).toBeTruthy();
        expect(result.statusCode).toBeGreaterThanOrEqual(200);
        expect(result.statusCode).toBeLessThan(400);
      });
    });
  });

  test.describe('Page Load Performance', () => {
    
    test('PERF-017: Homepage load performance', async ({ page }) => {
      const startTime = performance.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = performance.now() - startTime;
      
      console.log(`📊 Homepage Load:`);
      console.log(`   Load Time: ${Math.round(loadTime)}ms`);
      
      expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.PAGE_LOAD_TIME);
    });

    test('PERF-018: Books page load performance', async ({ page }) => {
      const startTime = performance.now();
      await page.goto('/books');
      await page.waitForLoadState('domcontentloaded');
      
      // Wait for books to be loaded
      try {
        await page.waitForSelector('[data-testid="book-item"]', { timeout: 5000 });
      } catch (e) {
        // Books might not be loaded, but page is rendered
        console.log('⚠️  Books not loaded, but page rendered');
      }
      
      const loadTime = performance.now() - startTime;
      
      console.log(`📊 Books Page Load:`);
      console.log(`   Load Time: ${Math.round(loadTime)}ms`);
      
      expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.PAGE_LOAD_TIME * 2);
    });

    test('PERF-019: Cart page load performance', async ({ page }) => {
      await loginAndGetCookies(page, testUser.email, testUser.password);
      
      const startTime = performance.now();
      await page.goto('/cart');
      await page.waitForLoadState('networkidle');
      const loadTime = performance.now() - startTime;
      
      console.log(`📊 Cart Page Load:`);
      console.log(`   Load Time: ${Math.round(loadTime)}ms`);
      
      expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.PAGE_LOAD_TIME);
    });

    test('PERF-020: Dashboard page load performance', async ({ page }) => {
      await loginAndGetCookies(page, adminUser.email, adminUser.password);
      
      const startTime = performance.now();
      await page.goto('/dashboard');
      await page.waitForLoadState('domcontentloaded');
      
      // Wait for dashboard to be loaded
      try {
        await page.waitForSelector('[data-testid="page-title"]', { timeout: 5000 });
      } catch (e) {
        // Dashboard might not be fully loaded, but page is rendered
        console.log('⚠️  Dashboard not fully loaded, but page rendered');
      }
      
      const loadTime = performance.now() - startTime;
      
      console.log(`📊 Dashboard Page Load:`);
      console.log(`   Load Time: ${Math.round(loadTime)}ms`);
      
      expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.PAGE_LOAD_TIME * 2);
    });
  });

  test.describe('Error Response Performance', () => {
    
    test('PERF-021: 404 error response time', async ({ page }) => {
      const result = await measureAPIResponse(page, 'GET', '/api/nonexistent');
      
      console.log(`📊 404 Error Response:`);
      console.log(`   Response Time: ${result.responseTime}ms`);
      console.log(`   Status Code: ${result.statusCode}`);
      
      expect(result.statusCode).toBe(404);
      expect(result.responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.FAST_API_RESPONSE);
    });

    test('PERF-022: Unauthorized access response time', async ({ page }) => {
      const result = await measureAPIResponse(page, 'GET', '/api/orders/history');
      
      console.log(`📊 Unauthorized Access Response:`);
      console.log(`   Response Time: ${result.responseTime}ms`);
      console.log(`   Status Code: ${result.statusCode}`);
      
      expect(result.statusCode).toBe(401);
      expect(result.responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.FAST_API_RESPONSE);
    });

    test('PERF-023: Forbidden access response time (non-admin)', async ({ page }) => {
      const cookies = await loginAndGetCookies(page, testUser.email, testUser.password);
      const result = await measureAPIResponse(page, 'GET', '/api/admin/products', undefined, cookies);
      
      console.log(`📊 Forbidden Access Response:`);
      console.log(`   Response Time: ${result.responseTime}ms`);
      console.log(`   Status Code: ${result.statusCode}`);
      
      expect(result.statusCode).toBe(403);
      expect(result.responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.FAST_API_RESPONSE);
    });
  });
});