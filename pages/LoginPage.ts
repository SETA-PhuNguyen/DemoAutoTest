import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly registerLink: Locator;
  readonly errorMessage: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[formcontrolname="username"]');
    this.passwordInput = page.locator('input[formcontrolname="password"]');
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.registerLink = page.getByText("Register");
    this.errorMessage = page.locator("mat-error");
    this.closeButton = page.getByLabel("Close");
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async clickRegister() {
    await this.registerLink.click();
  }

  async close() {
    await this.closeButton.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }
}
