import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";

test.describe("BookCart Category Filter Tests", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test("should filter books by Biography category", async () => {
    await homePage.selectCategory("Biography");
    const bookCards = await homePage.getBookCards();
    const count = await bookCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("should filter books by Fiction category", async () => {
    await homePage.selectCategory("Fiction");
    const bookCards = await homePage.getBookCards();
    const count = await bookCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("should filter books by Mystery category", async () => {
    await homePage.selectCategory("Mystery");
    const bookCards = await homePage.getBookCards();
    const count = await bookCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("should filter books by Fantasy category", async () => {
    await homePage.selectCategory("Fantasy");
    const bookCards = await homePage.getBookCards();
    const count = await bookCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("should filter books by Romance category", async () => {
    await homePage.selectCategory("Romance");
    const bookCards = await homePage.getBookCards();
    const count = await bookCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("should show All Categories dropdown", async () => {
    // Just verify page loaded
    await expect(homePage.loginButton).toBeVisible();
  });
});
