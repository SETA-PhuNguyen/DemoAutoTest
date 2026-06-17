# BookCart Automation Testing Project

Automated testing suite for the [BookCart](https://bookcart.azurewebsites.net/) e-commerce application using TypeScript and Playwright.

## 📋 Project Overview

This project contains end-to-end automated tests for the BookCart web application, implementing the Page Object Model (POM) design pattern for maintainable and scalable test automation.

## 🚀 Features

- **TypeScript**: Strongly typed test code for better maintainability
- **Playwright**: Modern, reliable end-to-end testing framework
- **Cucumber BDD**: Behavior-Driven Development with Gherkin syntax
- **Allure Reports**: Beautiful, comprehensive test reporting
- **Page Object Model**: Clean separation of test logic and page elements
- **Multi-browser Support**: Tests run on Chromium, Firefox, and WebKit
- **Mobile Testing**: Includes mobile viewport configurations
- **Rich Reporting**: HTML reports with screenshots and videos
- **Parallel Execution**: Faster test runs with parallel test execution

## 📁 Project Structure

```
DemoAutoTest/
├── pages/                      # Page Object Models
│   ├── BasePage.ts            # Base page with common functionality
│   ├── HomePage.ts            # Home page elements and methods
│   ├── LoginPage.ts           # Login page elements and methods
│   ├── BookDetailsPage.ts     # Book details page
│   └── CartPage.ts            # Shopping cart page
├── tests/                      # Playwright Test specifications
│   ├── setup.spec.ts          # Setup and verification tests
│   ├── home.spec.ts           # Home page tests
│   ├── search.spec.ts         # Search functionality tests
│   ├── categories.spec.ts     # Category filter tests
│   ├── login.spec.ts          # Login functionality tests
│   └── cart.spec.ts           # Shopping cart tests
├── features/                   # Cucumber BDD Features
│   ├── *.feature              # Gherkin feature files
│   └── step-definitions/      # TypeScript step definitions
├── utils/                      # Utility files
│   ├── fixtures.ts            # Custom Playwright fixtures
│   └── helpers.ts             # Helper functions
├── docs/                       # Documentation
│   ├── CUCUMBER.md            # Cucumber BDD guide
│   └── ALLURE.md              # Allure reporting guide
├── playwright.config.ts        # Playwright configuration
├── cucumber.config.js          # Cucumber configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Project dependencies

```

## 🛠️ Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher

## 📦 Installation

1. Clone or navigate to the project directory:

```bash
cd "c:\Users\vfoo\Desktop\learning AutoTest\DemoAutoTest"
```

2. Install dependencies:

```bash
npm install
```

3. Install Playwright browsers:

```bash
npx playwright install
```

## 🧪 Running Tests

### Playwright Tests (Standard)

**Run all tests:**

```bash
npm test
```

**Run tests in headed mode (visible browser):**

```bash
npm run test:headed
```

**Run tests in specific browser:**

```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

**Run tests in debug mode:**

```bash
npm run test:debug
```

**Run tests with UI mode (interactive):**

```bash
npm run test:ui
```

**View test report:**

```bash
npm run report
```

### Cucumber BDD Tests

**Run all BDD tests:**

```bash
npm run test:bdd
```

**Run tests by tags:**

````bash
npm run test:bdd:smoke      # Smoke tests
npm run test:bdd:e2e        # End-to-end scenarios
npm run test:bdd:login      # Login tests
### Playwright Tests (26+ test cases)
- ✅ Home page navigation and elements
- ✅ Search functionality
- ✅ Category filtering (Biography, Fiction, Mystery, Fantasy, Romance)
- ✅ Login form validation
- ✅ Shopping cart operations
- ✅ External links (Swagger, GitHub)

### Cucumber BDD Scenarios (5+ E2E scenarios)
- ✅ Complete purchase flow - Browse and add to cart
- ✅ Browse category and add multiple books
- ✅ Search, filter, and add to cart
- ✅ Add to cart and update quantity
- ✅ Complete checkout flow

**Total**: 40+ test scenarios across Playwright and Cucumber
📖 **Full Cucumber Guide**: See [docs/CUCUMBER.md](docs/CUCUMBER.md)

### Allure Reports

**Run tests and generate Allure report:**
```bash
npm run test:allure
````

**Generate report from existing results:**

```bash
npm run allure:generate
npm run allure:open
```

**Serve report immediately:**

```bash
npm test
npm run allure:serve
```

**Clean Allure artifacts:**

```bash
npm run allure:clean
```

📊 **Full Allure Guide**: See [docs/ALLURE.md](docs/ALLURE.md)

### Generate test code using Codegen

```bash
npm run codegen
```

## 📊 Test Coverage

The project includes tests for:

- ✅ Home page navigation and elements
- ✅ Search functionality
- ✅ Category filtering (Biography, Fiction, Mystery, Fantasy, Romance)

### Playwright HTML Report

After running tests, view the HTML report:

```bash
npm run report
```

Reports include:

- Test execution summary
- Screenshots of failures
- Videos of failed tests
- Execution traces for debugging

### Allure Report

Generate and view comprehensive Allure reports:

```bash
npm run test:allure        # Run tests and generate
npm run allure:open        # Open generated report
npm run allure:serve       # Serve report immediately
```

Allure features:

- 📊 Beautiful interactive dashboards
- 📈 Historical trends and analytics
- 🎯 Detailed test execution data
- 🏷️ Test categorization and tagging
- 📸 Screenshots and attachments
- ⏱️ Execution timeline
- 🔄 Retry tracking for flaky tests

### Cucumber Report

BDD test results in HTML and JSON:

- `test-results/cucumber-report.html`
- `test-results/cucumber-report.json`

Reports include:

- Test execution summary
- Screenshots of failures
- Videos of failed tests (if enabled)
- Execution traces for debugging

## 🔧 Configuration

### Base URL

The base URL is configured in `playwright.config.ts`:

```typescript
use: {
  baseURL: 'https://bookcart.azurewebsites.net',
}
```

### Browsers

Tests are configured to run on:

- Desktop Chrome
- Desktop Firefox
- Desktop Safari
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

### Parallel Execution

Tests run in parallel by default. Modify in `playwright.config.ts`:

```typescript
fullyParallel: true,
workers: process.env.CI ? 1 : undefined,
```

## 📝 Writing New Tests

1. Create a new test file in the `tests/` directory:

```typescript
import { test, expect } from "../utils/fixtures";

test.describe("Feature Name", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test("should do something", async ({ homePage }) => {
    // Your test code here
  });
});
```

2. Add page objects if needed in the `pages/` directory
3. Use the custom fixtures for automatic page object initialization

## 🤝 Best Practices

- Use Page Object Model for all page interactions
- WCucumber Documentation](https://cucumber.io/docs/cucumber/)
- [Allure Framework](https://docs.qameta.io/allure/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [BookCart Application](https://bookcart.azurewebsites.net/)
- [BookCart GitHub](https://github.com/AnkitSharma-007/bookcart)

## 📖 Documentation

- [Cucumber BDD Guide](docs/CUCUMBER.md) - Complete BDD testing guide
- [Allure Reporting Guide](docs/ALLURE.md) - Comprehensive reporting documentation
- [Test Scenarios](TEST_SCENARIOS.md) - Detailed test coverage
- [Contributing Guide](CONTRIBUTING.md) - How to contribute
- Add appropriate waits and assertions
- Follow the Arrange-Act-Assert pattern

## 🐛 Debugging

### Debug a specific test

```bash
npx playwright test tests/home.spec.ts --debug
```

### Run with trace viewer

```bash
npx playwright test --trace on
npx playwright show-trace trace.zip
```

### Take screenshots

Screenshots are automatically captured on test failures.

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [BookCart Application](https://bookcart.azurewebsites.net/)
- [BookCart GitHub](https://github.com/AnkitSharma-007/bookcart)

## 🎓 Learning Resources

- [Playwright Tutorial](https://playwright.dev/docs/intro)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Best Practices](https://playwright.dev/docs/best-practices)

## 📄 License

ISC

## 👤 Author

Your Name

---

**Happy Testing! 🚀**
