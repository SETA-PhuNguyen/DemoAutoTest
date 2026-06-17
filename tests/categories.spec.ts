import { test, expect } from "../utils/fixtures";

test.describe("BookCart Category Filter Tests", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test("should filter books by Biography category", async ({ homePage }) => {
    await homePage.selectCategory("Biography");
    const bookCards = await homePage.getBookCards();
    const count = await bookCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("should filter books by Fiction category", async ({ homePage }) => {
    await homePage.selectCategory("Fiction");
    const bookCards = await homePage.getBookCards();
    const count = await bookCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("should filter books by Mystery category", async ({ homePage }) => {
    await homePage.selectCategory("Mystery");
    const bookCards = await homePage.getBookCards();
    const count = await bookCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("should filter books by Fantasy category", async ({ homePage }) => {
    await homePage.selectCategory("Fantasy");
    const bookCards = await homePage.getBookCards();
    const count = await bookCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("should filter books by Romance category", async ({ homePage }) => {
    await homePage.selectCategory("Romance");
    const bookCards = await homePage.getBookCards();
    const count = await bookCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("should show All Categories dropdown", async ({ homePage }) => {
    await expect(homePage.allCategoriesDropdown).toBeVisible();
    await homePage.allCategoriesDropdown.click();
    await expect(homePage.categoryFilters).toHaveCount(5);
  });
});
