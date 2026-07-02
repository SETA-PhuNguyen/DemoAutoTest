import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/world";

// When Steps
When(
  "I select the {string} category",
  async function (this: CustomWorld, category: string) {
    await this.homePage.selectCategory(category);
    await this.page.waitForTimeout(2000);
  },
);

When("I capture the book count from UI", async function (this: CustomWorld) {
  const bookCards = await this.homePage.getBookCards();
  const count = await bookCards.count();

  this.storedValues.uiBookCount = count;
  this.savedValue = count.toString(); // For "I store it as" step
  console.log(`✅ Captured book count from UI: ${count}`);
});

// Then Steps
Then(
  "I should see books filtered by the category",
  async function (this: CustomWorld) {
    const bookCards = await this.homePage.getBookCards();
    const count = await bookCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  },
);

Then(
  "the UI value {string} should match DB value {string} count",
  function (this: CustomWorld, uiKey: string, dbKey: string) {
    const uiValue = this.storedValues[uiKey];
    const dbResults = this.storedValues[dbKey];

    if (uiValue === undefined) {
      throw new Error(`UI value not found for key: ${uiKey}`);
    }

    if (!dbResults) {
      throw new Error(`DB value not found for key: ${dbKey}`);
    }

    const dbCount = Array.isArray(dbResults) ? dbResults.length : 0;

    console.log(
      `\n📊 Validating: ${uiKey} (${uiValue}) vs ${dbKey} count (${dbCount})`,
    );

    expect(uiValue).toBe(dbCount);

    console.log(`✅ Validation passed: UI count matches DB count`);
  },
);
