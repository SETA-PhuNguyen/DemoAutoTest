import { test, expect } from "../utils/fixtures";

test.describe("BookCart Home Page Tests", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test("should load home page successfully", async ({ page, homePage }) => {
    await expect(page).toHaveTitle(/Home/);
    await expect(homePage.loginButton).toBeVisible();
    await expect(homePage.shoppingCartIcon).toBeVisible();
  });

  test("should display all navigation elements", async ({ homePage }) => {
    await expect(homePage.loginButton).toBeVisible();
    await expect(homePage.shoppingCartIcon).toBeVisible();
    await expect(homePage.allCategoriesDropdown).toBeVisible();
    await expect(homePage.swaggerLink).toBeVisible();
    await expect(homePage.githubLink).toBeVisible();
  });

  test("should navigate to Swagger documentation", async ({
    page,
    homePage,
  }) => {
    const [swaggerPage] = await Promise.all([
      page.waitForEvent("popup"),
      homePage.swaggerLink.click(),
    ]);
    await expect(swaggerPage).toHaveURL(/swagger/);
  });

  test("should navigate to GitHub repository", async ({ page, homePage }) => {
    const [githubPage] = await Promise.all([
      page.waitForEvent("popup"),
      homePage.githubLink.click(),
    ]);
    await expect(githubPage).toHaveURL(/github\.com/);
  });

  test("should open login dialog when clicking login button", async ({
    homePage,
    loginPage,
  }) => {
    await homePage.clickLogin();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
  });
});
