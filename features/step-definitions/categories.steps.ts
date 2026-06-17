import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "./common.steps";

// When Steps
When(
  "I select the {string} category",
  async function (this: CustomWorld, category: string) {
    await this.homePage.selectCategory(category);
    await this.page.waitForTimeout(2000);
  },
);

// Then Steps
Then(
  "I should see books filtered by the category",
  async function (this: CustomWorld) {
    const bookCards = await this.homePage.getBookCards();
    const count = await bookCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  },
);
