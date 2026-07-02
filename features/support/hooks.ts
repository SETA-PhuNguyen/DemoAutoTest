/**
 * Cucumber Hooks
 *
 * This file contains all lifecycle hooks for test execution:
 * - BeforeAll: One-time setup before all scenarios
 * - Before: Setup before each scenario
 * - After: Cleanup after each scenario
 * - AfterAll: One-time cleanup after all scenarios
 *
 * Hooks execute in this order:
 * 1. BeforeAll (once)
 * 2. Before (each scenario)
 * 3. Scenario steps execute
 * 4. After (each scenario)
 * 5. AfterAll (once)
 */

import {
  Before,
  After,
  BeforeAll,
  AfterAll,
  setDefaultTimeout,
  Status,
} from "@cucumber/cucumber";
import { chromium, Browser } from "@playwright/test";
import { request } from "@playwright/test";
import { CustomWorld } from "./world";
import { ApiEndpointResolver, ApiHeaders } from "../../utils/apiEndpoints";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { DatabaseQueryExecutor } from "../../utils/databaseConnections";

// ============================================================================
// Environment Setup
// ============================================================================

// Load environment variables from .env file
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ["BASE_URL", "API_BASE_URL"];
const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName],
);

if (missingEnvVars.length > 0) {
  console.warn(
    `⚠️  Warning: Missing environment variables: ${missingEnvVars.join(", ")}`,
  );
  console.warn("Using default values from .env.example or hardcoded defaults");
}

// Set default timeout for all steps (60 seconds)
setDefaultTimeout(60 * 1000);

// ============================================================================
// Global Variables
// ============================================================================

let globalBrowser: Browser | null = null;

// ============================================================================
// BeforeAll Hook
// ============================================================================

BeforeAll(async function () {
  console.log("🚀 Starting test suite...");
  console.log("📋 Environment configuration:");
  console.log(
    `   BASE_URL: ${process.env.BASE_URL || "https://localhost:53424"}`,
  );
  console.log(`   API_BASE_URL: ${ApiEndpointResolver.getBaseUrl()}`);
  console.log(`   HEADLESS: ${process.env.HEADLESS || "false"}`);
  console.log(`   SLOW_MO: ${process.env.SLOW_MO || "0"}ms`);
  console.log("");

  // Create screenshots directory if it doesn't exist
  const screenshotsDir = path.join(process.cwd(), "screenshots");
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
});

// ============================================================================
// Before Hooks - Setup
// ============================================================================

/**
 * Before Hook - Load Test Data (Highest Priority)
 * Runs first for ALL scenarios
 * Loads test data based on: TEST_ENV, feature file name, scenario tags
 */
Before(async function (this: CustomWorld, { pickle, gherkinDocument }) {
  console.log(`📊 Loading test data for: ${pickle.name}`);

  // 1. Determine environment (dev/staging/production)
  const testEnv = process.env.TEST_ENV || "dev";
  console.log(`   Environment: ${testEnv}`);

  // 2. Extract feature name from gherkin document URI
  const featureUri = gherkinDocument.uri || "";
  const featureName = path.basename(featureUri, ".feature");
  console.log(`   Feature: ${featureName}`);

  // 3. Extract scenario tags
  this.scenarioTags = pickle.tags.map((tag) => tag.name.replace("@", ""));
  console.log(`   Tags: ${this.scenarioTags.join(", ")}`);

  // 4. Try to load test data file for this feature
  const testDataPath = path.join(
    process.cwd(),
    "test-data",
    testEnv,
    `${featureName}.feature.ts`,
  );

  try {
    if (fs.existsSync(testDataPath)) {
      // Load test data module
      const testDataModule = await import(testDataPath);
      const featureTestData = testDataModule.testData || testDataModule.default;

      if (!featureTestData) {
        console.warn(`⚠️  No test data exported from: ${testDataPath}`);
        this.testData = {};
        return;
      }

      // 5. Merge common data with scenario-specific data
      let scenarioData = {};

      // Try to find matching scenario data by tags
      for (const tag of this.scenarioTags || []) {
        if (featureTestData.scenarios && featureTestData.scenarios[tag]) {
          console.log(`   ✓ Found scenario data for tag: @${tag}`);
          scenarioData = {
            ...scenarioData,
            ...featureTestData.scenarios[tag],
          };
        }
      }

      // Merge common + scenario data
      this.testData = {
        ...(featureTestData.common || {}),
        ...scenarioData,
      };

      console.log(`   ✅ Test data loaded successfully`);
      console.log(
        `   Available keys: ${Object.keys(this.testData).join(", ")}`,
      );
    } else {
      console.warn(`⚠️  Test data file not found: ${testDataPath}`);
      this.testData = {};
    }
  } catch (error: any) {
    console.error(`❌ Failed to load test data:`, error.message);
    this.testData = {};
  }

  // 6. Initialize storedValues for runtime data storage
  if (!this.storedValues) {
    this.storedValues = {};
  }
});

