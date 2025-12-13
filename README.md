# 📚 Book Store - E-Commerce Platform

A full-stack e-commerce bookstore application built with Next.js, MongoDB, and comprehensive end-to-end testing using Playwright.

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure login/registration with NextAuth.js
- **Book Browsing**: Search and filter through available books
- **Shopping Cart**: Add/remove items, update quantities
- **Checkout Process**: Multi-step checkout with shipping and payment
- **Order Management**: View order history and details
- **Admin Dashboard**: CRUD operations for books and order management

### Technical Highlights
- **Server-Side Rendering** with Next.js
- **RESTful API** endpoints
- **Responsive Design** with SCSS modules
- **Session Management** with cookies
- **Database Integration** with MongoDB & Mongoose
- **Form Validation** with React Hook Form
- **Notification System** with custom provider
- **Component-Based Architecture**

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Testing](#testing)
  - [Test Structure](#test-structure)
  - [Running Tests](#running-tests)
  - [Test Coverage](#test-coverage)
  - [Page Object Model](#page-object-model)
  - [Writing Tests](#writing-tests)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

## 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/book-store.git
cd book-store
```

2. **Install dependencies**
```bash
npm install
```

3. **Install Playwright browsers**
```bash
npx playwright install
```

## ⚙️ Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bookstore
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
BASE_URL=http://localhost:3000
```

### Creating Test Data

The application requires initial data to function properly. You can:

1. **Manually create data** through the admin dashboard
2. **Use a seed script** (create `pages/api/seed.js` - see Database Schema section)
3. **Import sample data** directly into MongoDB

### Admin User Setup

Create an admin user in MongoDB:

```javascript
// In MongoDB shell or Compass
db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "$2a$10$hashed_password_here", // Use bcrypt to hash "admin123"
  isAdmin: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Mode

```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Using Docker

```bash
# Build and run with Docker Compose
docker-compose up

# Run tests in Docker
docker-compose run tests
```

## 🧪 Testing

This project includes a comprehensive end-to-end testing suite using Playwright with 50+ test cases covering all major functionality.

### Test Structure

```
tests/
├── auth.spec.ts           # Authentication tests (10 tests)
├── books.spec.ts          # Book browsing tests (10 tests)
├── cart.spec.ts           # Shopping cart tests (11 tests)
├── checkout.spec.ts       # Checkout flow tests (17 tests)
├── dashboard.spec.ts      # Admin dashboard tests (11 tests)
├── pages/                 # Page Object Models
│   ├── BasePage.ts        # Base class with common methods
│   ├── LoginPage.ts       # Login page object
│   ├── RegisterPage.ts    # Registration page object
│   ├── BooksPage.ts       # Books page object
│   ├── CartPage.ts        # Cart page object
│   ├── CheckoutPage.ts    # Checkout page object
│   └── AdminPage.ts       # Admin dashboard object
└── playwright.config.ts   # Playwright configuration
```

### Test Categories

Tests are organized with tags for selective execution:

- **`@smoke`**: Critical path tests (quick validation)
- **`@functional`**: Feature-specific tests
- **`@regression`**: Full regression suite
- **`@security`**: Security-related tests

### Running Tests

#### Run All Tests
```bash
npm test
# or
npm run test:e2e
```

#### Run Specific Test Suites
```bash
# Authentication tests
npm run test:auth

# Book browsing tests
npm run test:books

# Shopping cart tests
npm run test:cart

# Checkout flow tests
npm run test:checkout

# Admin dashboard tests
npm run test:admin
```

#### Run Tests by Tag
```bash
# Run only smoke tests
npm run test:smoke

# Run functional tests
npm run test:functional

# Run regression tests
npm run test:regression
```

#### Run Tests in Different Browsers
```bash
# Chromium only
npm run test:chromium

# Mobile browsers
npm run test:mobile
```

#### Interactive Testing
```bash
# Run tests in headed mode (see browser)
npm run test:headed

# Run tests in UI mode (interactive)
npm run test:ui

# Debug mode (step through tests)
npm run test:debug

# Generate tests using codegen
npm run codegen
```

### Test Reports

After running tests, view the HTML report:

```bash
npm run report
```

Reports are generated in the `playwright-report/` directory with:
- Screenshots of failures
- Video recordings of failed tests
- Detailed test execution logs
- Performance metrics

### Test Coverage

#### Authentication Tests (TC-AUTH-001 to TC-AUTH-010)
- ✅ User registration with valid data
- ✅ Password mismatch validation
- ✅ Email format validation
- ✅ Password length validation
- ✅ User login with valid credentials
- ✅ Invalid credentials handling
- ✅ Empty field validation
- ✅ Navigation between pages
- ✅ Password masking
- ✅ Session persistence

#### Books Tests (TC-BOOKS-001 to TC-BOOKS-010)
- ✅ Display books list
- ✅ Search functionality
- ✅ No results handling
- ✅ Clear search filter
- ✅ Add single book to cart
- ✅ Add multiple books to cart
- ✅ View book details
- ✅ Book information accuracy
- ✅ Responsive design
- ✅ Add to cart notification

#### Cart Tests (TC-CART-001 to TC-CART-011)
- ✅ View cart with items
- ✅ View empty cart
- ✅ Update quantity (increase/decrease)
- ✅ Calculate total price
- ✅ Proceed to checkout
- ✅ Cart persistence across tabs
- ✅ Remove items from cart
- ✅ Display item information
- ✅ Quantity button functionality
- ✅ Item link navigation

#### Checkout Tests (TC-CHECKOUT-001 to TC-CHECKOUT-017)
- ✅ Fill shipping address form
- ✅ Shipping validation errors
- ✅ Persist shipping data
- ✅ Select payment methods (PayPal, Stripe, Cash on Delivery)
- ✅ Navigation between checkout steps
- ✅ Display order summary
- ✅ Edit shipping/payment from review
- ✅ Complete order placement
- ✅ Price calculations
- ✅ End-to-end checkout flows

#### Admin Dashboard Tests (TC-ADMIN-001 to TC-ADMIN-011)
- ✅ Access dashboard as admin
- ✅ Access control for non-admin users
- ✅ View dashboard statistics
- ✅ Add new book with validation
- ✅ Edit existing book
- ✅ Delete book with confirmation
- ✅ Navigate between tabs
- ✅ View all orders
- ✅ Book form validation
- ✅ Cancel form operations

### Page Object Model

The project uses the Page Object Model (POM) pattern for maintainable test code:

#### BasePage
Common methods inherited by all page objects:
- Navigation helpers
- Element interaction methods
- Wait utilities
- Screenshot capture
- URL verification

#### Example Usage

```typescript
import { LoginPage } from './pages/LoginPage';
import { BooksPage } from './pages/BooksPage';

test('User can browse and add books to cart', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const booksPage = new BooksPage(page);
  
  // Login
  await loginPage.goto();
  await loginPage.login('test@example.com', 'password123');
  
  // Browse books
  await booksPage.goto();
  await booksPage.searchBooks('Harry Potter');
  
  // Add to cart
  await booksPage.addFirstBookToCart();
  
  // Verify
  const cartCount = await booksPage.getCartCount();
  expect(cartCount).toBeGreaterThan(0);
});
```

### Writing Tests

#### Test Structure Guidelines

1. **Use descriptive test names** with test case IDs:
```typescript
test('TC-AUTH-001: User registration with valid data @smoke', async ({ page }) => {
  // Test implementation
});
```

2. **Follow AAA pattern** (Arrange, Act, Assert):
```typescript
test('Add book to cart', async ({ page }) => {
  // Arrange
  const booksPage = new BooksPage(page);
  await booksPage.goto();
  
  // Act
  await booksPage.addFirstBookToCart();
  
  // Assert
  const cartCount = await booksPage.getCartCount();
  expect(cartCount).toBe(1);
});
```

3. **Use data-testid selectors** for reliability:
```typescript
// Good
await page.locator('[data-testid="add-to-cart"]').click();

// Avoid
await page.locator('.book_button').click();
```

4. **Clean up after tests** when necessary:
```typescript
test.afterEach(async ({ page }) => {
  // Clear cart, logout, etc.
});
```

### CI/CD Integration

#### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright
        run: npx playwright install --with-deps
      - name: Run tests
        run: npm test
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

## 📁 Project Structure

```
book-store/
├── components/           # React components
│   ├── Banner.js
│   ├── CheckoutProgress.js
│   ├── ConfirmModal.js
│   ├── DropdownMenu.js
│   ├── Header.js
│   ├── Layout.js
│   ├── Notice.js
│   ├── Notification.js
│   ├── NotificationProvider.js
│   └── ProductItem.js
├── models/              # MongoDB models
│   ├── Order.js
│   ├── Product.js
│   └── User.js
├── pages/               # Next.js pages
│   ├── api/            # API routes
│   │   ├── admin/      # Admin endpoints
│   │   ├── auth/       # Authentication
│   │   ├── orders/     # Order management
│   │   └── product/    # Product endpoints
│   ├── books/          # Book pages
│   ├── order/          # Order pages
│   ├── cart.js
│   ├── dashboard.js    # Admin dashboard
│   ├── login.js
│   ├── payment.js
│   ├── placeorder.js
│   ├── profile.js
│   ├── register.js
│   ├── shipping.js
│   └── _app.js
├── tests/               # E2E tests
│   ├── pages/          # Page Object Models
│   ├── auth.spec.ts
│   ├── books.spec.ts
│   ├── cart.spec.ts
│   ├── checkout.spec.ts
│   └── dashboard.spec.ts
├── utils/               # Utility functions
│   ├── db.js           # Database connection
│   └── Store.js        # Global state management
├── styles/              # SCSS styles
├── public/              # Static assets
├── .env                 # Environment variables
├── .gitignore
├── package.json
├── playwright.config.ts
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth.js endpoints
- `POST /api/auth/update` - Update user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/product/[id]` - Get product by ID

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Get order by ID
- `GET /api/orders/history` - Get user's order history

### Admin
- `GET /api/admin/products` - Get all products (admin)
- `POST /api/admin/products` - Create new product
- `GET /api/admin/products/[id]` - Get product details
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product
- `GET /api/admin/orders` - Get all orders (admin)


## 🚢 Deployment

### Vercel Deployment

1. **Push to GitHub**
```bash
git push origin main
```

2. **Import in Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add environment variables
- Deploy

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines

- Write tests for new features
- Maintain code style consistency
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Add appropriate test tags (@smoke, @functional, @regression)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Furqan Ahmad**

- Website: [furqanahmad.me](https://furqanahmad.me/)
- GitHub: [@furqanahmad03](https://github.com/furqanahmad03)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Playwright team for the testing framework
- MongoDB for the database
- All contributors and users

## 📞 Support

For support, email hfurqan.se@gmail.com or open an issue in the GitHub repository.

## 📊 Performance Metrics

The application is optimized for:
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.0s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

## 🧩 Technologies Used

### Frontend
- Next.js 16.0
- React 19.2
- SCSS Modules
- React Hook Form
- Context API for state management

### Backend
- Next.js API Routes
- NextAuth.js for authentication
- MongoDB with Mongoose
- bcryptjs for password hashing

### Testing
- Playwright 1.57
- Page Object Model pattern
- TypeScript for type safety

### DevOps
- Docker & Docker Compose
- GitHub Actions (CI/CD ready)
- Vercel deployment

---

**Happy coding! 🎉**

If you find this project helpful, please consider giving it a ⭐ on GitHub!