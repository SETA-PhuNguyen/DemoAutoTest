import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly totalPrice: Locator;
  readonly checkoutButton: Locator;
  readonly clearCartButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator(".cart-item");
    this.totalPrice = page.locator(".total-price");
    this.checkoutButton = page.getByRole("button", { name: "Checkout" });
    this.clearCartButton = page.getByRole("button", { name: "Clear Cart" });
    this.continueShoppingButton = page.getByRole("button", {
      name: "Continue Shopping",
    });
    this.emptyCartMessage = page.getByText("Your shopping cart is empty");
  }

  async getCartItemsCount() {
    return await this.cartItems.count();
  }

  async getTotalPrice() {
    return await this.totalPrice.textContent();
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  async clearCart() {
    await this.clearCartButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async isCartEmpty() {
    return await this.emptyCartMessage.isVisible();
  }

  async removeItem(itemName: string) {
    await this.page
      .locator(`text=${itemName}`)
      .locator("..")
      .locator('[aria-label="Remove"]')
      .click();
  }
}
