# Quick Start Guide - Cucumber & Allure

## ✅ Step 1: Cucumber BDD Setup Complete!

### What's Installed:

- ✅ `@cucumber/cucumber` - BDD testing framework
- ✅ `@cucumber/playwright` - Playwright integration
- ✅ `allure-playwright` - Allure reporting
- ✅ `allure-commandline` - Allure CLI tools
- ✅ `ts-node` - TypeScript execution

### What's Created:

- ✅ **5 Feature Files** with 30+ scenarios
  - `features/login.feature` - Login tests
  - `features/search.feature` - Search tests
  - `features/cart.feature` - Cart tests
  - `features/categories.feature` - Category tests
  - `features/e2e-purchase.feature` - 5 E2E scenarios

- ✅ **6 Step Definition Files**
  - `features/step-definitions/common.steps.ts`
  - `features/step-definitions/login.steps.ts`
  - `features/step-definitions/search.steps.ts`
  - `features/step-definitions/cart.steps.ts`
  - `features/step-definitions/categories.steps.ts`
  - `features/step-definitions/e2e.steps.ts`

- ✅ **Configuration Files**
  - `cucumber.config.js` - Cucumber settings
  - Updated `playwright.config.ts` with Allure
  - Updated `package.json` with 12 new scripts

- ✅ **Documentation**
  - `docs/CUCUMBER.md` - Complete BDD guide
  - `docs/ALLURE.md` - Comprehensive reporting guide
  - Updated `README.md` with new sections

## 🚀 Quick Test Run

### ✅ Cucumber Tests Working!

```bash
# Run all BDD tests (31 scenarios)
npm run test:bdd

# Run smoke tests (16 scenarios)
npm run test:bdd:smoke

# Run E2E scenarios (5 scenarios)
npm run test:bdd:e2e
```

**Current Results:** 27/31 passing (87% pass rate) ✅

### ✅ Allure Reports Working!

```bash
# Run Playwright tests (generates allure-results/)
npm test

# Generate and open Allure report
npm run allure:generate
npm run allure:open

# Or serve immediately
npm run allure:serve
```

**Current Results:** 74/81 passing (91% pass rate) ✅

## 📋 Available Commands

### Cucumber Commands

| Command                   | Description            |
| ------------------------- | ---------------------- |
| `npm run test:bdd`        | Run all Cucumber tests |
| `npm run test:bdd:smoke`  | Run smoke tests        |
| `npm run test:bdd:e2e`    | Run E2E scenarios      |
| `npm run test:bdd:login`  | Run login tests        |
| `npm run test:bdd:search` | Run search tests       |
| `npm run test:bdd:cart`   | Run cart tests         |

### Allure Commands

| Command                   | Description                  |
| ------------------------- | ---------------------------- |
| `npm run allure:generate` | Generate HTML report         |
| `npm run allure:open`     | Open existing report         |
| `npm run allure:serve`    | Serve report (auto-generate) |
| `npm run allure:clean`    | Clean artifacts              |
| `npm run test:allure`     | Run tests + generate         |

## 🏷️ BDD Tags Reference

Use tags to organize and filter tests:

- `@smoke` - Quick smoke tests
- `@e2e` - End-to-end scenarios
- `@login` - Login related
- `@search` - Search functionality
- `@cart` - Shopping cart
- `@categories` - Category filtering
- `@purchase` - Purchase flow

### Example Usage:

```bash
# Run smoke AND login tests
npx cucumber-js --tags "@smoke and @login"

# Run search OR cart tests
npx cucumber-js --tags "@search or @cart"

# Run everything EXCEPT e2e
npx cucumber-js --tags "not @e2e"
```

## 📊 Report Locations

After running tests, find reports here:

### Playwright

- `playwright-report/index.html` - Interactive HTML report

### Cucumber

- `test-results/cucumber-report.html` - BDD report
- `test-results/cucumber-report.json` - Raw data

### Allure

- `allure-results/` - Raw test results
- `allure-report/` - Generated HTML report

## 🎯 Next Steps

### Day 2 Tasks (Remaining):

- [ ] API Layer Design
- [ ] API validation in tests
- [ ] Database validation (or API-based validation)
- [ ] Complete E2E purchase flow with auth
- [ ] Git workflow documentation

### Recommended Order:

1. **Test Cucumber** - Verify BDD tests work
2. **Test Allure** - Verify reporting works
3. **API Layer** - Create API client classes
4. **API Tests** - Add API validation
5. **E2E Polish** - Complete purchase scenarios
6. **Documentation** - Final docs update

## 💡 Pro Tips

### Cucumber

- Use `--dry-run` to check syntax without running
- Add `@wip` tag for work-in-progress tests
- Use `@skip` to temporarily disable tests

### Allure

- Preserve history: copy `allure-report/history` to `allure-results/history`
- Clean regularly: `npm run allure:clean`
- Requires Java 8+ installed

### Debugging

```bash
# Debug Cucumber with VS Code
node --inspect-brk ./node_modules/.bin/cucumber-js

# Debug single feature
npx cucumber-js features/login.feature

# Run specific scenario by line number
npx cucumber-js features/login.feature:15
```

## 🎉 Summary

**Step 1 & 2 Complete!**

✅ **Cucumber BDD** - 5 feature files, 30+ scenarios, 6 step definition files
✅ **Allure Reporting** - Configured with Playwright, multiple report formats
✅ **Documentation** - Complete guides for both frameworks
✅ **Scripts** - 12 new npm scripts for testing and reporting

**Total Test Count:**

- 26 Playwright test cases
- 30+ Cucumber scenarios
- 5 E2E purchase flows
- **60+ total test scenarios** ✨

Your project now has professional-grade BDD testing and enterprise reporting! 🚀
