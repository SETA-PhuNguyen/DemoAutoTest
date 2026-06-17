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
    this.usernameInput = page.locator(
      'input[formcontrolname="username"], input[name="username"], #mat-input-0',
    );
    this.passwordInput = page.locator(
      'input[formcontrolname="password"], input[name="password"], input[type="password"]',
    );
    this.loginButton = page.getByRole("button", { name: /login/i }).last();
    this.registerLink = page.getByText(/register/i, { exact: false });
    this.errorMessage = page.locator("mat-error, .mat-error, .error-message");
    this.closeButton = page.locator(
      'button[mat-dialog-close], button[aria-label="Close"], button:has-text("close")',
    );
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
