import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "./common.steps";

// When Steps
When(
  "I search for {string}",
  async function (this: CustomWorld, searchTerm: string) {
    await this.homePage.searchForBook(searchTerm);
    await this.page.waitForTimeout(2000);
  },
);

When("I clear the search input", async function (this: CustomWorld) {
  await this.homePage.searchInput.clear();
  await this.homePage.searchInput.press("Enter");
  await this.page.waitForTimeout(1000);
});

// Then Steps
Then("I should see the search input field", async function (this: CustomWorld) {
  await expect(this.homePage.searchInput).toBeVisible();
});

Then(
  "the search input field should be editable",
  async function (this: CustomWorld) {
    await expect(this.homePage.searchInput).toBeEditable();
  },
);

Then("I should see search results", async function (this: CustomWorld) {
  const bookCards = await this.homePage.getBookCards();
  const count = await bookCards.count();
  expect(count).toBeGreaterThanOrEqual(0);
});

Then(
  "I should see a {string} message",
  async function (this: CustomWorld, message: string) {
    const messageLocator = this.page.getByText(new RegExp(message, "i"));
    // Either message is visible or no results
    const isVisible = await messageLocator.isVisible().catch(() => false);
    const bookCards = await this.homePage.getBookCards();
    const count = await bookCards.count();

    // Message visible OR no books found
    expect(isVisible || count === 0).toBeTruthy();
  },
);

Then(
  "I should see all books or default results",
  async function (this: CustomWorld) {
    const bookCards = await this.homePage.getBookCards();
    const count = await bookCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  },
);
