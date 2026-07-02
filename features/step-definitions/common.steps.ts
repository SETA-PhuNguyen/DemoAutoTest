import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { HomePage } from "../../pages/HomePage";
import { LoginPage } from "../../pages/LoginPage";
import { CartPage } from "../../pages/CartPage";
import { BookDetailsPage } from "../../pages/BookDetailsPage";
import { CustomWorld } from "../support/world";

// NOTE: Hooks have been moved to features/support/hooks.ts

// Set default timeout to 60 seconds
setDefaultTimeout(60 * 1000);

// ============================================================================
// Common Steps - Navigation & Setup
// ============================================================================

Given("I am on the BookCart home page", async function (this: CustomWorld) {
  await this.homePage.goto();
  await this.page.waitForLoadState("networkidle");
});
