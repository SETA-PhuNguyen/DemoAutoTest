# Contributing to BookCart Automation Testing

Thank you for your interest in contributing to this testing project! This guide will help you get started.

## 🚀 Getting Started

1. **Fork and Clone**

   ```bash
   git clone <your-fork-url>
   cd DemoAutoTest
   ```

2. **Install Dependencies**

   ```bash
   npm install
   npx playwright install
   ```

3. **Run Tests**
   ```bash
   npm test
   ```

## 📝 Coding Standards

### TypeScript Style Guide

- Use **TypeScript** for all test files
- Enable strict type checking
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### Test Structure

```typescript
import { test, expect } from "../utils/fixtures";

test.describe("Feature Name", () => {
  test.beforeEach(async ({ homePage }) => {
    // Setup code
  });

  test("should describe what the test does", async ({ homePage }) => {
    // Arrange
    // Act
    // Assert
  });
});
```

### Naming Conventions

- **Test files**: `feature.spec.ts` (e.g., `login.spec.ts`)
- **Page objects**: `FeaturePage.ts` (e.g., `LoginPage.ts`)
- **Test names**: Use descriptive names starting with "should"
- **Variables**: Use camelCase
- **Classes**: Use PascalCase
- **Constants**: Use UPPER_SNAKE_CASE

## 🏗️ Project Structure

```
pages/          # Page Object Models
tests/          # Test specifications
utils/          # Helper functions and fixtures
```

### Adding New Page Objects

1. Create a new file in `pages/` directory
2. Extend `BasePage` class
3. Define locators and methods
4. Export the class

Example:

```typescript
import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class NewPage extends BasePage {
  readonly element: Locator;

  constructor(page: Page) {
    super(page);
    this.element = page.locator("selector");
  }

  async performAction() {
    await this.element.click();
  }
}
```

### Adding New Tests

1. Create a new file in `tests/` directory
2. Import fixtures: `import { test, expect } from '../utils/fixtures'`
3. Use `test.describe()` for grouping
4. Write clear, independent tests
5. Add appropriate assertions

## ✅ Before Submitting

### Run Tests

```bash
npm test
```

### Check TypeScript Compilation

```bash
npx tsc --noEmit
```

### Run Specific Tests

```bash
npx playwright test tests/your-test.spec.ts
```

## 🐛 Reporting Issues

When reporting bugs or issues:

1. **Search existing issues** first
2. **Provide clear description** of the problem
3. **Include steps to reproduce**
4. **Add screenshots** if relevant
5. **Mention browser and OS** information
6. **Include error messages** or logs

### Issue Template

```
**Description**
Brief description of the issue

**Steps to Reproduce**
1. Go to...
2. Click on...
3. See error...

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Node.js: [e.g., v18.0.0]

**Screenshots**
If applicable, add screenshots
```

## 💡 Best Practices

### Test Independence

- Each test should be independent
- Don't rely on test execution order
- Clean up test data after tests

### Assertions

- Use appropriate Playwright assertions
- Add meaningful assertion messages
- Don't over-assert or under-assert

### Waits

- Use Playwright's auto-waiting features
- Avoid hard-coded waits when possible
- Use `waitForLoadState()` for page loads

### Locators

- Prefer user-facing attributes (role, text, label)
- Avoid CSS selectors when possible
- Use data-testid for stable selectors

### Page Objects

- Keep page objects DRY (Don't Repeat Yourself)
- One page object per page
- Include only page-specific methods

## 🔄 Pull Request Process

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Follow coding standards
   - Add tests for new features

3. **Test your changes**

   ```bash
   npm test
   ```

4. **Commit your changes**

   ```bash
   git commit -m "feat: add new feature"
   ```

   Use conventional commits:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation
   - `test:` - Tests
   - `refactor:` - Code refactoring

5. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Provide clear description
   - Link related issues
   - Request review

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)

## 🤝 Questions?

If you have questions:

- Check existing documentation
- Search closed issues
- Ask in discussions
- Contact maintainers

## 📜 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on what's best for the project

Thank you for contributing! 🎉
