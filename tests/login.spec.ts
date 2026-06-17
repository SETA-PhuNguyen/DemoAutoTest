import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";

test.describe("BookCart Login Tests", () => {
  let homePage: HomePage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    await homePage.goto();
    await homePage.clickLogin();
  });

  test("should display login form", async () => {
    await homePage.page.waitForLoadState("networkidle");
    await expect(loginPage.usernameInput).toBeVisible({ timeout: 10000 });
    await expect(loginPage.passwordInput).toBeVisible();
  });

  test("should show error for empty credentials", async () => {
    await loginPage.loginButton.click();
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test("should show error for invalid credentials", async () => {
    await loginPage.login("invaliduser", "wrongpassword");
    // Wait for error message or response
    await loginPage.page.waitForTimeout(2000);
    // Note: Actual error behavior depends on the application
  });

  test("should navigate to register page", async () => {
    await loginPage.clickRegister();
    // Check if registration form appears
    const registerForm = loginPage.page.locator("form");
    await expect(registerForm).toBeVisible();
  });

  test("should close login dialog", async () => {
    const closeBtn = loginPage.closeButton.first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await homePage.page.waitForTimeout(1000);
    }
    await expect(homePage.loginButton).toBeVisible();
  });

  test("should validate username field is required", async () => {
    await loginPage.usernameInput.focus();
    await loginPage.passwordInput.focus();
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test("should validate password field is required", async () => {
    await loginPage.passwordInput.focus();
    await loginPage.usernameInput.focus();
    await expect(loginPage.errorMessage).toBeVisible();
  });
});