/**
 * Before Hook for UI Tests
 * Tags: All scenarios WITHOUT @api tag
 * Sets up: Browser, context, page, and page objects
 */
Before({ tags: "not @api" }, async function (this: CustomWorld, { pickle }) {
  console.log(`🎬 Setting up UI test: ${pickle.name}`);

  // Parse browser options from environment
  const headless =
    process.env.HEADLESS === "true" || process.env.HEADLESS === "1";
  const slowMo = parseInt(process.env.SLOW_MO || "0");

  // Launch browser
  this.browser = await chromium.launch({
    headless: headless !== false,
    slowMo: slowMo,
  });

  // Create browser context
  this.context = await this.browser.newContext({
    baseURL: process.env.BASE_URL || "https://localhost:53424",
    ignoreHTTPSErrors: true,
    viewport: {
      width: parseInt(process.env.VIEWPORT_WIDTH || "1920"),
      height: parseInt(process.env.VIEWPORT_HEIGHT || "1080"),
    },
  });

  // Create page
  this.page = await this.context.newPage();

  // Initialize page objects (imported dynamically to avoid circular deps)
  const { HomePage } = await import("../../pages/HomePage");
  const { LoginPage } = await import("../../pages/LoginPage");
  const { CartPage } = await import("../../pages/CartPage");
  const { BookDetailsPage } = await import("../../pages/BookDetailsPage");

  this.homePage = new HomePage(this.page);
  this.loginPage = new LoginPage(this.page);
  this.cartPage = new CartPage(this.page);
  this.bookDetailsPage = new BookDetailsPage(this.page);
});

/**
 * Before Hook for API Tests
 * Tags: @api
 * Sets up: API request context and base URL
 */
Before({ tags: "@api" }, async function (this: CustomWorld, { pickle }) {
  console.log(`🌐 Setting up API test: ${pickle.name}`);

  // Create API request context
  this.apiContext = await request.newContext({
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      [ApiHeaders.CONTENT_TYPE]: ApiHeaders.CONTENT_TYPE_JSON,
      [ApiHeaders.ACCEPT]: ApiHeaders.CONTENT_TYPE_JSON,
    },
  });

  // Initialize base URL from environment
  this.baseURL = ApiEndpointResolver.getBaseUrl();

  // Initialize request/response tracking
  this.requestStartTime = 0;
  this.responseTime = 0;
});

/**
 * Before Hook for Database Tests
 * Tags: @database
 * Sets up: Database connection
 */
Before({ tags: "@database" }, async function (this: CustomWorld, { pickle }) {
  console.log(`💾 Setting up database connection: ${pickle.name}`);

  // Initialize database helper if needed
  try {
    const { DatabaseHelper } = await import("../../utils/databaseHelper");
    const dbHelper = new DatabaseHelper();
    await dbHelper.connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.warn("⚠️  Database connection failed:", error);
  }
});

// ============================================================================
// After Hooks - Cleanup
// ============================================================================

/**
 * After Hook for UI Tests
 * Cleanup: Close page, context, and browser
 * Capture screenshot on failure
 */
