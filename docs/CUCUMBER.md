# Cucumber BDD Testing Guide

## Overview

This project includes Cucumber BDD (Behavior-Driven Development) tests written in Gherkin syntax with TypeScript step definitions.

## Project Structure

```
features/
├── *.feature                    # Gherkin feature files
└── step-definitions/
    ├── common.steps.ts          # Common/shared steps
    ├── login.steps.ts           # Login feature steps
    ├── search.steps.ts          # Search feature steps
    ├── cart.steps.ts            # Cart feature steps
    ├── categories.steps.ts      # Categories feature steps
    └── e2e.steps.ts            # End-to-end scenario steps
```

## Feature Files

### 1. Login Feature (`login.feature`)

- Display login form
- Login validation (empty/invalid credentials)
- Navigate to register page
- Close login dialog

### 2. Search Feature (`search.feature`)

- Search input visibility
- Search for books
- Handle empty results
- Clear search
- Search by category (parameterized)

### 3. Cart Feature (`cart.feature`)

- Navigate to cart
- View empty cart
- Cart icon visibility
- Continue shopping

### 4. Categories Feature (`categories.feature`)

- Filter by Biography, Fiction, Mystery, Fantasy, Romance
- Parameterized category filtering

### 5. E2E Purchase Feature (`e2e-purchase.feature`)

- Complete purchase flow
- Browse and add to cart
- Add multiple books
- Search, filter, and add
- Update quantity
- Complete checkout (when credentials available)

## Running Cucumber Tests

### Run All BDD Tests

```bash
npm run test:bdd
```

### Run Tests by Tags

**Smoke tests:**

```bash
npm run test:bdd:smoke
```

**E2E tests:**

```bash
npm run test:bdd:e2e
```

**Login tests:**

```bash
npm run test:bdd:login
```

**Search tests:**

```bash
npm run test:bdd:search
```

**Cart tests:**

```bash
npm run test:bdd:cart
```

### Custom Tag Combinations

```bash
npx cucumber-js --tags "@smoke and @login"
npx cucumber-js --tags "@search or @cart"
npx cucumber-js --tags "not @e2e"
```

## Tags Reference

- `@smoke` - Quick smoke tests for core functionality
- `@e2e` - End-to-end full user journey tests
- `@login` - Login related scenarios
- `@search` - Search functionality
- `@cart` - Shopping cart tests
- `@categories` - Category filtering
- `@purchase` - Purchase flow scenarios

## Writing New Feature Files

### Template:

```gherkin
Feature: Feature Name
  As a [role]
  I want to [action]
  So that [benefit]

  Background:
    Given I am on the BookCart home page

  @tag1 @tag2
  Scenario: Scenario description
    When I perform action
    Then I should see result

  @tag1
  Scenario Outline: Parameterized scenario
    When I perform "<action>"
    Then I see "<result>"

    Examples:
      | action | result |
      | value1 | result1 |
      | value2 | result2 |
```

## Step Definitions

Step definitions are in TypeScript using Cucumber decorators:

```typescript
import { Given, When, Then } from "@cucumber/cucumber";
import { CustomWorld } from "./common.steps";

When("I perform action", async function (this: CustomWorld) {
  // Implementation using page objects
  await this.homePage.someAction();
});
```

## Best Practices

1. **Keep features focused** - One feature per file
2. **Use meaningful tags** - Tag for test categories and priority
3. **Reuse steps** - Create common steps in `common.steps.ts`
4. **Use Background** - For common setup across scenarios
5. **Scenario Outlines** - For data-driven tests
6. **Clear language** - Write in business/user language, not technical

## Reports

Cucumber generates reports in:

- `test-results/cucumber-report.html` - HTML report
- `test-results/cucumber-report.json` - JSON for further processing

## Debugging

Run with Node.js debugging:

```bash
node --inspect-brk ./node_modules/.bin/cucumber-js --config cucumber.config.js
```

## Configuration

Configuration is in `cucumber.config.js`:

- Test file patterns
- Step definition locations
- Report formats
- Timeouts (default: 60 seconds)

## Tips

- Use `@wip` (Work In Progress) tag during development
- Use `@skip` or `@ignore` to temporarily skip tests
- Run specific scenario: `npx cucumber-js features/login.feature:10` (line 10)
- Dry run to check syntax: `npx cucumber-js --dry-run`
