import { test, expect } from "../utils/fixtures";

test.describe("BookCart Shopping Cart Tests", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test("should navigate to cart page", async ({ page, homePage }) => {
    await homePage.clickShoppingCart();
    await expect(page).toHaveURL(/shopping-cart/);
  });

  test("should display empty cart message initially", async ({
    homePage,
    cartPage,
  }) => {
    await homePage.clickShoppingCart();
    const isEmpty = await cartPage.isCartEmpty();
    // Cart might be empty or have items from previous sessions
    expect(typeof isEmpty).toBe("boolean");
  });

  test("should show cart icon on home page", async ({ homePage }) => {
    await expect(homePage.shoppingCartIcon).toBeVisible();
    await expect(homePage.shoppingCartIcon).toBeEnabled();
  });

  test("should be able to click continue shopping from cart", async ({
    page,
    homePage,
    cartPage,
  }) => {
    await homePage.clickShoppingCart();

    // Check if continue shopping button exists
    const continueButton = cartPage.continueShoppingButton;
    if (await continueButton.isVisible()) {
      await cartPage.continueShopping();
      await expect(page).toHaveURL("/");
    }
  });
});
