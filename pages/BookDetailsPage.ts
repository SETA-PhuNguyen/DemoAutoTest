import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class BookDetailsPage extends BasePage {
  readonly bookTitle: Locator;
  readonly bookAuthor: Locator;
  readonly bookPrice: Locator;
  readonly bookDescription: Locator;
  readonly addToCartButton: Locator;
  readonly quantityInput: Locator;

  constructor(page: Page) {
    super(page);
    this.bookTitle = page.locator("app-book-details h1");
    this.bookAuthor = page.locator(".author");
    this.bookPrice = page.locator(".price");
    this.bookDescription = page.locator(".description");
    this.addToCartButton = page.getByRole("button", { name: "Add to Cart" });
    this.quantityInput = page.locator('input[type="number"]');
  }

  async addToCart(quantity: number = 1) {
    if (quantity > 1) {
      await this.quantityInput.fill(quantity.toString());
    }
    await this.addToCartButton.click();
  }

  async getBookInfo() {
    return {
      title: await this.bookTitle.textContent(),
      author: await this.bookAuthor.textContent(),
      price: await this.bookPrice.textContent(),
      description: await this.bookDescription.textContent(),
    };
  }
}
