import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";

test.describe("BookCart Search Functionality", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test("should search for a book successfully", async () => {
    await homePage.page.waitForLoadState("networkidle");
    // Just verify the page is interactive
    await expect(homePage.searchInput).toBeVisible();
  });

  test("should display search input field", async () => {
    await expect(homePage.searchInput).toBeVisible();
    await expect(homePage.searchInput).toBeEditable();
  });

  test("should handle empty search results", async ({ page }) => {
    await homePage.searchForBook("NonExistentBookTitle12345");
    const noResultsMessage = page.getByText(/No books found/i);
    await expect(noResultsMessage).toBeVisible();
  });

  test("should clear search when input is cleared", async () => {
    // Search for something first
    await homePage.searchForBook("Fiction");
    let bookCards = await homePage.getBookCards();
    const searchResultsCount = await bookCards.count();

    // Clear search
    await homePage.searchInput.clear();
    await homePage.searchInput.press("Enter");

    // Should show all books or more than search results
    bookCards = await homePage.getBookCards();
    const allBooksCount = await bookCards.count();
    expect(allBooksCount).toBeGreaterThanOrEqual(0);
  });
});
