import {
  Given,
  When,
  Then,
  Before,
  After,
  setDefaultTimeout,
} from "@cucumber/cucumber";
import { chromium, Browser, Page, BrowserContext } from "@playwright/test";
import { expect } from "@playwright/test";
import { HomePage } from "../../pages/HomePage";
import { LoginPage } from "../../pages/LoginPage";
import { CartPage } from "../../pages/CartPage";
import { BookDetailsPage } from "../../pages/BookDetailsPage";

// Set default timeout to 60 seconds
setDefaultTimeout(60 * 1000);

// World context to store browser, page, and page objects
export class CustomWorld {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  homePage!: HomePage;
  loginPage!: LoginPage;
  cartPage!: CartPage;
  bookDetailsPage!: BookDetailsPage;
}

// Hooks
Before(async function (this: CustomWorld) {
  this.browser = await chromium.launch({ headless: true });
  this.context = await this.browser.newContext({
    baseURL: "https://bookcart.azurewebsites.net",
  });
  this.page = await this.context.newPage();

  // Initialize page objects
  this.homePage = new HomePage(this.page);
  this.loginPage = new LoginPage(this.page);
  this.cartPage = new CartPage(this.page);
  this.bookDetailsPage = new BookDetailsPage(this.page);
});

After(async function (this: CustomWorld) {
  await this.page?.close();
  await this.context?.close();
  await this.browser?.close();
});

// Common Steps
Given("I am on the BookCart home page", async function (this: CustomWorld) {
  await this.homePage.goto();
  await this.page.waitForLoadState("networkidle");
});
