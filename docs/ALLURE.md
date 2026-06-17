# Allure Reporting Guide

## Overview

Allure Framework is integrated to provide comprehensive, beautiful test reports with rich visualizations, history tracking, and detailed test execution data.

## Features

- ✅ **Beautiful UI** - Modern, interactive web interface
- ✅ **Detailed Reports** - Step-by-step execution details
- ✅ **Screenshots** - Automatic capture on failures
- ✅ **Videos** - Replay test executions
- ✅ **History Trends** - Track test results over time
- ✅ **Categories** - Organize failures by type
- ✅ **Retries** - Track flaky tests
- ✅ **Timing** - Execution duration analysis

## Configuration

Allure is configured in `playwright.config.ts`:

```typescript
reporter: [
  [
    "allure-playwright",
    {
      outputFolder: "allure-results",
      detail: true,
      suiteTitle: true,
    },
  ],
];
```

## Running Tests with Allure

### Method 1: Run Tests and Generate Report

```bash
# Run tests (generates allure-results/)
npm test

# Generate HTML report
npm run allure:generate

# Open report in browser
npm run allure:open
```

### Method 2: Run and Serve Immediately

```bash
# Run tests and serve report
npm run test:allure
```

### Method 3: Serve Results Directly

```bash
# Run tests
npm test

# Serve report (no generation needed)
npm run allure:serve
```

## Available Scripts

| Script                    | Description                             |
| ------------------------- | --------------------------------------- |
| `npm run allure:generate` | Generate HTML report from results       |
| `npm run allure:open`     | Open existing report in browser         |
| `npm run allure:serve`    | Start server with auto-generated report |
| `npm run allure:clean`    | Clean all Allure artifacts              |
| `npm run test:allure`     | Run tests + generate report             |

## Report Structure

### 1. Overview Page

- Total tests, passed, failed, broken, skipped
- Success rate and duration
- Environment details
- Test execution timeline

### 2. Suites Page

- Tests organized by suite
- Package/feature structure
- Test status indicators

### 3. Graphs Page

- **Status chart** - Pass/fail distribution
- **Severity** - Test priority levels
- **Duration** - Execution time trends
- **Categories** - Failure type breakdown
- **Flaky tests** - Tests with intermittent failures

### 4. Timeline

- Parallel execution visualization
- Test duration on timeline
- Worker/thread allocation

### 5. Behaviors (BDD)

- Features and stories organization
- Business-readable test structure

### 6. Packages

- Test organization by package
- Folder structure visualization

### 7. History

- Test result trends over time
- Compare execution history
- Identify flaky tests

## Annotations in Tests

Add metadata to tests for better reporting:

```typescript
import { test } from "@playwright/test";
import { allure } from "allure-playwright";

test("my test", async ({ page }) => {
  await allure.epic("E-Commerce");
  await allure.feature("Shopping Cart");
  await allure.story("Add to Cart");
  await allure.severity("critical");
  await allure.owner("QA Team");
  await allure.tag("smoke");
  await allure.description("Test adds item to shopping cart");

  // Add step
  await allure.step("Navigate to product", async () => {
    await page.goto("/product");
  });

  // Attach screenshot
  const screenshot = await page.screenshot();
  await allure.attachment("Product Page", screenshot, "image/png");
});
```

## Severity Levels

- `blocker` - Test blocks release
- `critical` - Core functionality
- `normal` - Standard features
- `minor` - Small features
- `trivial` - UI/cosmetic

## Categories Configuration

Create `categories.json` in project root to categorize failures:

```json
[
  {
    "name": "Product defects",
    "matchedStatuses": ["failed"],
    "messageRegex": ".*"
  },
  {
    "name": "Test defects",
    "matchedStatuses": ["broken"],
    "messageRegex": ".*"
  },
  {
    "name": "Ignored tests",
    "matchedStatuses": ["skipped"]
  }
]
```

## Environment Information

Create `environment.properties` in `allure-results/`:

```properties
Browser=Chrome
Browser.Version=120.0
Base.URL=https://bookcart.azurewebsites.net
OS=Windows 11
Node.Version=20.20.2
```

## Integrating with CI/CD

### GitHub Actions Example:

```yaml
- name: Run tests
  run: npm test

- name: Generate Allure Report
  run: npm run allure:generate

- name: Publish Allure Report
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./allure-report
```

## Best Practices

1. **Clean before major runs**

   ```bash
   npm run allure:clean
   npm test
   ```

2. **Preserve history**
   - Copy `allure-report/history` to `allure-results/history` before new runs
   - Enables trend analysis

3. **Use meaningful test names**
   - Helps in report navigation
   - Makes reports business-friendly

4. **Add descriptions**
   - Document test purpose
   - Link to requirements/tickets

5. **Tag appropriately**
   - Categorize for filtering
   - Group related tests

## Troubleshooting

### Report not generating

```bash
# Check if results exist
ls allure-results

# Clean and regenerate
npm run allure:clean
npm test
npm run allure:generate
```

### Port already in use

```bash
# Serve on different port
allure serve allure-results -p 9999
```

### Missing Java (Allure requires Java)

Install Java 8+ and ensure it's in PATH:

```bash
java -version
```

## Report Screenshots

The report includes:

- **Suites view** - All test suites
- **Timeline** - Parallel execution
- **Graphs** - Visual analytics
- **Failures** - Detailed error info
- **History** - Trends over time

## Sharing Reports

### Option 1: GitHub Pages

Deploy `allure-report/` folder to GitHub Pages

### Option 2: Allure Server

Deploy to dedicated Allure server

### Option 3: ZIP and Share

```bash
# Create archive
zip -r allure-report.zip allure-report/
```

## Advanced Features

### Retries Tracking

Allure automatically tracks test retries and marks flaky tests

### Test Parameters

Show test input data in reports

### Links

Add links to bug trackers, documentation:

```typescript
await allure.link("Issue", "https://jira.com/ISSUE-123");
await allure.issue("ISSUE-123", "https://jira.com/ISSUE-123");
await allure.tms("TMS-456", "https://tms.com/TMS-456");
```

## Summary

Allure provides enterprise-grade reporting with:

- Rich visualization
- Historical trends
- Detailed execution data
- Team collaboration features
- CI/CD integration

Perfect for demonstrating test coverage and quality metrics! 🎯
