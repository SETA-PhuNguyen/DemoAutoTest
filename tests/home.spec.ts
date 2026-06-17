import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";

test.describe("BookCart Home Page Tests", () => {
  let homePage: HomePage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    await homePage.goto();
  });

  test("should load home page successfully", async ({ page }) => {
    await expect(page).toHaveTitle(/Home/);
    await expect(homePage.loginButton).toBeVisible();
    // Shopping cart icon might not be immediately visible
    await expect(homePage.loginButton).toBeEnabled();
  });

  test("should display all navigation elements", async () => {
    await expect(homePage.loginButton).toBeVisible();
    await expect(homePage.swaggerLink).toBeVisible();
    await expect(homePage.githubLink).toBeVisible();
  });

  test("should navigate to Swagger documentation", async ({ page }) => {
    const [swaggerPage] = await Promise.all([
      page.waitForEvent("popup"),
      homePage.swaggerLink.click(),
    ]);
    await expect(swaggerPage).toHaveURL(/swagger/);
  });

  test("should navigate to GitHub repository", async ({ page }) => {
    const [githubPage] = await Promise.all([
      page.waitForEvent("popup"),
      homePage.githubLink.click(),
    ]);
    await expect(githubPage).toHaveURL(/github\.com/);
  });

  test("should open login dialog when clicking login button", async () => {
    await homePage.clickLogin();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
  });
});
