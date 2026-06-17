import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  readonly loginButton: Locator;
  readonly shoppingCartIcon: Locator;
  readonly searchInput: Locator;
  readonly allCategoriesDropdown: Locator;
  readonly swaggerLink: Locator;
  readonly githubLink: Locator;
  readonly categoryFilters: Locator;
  readonly priceSlider: Locator;

  constructor(page: Page) {
    super(page);
    this.loginButton = page.getByRole("button", { name: /login/i });
    this.shoppingCartIcon = page.locator(
      'button[routerlink="/shopping-cart"], a[href="/shopping-cart"], button:has-text("shopping_cart")',
    );
    this.searchInput = page.locator(
      'input[type="search"], mat-form-field input',
    );
    this.allCategoriesDropdown = page.getByRole("button", {
      name: /All Categories/i,
    });
    this.swaggerLink = page.getByRole("link", { name: /swagger/i });
    this.githubLink = page.getByRole("link", { name: /github/i });
    this.categoryFilters = page.locator(".mat-list-item, mat-list-option");
    this.priceSlider = page.locator("mat-slider, .mat-slider");
  }

  async goto() {
    await this.navigate("/");
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async searchForBook(bookName: string) {
    await this.searchInput.fill(bookName);
    await this.searchInput.press("Enter");
  }

  async selectCategory(category: string) {
    await this.page.getByText(category, { exact: true }).click();
  }

  async getBookCards() {
    return this.page.locator("app-book-card");
  }

  async clickShoppingCart() {
    await this.shoppingCartIcon.click();
  }
}
