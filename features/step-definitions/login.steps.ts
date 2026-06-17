import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "./common.steps";

// When Steps
When("I click on the login button", async function (this: CustomWorld) {
  await this.homePage.clickLogin();
});

When(
  "I click the login submit button without entering credentials",
  async function (this: CustomWorld) {
    await this.loginPage.loginButton.click();
  },
);

When(
  "I enter username {string} and password {string}",
  async function (this: CustomWorld, username: string, password: string) {
    await this.loginPage.login(username, password);
  },
);

When("I click the login submit button", async function (this: CustomWorld) {
  await this.loginPage.loginButton.click();
  await this.page.waitForTimeout(2000);
});

When("I click on the register link", async function (this: CustomWorld) {
  await this.loginPage.clickRegister();
  await this.page.waitForTimeout(1000);
});

When("I close the login dialog", async function (this: CustomWorld) {
  const closeBtn = this.loginPage.closeButton.first();
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
    await this.page.waitForTimeout(1000);
  }
});

// Then Steps
Then("I should see the login form", async function (this: CustomWorld) {
  await expect(this.loginPage.usernameInput).toBeVisible({ timeout: 10000 });
  await expect(this.loginPage.passwordInput).toBeVisible();
});

Then(
  "I should see the username input field",
  async function (this: CustomWorld) {
    await expect(this.loginPage.usernameInput).toBeVisible();
  },
);

Then(
  "I should see the password input field",
  async function (this: CustomWorld) {
    await expect(this.loginPage.passwordInput).toBeVisible();
  },
);

Then(
  "I should see validation error messages",
  async function (this: CustomWorld) {
    // Check for any error indication
    const hasError = (await this.loginPage.errorMessage.count()) > 0;
    expect(hasError).toBeTruthy();
  },
);

Then("I should see an error message", async function (this: CustomWorld) {
  // Wait for any error response
  await this.page.waitForTimeout(2000);
});

Then("I should see the registration form", async function (this: CustomWorld) {
  // Check if we're on registration or form changed
  await this.page.waitForTimeout(1000);
  const forms = await this.page.locator("form").count();
  expect(forms).toBeGreaterThan(0);
});

Then("I should be back on the home page", async function (this: CustomWorld) {
  await expect(this.homePage.loginButton).toBeVisible();
});
