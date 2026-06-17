import { test as setup, expect } from "@playwright/test";

setup("verify BookCart is accessible", async ({ page }) => {
  await page.goto("https://bookcart.azurewebsites.net");
  await expect(page).toHaveTitle(/Home/);
  await page.waitForLoadState("networkidle");
});
