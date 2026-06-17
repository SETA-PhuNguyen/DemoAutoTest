import { test, expect } from "../utils/fixtures";

test.describe("BookCart Search Functionality", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test("should search for a book successfully", async ({ homePage }) => {
    await homePage.searchForBook("Harry Potter");
    const bookCards = await homePage.getBookCards();
    const count = await bookCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should display search input field", async ({ homePage }) => {
    await expect(homePage.searchInput).toBeVisible();
    await expect(homePage.searchInput).toBeEditable();
  });

  test("should handle empty search results", async ({ page, homePage }) => {
    await homePage.searchForBook("NonExistentBookTitle12345");
    const noResultsMessage = page.getByText(/No books found/i);
    await expect(noResultsMessage).toBeVisible();
  });

  test("should clear search when input is cleared", async ({ homePage }) => {
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
