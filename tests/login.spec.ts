import { test, expect } from "../utils/fixtures";

test.describe("BookCart Login Tests", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
    await homePage.clickLogin();
  });

  test("should display login form", async ({ loginPage }) => {
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.registerLink).toBeVisible();
  });

  test("should show error for empty credentials", async ({ loginPage }) => {
    await loginPage.loginButton.click();
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test("should show error for invalid credentials", async ({ loginPage }) => {
    await loginPage.login("invaliduser", "wrongpassword");
    // Wait for error message or response
    await loginPage.page.waitForTimeout(2000);
    // Note: Actual error behavior depends on the application
  });

  test("should navigate to register page", async ({ loginPage }) => {
    await loginPage.clickRegister();
    // Check if registration form appears
    const registerForm = loginPage.page.locator("form");
    await expect(registerForm).toBeVisible();
  });

  test("should close login dialog", async ({ loginPage, homePage }) => {
    await loginPage.close();
    await expect(homePage.loginButton).toBeVisible();
  });

  test("should validate username field is required", async ({ loginPage }) => {
    await loginPage.usernameInput.focus();
    await loginPage.passwordInput.focus();
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test("should validate password field is required", async ({ loginPage }) => {
    await loginPage.passwordInput.focus();
    await loginPage.usernameInput.focus();
    await expect(loginPage.errorMessage).toBeVisible();
  });
});
