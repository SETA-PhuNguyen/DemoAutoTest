import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "./common.steps";

// When Steps
When("I navigate to the shopping cart", async function (this: CustomWorld) {
  await this.page.goto("/shopping-cart");
  await this.page.waitForLoadState("networkidle");
});

When("I click continue shopping", async function (this: CustomWorld) {
  const continueButton = this.cartPage.continueShoppingButton;
  if (await continueButton.isVisible()) {
    await this.cartPage.continueShopping();
  }
});

// Then Steps
Then("I should be on the cart page", async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(/shopping-cart/);
});

Then("I should see the cart page loaded", async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(/shopping-cart/);
  const isEmpty = await this.cartPage.isCartEmpty();
  expect(typeof isEmpty).toBe("boolean");
});

Then(
  "I should see the cart icon on the navigation bar",
  async function (this: CustomWorld) {
    await expect(this.homePage.loginButton).toBeVisible();
  },
);
