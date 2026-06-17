import { test as base, expect as baseExpect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { BookDetailsPage } from "../pages/BookDetailsPage";
import { CartPage } from "../pages/CartPage";

type PageFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  bookDetailsPage: BookDetailsPage;
  cartPage: CartPage;
};

const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  bookDetailsPage: async ({ page }, use) => {
    const bookDetailsPage = new BookDetailsPage(page);
    await use(bookDetailsPage);
  },

  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },
});

const expect = baseExpect;

export { test, expect };