After(
  { tags: "not @api" },
  async function (this: CustomWorld, { result, pickle }) {
    // Capture screenshot on failure
    if (result?.status === Status.FAILED && this.page) {
      const screenshotPath = path.join(
        process.cwd(),
        "screenshots",
        `failure-${pickle.name.replace(/[^a-z0-9]/gi, "_")}-${Date.now()}.png`,
      );

      try {
        await this.page.screenshot({
          path: screenshotPath,
          fullPage: true,
        });
        console.log(`📸 Screenshot saved: ${screenshotPath}`);
      } catch (error) {
        console.warn("⚠️  Failed to capture screenshot:", error);
      }
    }

    // Cleanup resources
    try {
      await this.page?.close();
      await this.context?.close();
      await this.browser?.close();
      console.log(`✅ UI test cleanup complete: ${pickle.name}`);
    } catch (error) {
      console.warn("⚠️  UI cleanup error:", error);
    }
  },
);

/**
 * After Hook for API Tests
 * Cleanup: Dispose API context
 */
After({ tags: "@api" }, async function (this: CustomWorld, { result, pickle }) {
  // Log API response details on failure
  if (result?.status === Status.FAILED && this.response) {
    console.log(`❌ API test failed: ${pickle.name}`);
    console.log(`   Status: ${this.response.status()}`);
    console.log(`   Response time: ${this.responseTime}ms`);

    try {
      const responseBody = await this.response.text();
      console.log(`   Response body: ${responseBody.substring(0, 500)}`);
    } catch (error) {
      // Ignore if already consumed
    }
  }

  // Cleanup resources
  try {
    await this.apiContext?.dispose();
    console.log(`✅ API test cleanup complete: ${pickle.name}`);
  } catch (error) {
    console.warn("⚠️  API cleanup error:", error);
  }
});

/**
 * After Hook for Database Tests
 * Cleanup: Close database connection
 */
After({ tags: "@database" }, async function (this: CustomWorld, { pickle }) {
  console.log(`💾 Closing database connection: ${pickle.name}`);

  try {
    // Close database connection if exists
    // const dbHelper = new DatabaseHelper();
    // await dbHelper.close();
    console.log("✅ Database connection closed");
  } catch (error) {
    console.warn("⚠️  Database cleanup error:", error);
  }
});

/**
 * After Hook for All Tests
 * General cleanup and resource tracking
 */
After(async function (this: CustomWorld, { result, pickle }) {
  // Log scenario result
  const status =
    result?.status === Status.PASSED
      ? "✅ PASSED"
      : result?.status === Status.FAILED
        ? "❌ FAILED"
        : "⚠️  SKIPPED";

  console.log(`${status}: ${pickle.name}`);

  // Cleanup any created resources
  if (this.createdUserId) {
    console.log(`🧹 Cleanup: Created user ID ${this.createdUserId}`);
    // Add cleanup logic here if needed
    this.createdUserId = undefined;
  }

  if (this.createdOrderId) {
    console.log(`🧹 Cleanup: Created order ID ${this.createdOrderId}`);
    // Add cleanup logic here if needed
    this.createdOrderId = undefined;
  }

  // Clear stored values
  this.savedValues = [];
  this.storedValues = {};
});

// ============================================================================
// AfterAll Hook
// ============================================================================

AfterAll(async function () {
  console.log("");
  console.log("🏁 Test suite completed");

  // Close all database connections
  try {
    await DatabaseQueryExecutor.closeAllConnections();
    console.log("✅ All database connections closed");
  } catch (error) {
    console.warn("⚠️  Error closing database connections:", error);
  }

  // Close global browser if it was created
  if (globalBrowser) {
    await globalBrowser.close();
    globalBrowser = null;
  }

  // Summary would be printed by Cucumber
});

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Helper function to load environment-specific test data
 */
export function loadTestData(environment?: string): any {
  const env = environment || process.env.TEST_ENV || "local";
  const testDataPath = path.join(process.cwd(), "test-data", `${env}.json`);

  try {
    if (fs.existsSync(testDataPath)) {
      const data = fs.readFileSync(testDataPath, "utf-8");
      return JSON.parse(data);
    } else {
      console.warn(`⚠️  Test data file not found: ${testDataPath}`);
      return {};
    }
  } catch (error) {
    console.warn(`⚠️  Failed to load test data:`, error);
    return {};
  }
}

/**
 * Helper function to validate environment configuration
 */
export function validateEnvironment(): boolean {
  const required = ["BASE_URL", "API_BASE_URL"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `❌ Missing required environment variables: ${missing.join(", ")}`,
    );
    return false;
  }

  return true;
}

// Export for testing purposes
export { globalBrowser };
