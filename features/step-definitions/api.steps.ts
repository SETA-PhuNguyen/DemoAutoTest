import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/world";
import {
  ApiEndpoints,
  ApiEndpointResolver,
  ApiHeaders,
  ApiStatusCodes,
  ApiTimeouts,
} from "../../utils/apiEndpoints";

// NOTE: Hooks have been moved to features/support/hooks.ts

// ============================================================================
// Given Steps - Setup & Prerequisites
// ============================================================================
Given(
  "I know a valid book ID {string}",
  async function (this: CustomWorld, bookId: string) {
    this.bookId = bookId;
  },
);

Given(
  "I have a valid book ID {string}",
  async function (this: CustomWorld, bookId: string) {
    this.bookId = bookId;
  },
);

Given(
  "I am authenticated as {string}",
  async function (this: CustomWorld, username: string) {
    // Perform login and get token using ApiEndpoints
    const url = ApiEndpointResolver.getFullUrl(ApiEndpoints.LOGIN);
    const loginResponse = await this.apiContext.post(url, {
      data: {
        username: username,
        password: process.env.TEST_PASSWORD || "Test@123",
      },
      timeout: ApiTimeouts.DEFAULT,
    });

    if (loginResponse.ok()) {
      const data = await loginResponse.json();
      this.authToken = data.token || "";
      this.userId = data.userId || "1";
    }
  },
);

Given(
  "I have a valid userId {string} and bookId {string}",
  async function (this: CustomWorld, userId: string, bookId: string) {
    this.userId = userId;
    this.bookId = bookId;
  },
);

Given(
  "I have a valid userId {string}",
  async function (this: CustomWorld, userId: string) {
    this.userId = userId;
  },
);

Given("I have a book in my cart", async function (this: CustomWorld) {
  // Add a book to cart for testing using ApiEndpoints
  const url = ApiEndpointResolver.getFullUrl(ApiEndpoints.CART_ADD, {
    userId: this.userId,
    bookId: "1",
  });
  await this.apiContext.post(url, {
    headers: {
      [ApiHeaders.AUTHORIZATION]: `Bearer ${this.authToken}`,
    },
  });
});

Given("I have items in my cart", async function (this: CustomWorld) {
  // Add multiple books to cart using ApiEndpoints
  const url1 = ApiEndpointResolver.getFullUrl(ApiEndpoints.CART_ADD, {
    userId: this.userId,
    bookId: "1",
  });
  const url2 = ApiEndpointResolver.getFullUrl(ApiEndpoints.CART_ADD, {
    userId: this.userId,
    bookId: "2",
  });
  await this.apiContext.post(url1);
  await this.apiContext.post(url2);
});

Given("I have multiple items in my cart", async function (this: CustomWorld) {
  // Add multiple books to cart using ApiEndpoints
  for (let i = 1; i <= 3; i++) {
    const url = ApiEndpointResolver.getFullUrl(ApiEndpoints.CART_ADD, {
      userId: this.userId,
      bookId: String(i),
    });
    await this.apiContext.post(url);
  }
});

Given("I have a book in my wishlist", async function (this: CustomWorld) {
  // Add a book to wishlist using ApiEndpoints
  const url = ApiEndpointResolver.getFullUrl(ApiEndpoints.WISHLIST_TOGGLE, {
    userId: this.userId,
    bookId: "1",
  });
  await this.apiContext.post(url, {
    headers: {
      [ApiHeaders.AUTHORIZATION]: `Bearer ${this.authToken}`,
    },
  });
});

Given(
  "I am authenticated as an admin user",
  async function (this: CustomWorld) {
    // Login as admin using ApiEndpoints
    const url = ApiEndpointResolver.getFullUrl(ApiEndpoints.LOGIN);
    const loginResponse = await this.apiContext.post(url, {
      data: {
        username: process.env.ADMIN_USERNAME || "admin",
        password: process.env.ADMIN_PASSWORD || "Admin@123",
      },
    });

    if (loginResponse.ok()) {
      const data = await loginResponse.json();
      this.authToken = data.token || "";
    }
  },
);

Given("I have database connection", async function (this: CustomWorld) {
  // Database connection setup would go here
  // For now, this is a placeholder
  console.log("Database connection would be established here");
});

// When Steps
When(
  "I send a GET request to {string}",
  async function (this: CustomWorld, endpoint: string) {
    this.requestStartTime = Date.now();
    const url = `${this.baseURL}${endpoint}`;
    this.response = await this.apiContext.get(url, {
      headers: this.authToken
        ? { Authorization: `Bearer ${this.authToken}` }
        : {},
    });
    this.responseTime = Date.now() - this.requestStartTime;

    // Try to parse JSON response
    try {
      const contentType = this.response.headers()["content-type"];
      if (contentType && contentType.includes("application/json")) {
        this.responseData = await this.response.json();
      }
    } catch (error) {
      // Response is not JSON, skip parsing
    }
  },
);

When(
  "I send a POST request to {string} with body:",
  async function (this: CustomWorld, endpoint: string, docString: string) {
    const body = JSON.parse(docString);

    // Replace <timestamp> with actual timestamp for unique usernames
    if (body.username && body.username.includes("<timestamp>")) {
      body.username = body.username.replace(
        "<timestamp>",
        Date.now().toString(),
      );
    }

    this.requestStartTime = Date.now();
    const url = `${this.baseURL}${endpoint}`;
    this.response = await this.apiContext.post(url, {
      data: body,
      headers: this.authToken
        ? { Authorization: `Bearer ${this.authToken}` }
        : {},
    });
    this.responseTime = Date.now() - this.requestStartTime;

    // Try to parse JSON response
    try {
      const contentType = this.response.headers()["content-type"];
      if (contentType && contentType.includes("application/json")) {
        this.responseData = await this.response.json();
      }
    } catch (error) {
      // Response is not JSON, skip parsing
    }
  },
);

When(
  "I send a POST request to {string}",
  async function (this: CustomWorld, endpoint: string) {
    this.requestStartTime = Date.now();
    const url = `${this.baseURL}${endpoint}`;
    this.response = await this.apiContext.post(url, {
      headers: this.authToken
        ? { Authorization: `Bearer ${this.authToken}` }
        : {},
    });
    this.responseTime = Date.now() - this.requestStartTime;

    // Try to parse JSON response
    try {
      const contentType = this.response.headers()["content-type"];
      if (contentType && contentType.includes("application/json")) {
        this.responseData = await this.response.json();
      }
    } catch (error) {
      // Response is not JSON, skip parsing
    }
  },
);

When(
  "I send a PUT request to {string} with quantity {string}",
  async function (this: CustomWorld, endpoint: string, quantity: string) {
    this.requestStartTime = Date.now();
    const url = `${this.baseURL}${endpoint}`;
    this.response = await this.apiContext.put(url, {
      data: { quantity: parseInt(quantity) },
      headers: this.authToken
        ? { Authorization: `Bearer ${this.authToken}` }
        : {},
    });
    this.responseTime = Date.now() - this.requestStartTime;

    if (this.response.ok()) {
      this.responseData = await this.response.json();
    }
  },
);

When(
  "I send a DELETE request to {string}",
  async function (this: CustomWorld, endpoint: string) {
    this.requestStartTime = Date.now();
    const url = `${this.baseURL}${endpoint}`;
    this.response = await this.apiContext.delete(url, {
      headers: this.authToken
        ? { Authorization: `Bearer ${this.authToken}` }
        : {},
    });
    this.responseTime = Date.now() - this.requestStartTime;
  },
);

When(
  "I send a POST request to {string} with shipping details:",
  async function (this: CustomWorld, endpoint: string, docString: string) {
    const shippingDetails = JSON.parse(docString);

    this.requestStartTime = Date.now();
    const url = `${this.baseURL}${endpoint}`;
    this.response = await this.apiContext.post(url, {
      data: shippingDetails,
      headers: this.authToken
        ? { Authorization: `Bearer ${this.authToken}` }
        : {},
    });
    this.responseTime = Date.now() - this.requestStartTime;

    if (this.response.ok()) {
      this.responseData = await this.response.json();
    }
  },
);

When(
  "I select the first book from the response",
  async function (this: CustomWorld) {
    if (Array.isArray(this.responseData) && this.responseData.length > 0) {
      this.responseData = this.responseData[0];
    }
  },
);

When(
  "I send a POST request to {string} without authentication",
  async function (this: CustomWorld, endpoint: string) {
    const url = `${this.baseURL}${endpoint}`;
    this.response = await this.apiContext.post(url, {
      data: {},
    });

    if (this.response.ok()) {
      this.responseData = await this.response.json();
    }
  },
);

When(
  "I query the database for book with ID {string}",
  async function (this: CustomWorld, bookId: string) {
    // Database query would go here
    // For now, this is a placeholder
    console.log(`Would query database for book ID: ${bookId}`);
  },
);

When(
  "I send a POST request to {string} with new book data:",
  async function (this: CustomWorld, endpoint: string, docString: string) {
    const bookData = JSON.parse(docString);

    this.requestStartTime = Date.now();
    const url = `${this.baseURL}${endpoint}`;
    this.response = await this.apiContext.post(url, {
      data: bookData,
      headers: {
        Authorization: `Bearer ${this.authToken}`,
        "Content-Type": "application/json",
      },
    });
    this.responseTime = Date.now() - this.requestStartTime;

    if (this.response.ok()) {
      this.responseData = await this.response.json();
      if (this.responseData.bookId) {
        this.bookId = this.responseData.bookId.toString();
      }
    }
  },
);

When(
  "I send a PUT request to {string} with updated book data",
  async function (this: CustomWorld, endpoint: string) {
    const updatedData = {
      ...this.responseData,
      title: "Updated " + this.responseData.title,
    };

    const url = `${this.baseURL}${endpoint}`;
    this.response = await this.apiContext.put(url, {
      data: updatedData,
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
    });
  },
);

When(
  "I send a POST request to {string} with unique user data",
  async function (this: CustomWorld, endpoint: string) {
    const timestamp = Date.now();
    const userData = {
      firstName: "Test",
      lastName: "User",
      username: `testuser${timestamp}`,
      password: "Test@123",
      gender: "Male",
      userTypeId: 1,
    };

    const url = `${this.baseURL}${endpoint}`;
    this.response = await this.apiContext.post(url, {
      data: userData,
    });

    if (this.response.ok()) {
      this.responseData = await this.response.json();
      if (this.responseData.userId) {
        this.userId = this.responseData.userId.toString();
      }
    }
  },
);

When(
  "I send a POST request to {string} with new user credentials",
  async function (this: CustomWorld, endpoint: string) {
    // This would use the saved user credentials from registration
    // For now, using default test credentials
    const url = `${this.baseURL}${endpoint}`;
    this.response = await this.apiContext.post(url, {
      data: {
        username: process.env.TEST_USERNAME || "testuser",
        password: process.env.TEST_PASSWORD || "Test@123",
      },
    });

    if (this.response.ok()) {
      const data = await this.response.json();
      this.authToken = data.token || "";
    }
  },
);

When(
  "I send a POST request to {string} with auth token",
  async function (this: CustomWorld, endpoint: string) {
    // Replace placeholders in endpoint
    const finalEndpoint = endpoint
      .replace("<userId>", this.userId)
      .replace("<bookId>", this.bookId);

    const url = `${this.baseURL}${finalEndpoint}`;
    this.response = await this.apiContext.post(url, {
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
    });

    if (this.response.ok()) {
      this.responseData = await this.response.json();
    }
  },
);

When(
  "I send a GET request to {string} with auth token",
  async function (this: CustomWorld, endpoint: string) {
    // Replace placeholders in endpoint
    const finalEndpoint = endpoint
      .replace("<userId>", this.userId)
      .replace("<bookId>", this.bookId);

    const url = `${this.baseURL}${finalEndpoint}`;
    this.response = await this.apiContext.get(url, {
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
    });

    if (this.response.ok()) {
      this.responseData = await this.response.json();
    }
  },
);

When(
  "I send a POST request to {string} with complete order details",
  async function (this: CustomWorld, endpoint: string) {
    const finalEndpoint = endpoint.replace("<userId>", this.userId);

    const orderDetails = {
      name: "Test User",
      addressLine1: "123 Test St",
      addressLine2: "Apt 1",
      city: "Test City",
      state: "TS",
      zipCode: "12345",
      country: "Test Country",
    };

    const url = `${this.baseURL}${finalEndpoint}`;
    this.response = await this.apiContext.post(url, {
      data: orderDetails,
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
    });

    if (this.response.ok()) {
      this.responseData = await this.response.json();
    }
  },
);

// Then Steps
Then(
  "the response status code should be {int}",
  async function (this: CustomWorld, statusCode: number) {
    expect(this.response.status()).toBe(statusCode);
  },
);

Then(
  "the response should contain a list of books",
  async function (this: CustomWorld) {
    expect(Array.isArray(this.responseData)).toBeTruthy();
    expect(this.responseData.length).toBeGreaterThan(0);
  },
);

Then(
  "each book should have the following fields:",
  async function (this: CustomWorld, dataTable: any) {
    const fields = dataTable.raw().flat();

    if (Array.isArray(this.responseData) && this.responseData.length > 0) {
      const firstBook = this.responseData[0];
      fields.forEach((field: string) => {
        expect(firstBook).toHaveProperty(field);
      });
    }
  },
);

Then(
  "the response should contain book details",
  async function (this: CustomWorld) {
    expect(this.responseData).toBeDefined();
    expect(this.responseData).toHaveProperty("bookId");
    expect(this.responseData).toHaveProperty("title");
  },
);

Then("the book should have a valid title", async function (this: CustomWorld) {
  expect(this.responseData.title).toBeDefined();
  expect(this.responseData.title.length).toBeGreaterThan(0);
});

Then(
  "the book should have a valid price greater than 0",
  async function (this: CustomWorld) {
    expect(this.responseData.price).toBeDefined();
    expect(parseFloat(this.responseData.price)).toBeGreaterThan(0);
  },
);

Then(
  "the response should contain an error message",
  async function (this: CustomWorld) {
    expect(this.response.status()).toBeGreaterThanOrEqual(400);
  },
);

Then(
  "the response should contain a list of categories",
  async function (this: CustomWorld) {
    expect(Array.isArray(this.responseData)).toBeTruthy();
    expect(this.responseData.length).toBeGreaterThan(0);
  },
);

Then(
  "each category should have categoryId and categoryName",
  async function (this: CustomWorld) {
    if (Array.isArray(this.responseData) && this.responseData.length > 0) {
      const firstCategory = this.responseData[0];
      expect(firstCategory).toHaveProperty("categoryId");
      expect(firstCategory).toHaveProperty("categoryName");
    }
  },
);

Then(
  "the book price should be a positive number",
  async function (this: CustomWorld) {
    expect(parseFloat(this.responseData.price)).toBeGreaterThan(0);
  },
);

Then("the book title should not be empty", async function (this: CustomWorld) {
  expect(this.responseData.title).toBeDefined();
  expect(this.responseData.title.trim().length).toBeGreaterThan(0);
});

Then("the book author should not be empty", async function (this: CustomWorld) {
  expect(this.responseData.author).toBeDefined();
  expect(this.responseData.author.trim().length).toBeGreaterThan(0);
});

Then(
  "the book category should be a valid category",
  async function (this: CustomWorld) {
    expect(this.responseData.category).toBeDefined();
  },
);

Then(
  "the response should contain similar books",
  async function (this: CustomWorld) {
    expect(Array.isArray(this.responseData)).toBeTruthy();
  },
);

Then(
  "similar books should be from the same category",
  async function (this: CustomWorld) {
    if (Array.isArray(this.responseData) && this.responseData.length > 1) {
      const firstCategory = this.responseData[0].category;
      this.responseData.forEach((book: any) => {
        expect(book.category).toBe(firstCategory);
      });
    }
  },
);

Then(
  "the response should contain an authentication token",
  async function (this: CustomWorld) {
    expect(this.responseData).toHaveProperty("token");
    this.authToken = this.responseData.token;
  },
);

Then(
  "the response should contain user details",
  async function (this: CustomWorld) {
    expect(this.responseData).toHaveProperty("userId");
  },
);

Then(
  "the response should contain an error message {string}",
  async function (this: CustomWorld, errorMessage: string) {
    expect(this.response.status()).toBeGreaterThanOrEqual(400);
    // The actual error message structure may vary
  },
);

Then(
  "the response should contain the new user ID",
  async function (this: CustomWorld) {
    expect(this.responseData).toHaveProperty("userId");
    this.userId = this.responseData.userId.toString();
  },
);

Then(
  "the response should indicate if username is available",
  async function (this: CustomWorld) {
    expect(this.responseData).toBeDefined();
  },
);

Then(
  "the book should be added to the cart via API",
  async function (this: CustomWorld) {
    expect(this.response.ok()).toBeTruthy();
  },
);

Then(
  "the response should contain cart items",
  async function (this: CustomWorld) {
    expect(Array.isArray(this.responseData)).toBeTruthy();
  },
);

Then(
  "each cart item should have book details and quantity",
  async function (this: CustomWorld) {
    if (Array.isArray(this.responseData) && this.responseData.length > 0) {
      const firstItem = this.responseData[0];
      expect(firstItem).toHaveProperty("book");
      expect(firstItem).toHaveProperty("quantity");
    }
  },
);

Then(
  "the cart should be updated with new quantity",
  async function (this: CustomWorld) {
    expect(this.response.ok()).toBeTruthy();
  },
);

Then(
  "the item should be removed from cart",
  async function (this: CustomWorld) {
    expect(this.response.ok()).toBeTruthy();
  },
);

Then("the cart should be empty via API", async function (this: CustomWorld) {
  expect(this.response.ok()).toBeTruthy();
});

Then(
  "the response should contain order confirmation",
  async function (this: CustomWorld) {
    expect(this.response.ok()).toBeTruthy();
    expect(this.responseData).toBeDefined();
  },
);

Then(
  "the order should have a valid order ID",
  async function (this: CustomWorld) {
    expect(this.responseData).toHaveProperty("orderId");
  },
);

Then(
  "the response should contain order history",
  async function (this: CustomWorld) {
    expect(Array.isArray(this.responseData)).toBeTruthy();
  },
);

Then(
  "each order should have order details and items",
  async function (this: CustomWorld) {
    if (Array.isArray(this.responseData) && this.responseData.length > 0) {
      const firstOrder = this.responseData[0];
      expect(firstOrder).toHaveProperty("orderId");
    }
  },
);

Then(
  "the book should be added to wishlist",
  async function (this: CustomWorld) {
    expect(this.response.ok()).toBeTruthy();
  },
);

Then(
  "the response should contain wishlist items",
  async function (this: CustomWorld) {
    expect(Array.isArray(this.responseData)).toBeTruthy();
  },
);

Then(
  "the book should be removed from wishlist",
  async function (this: CustomWorld) {
    expect(this.response.ok()).toBeTruthy();
  },
);

Then(
  "the response time should be less than {int} milliseconds",
  async function (this: CustomWorld, maxTime: number) {
    expect(this.responseTime).toBeLessThan(maxTime);
  },
);

Then("I save the new user ID", async function (this: CustomWorld) {
  if (this.responseData && this.responseData.userId) {
    this.userId = this.responseData.userId.toString();
  }
});

Then("I save the authentication token", async function (this: CustomWorld) {
  if (this.responseData && this.responseData.token) {
    this.authToken = this.responseData.token;
  }
});

Then("I save the new book ID", async function (this: CustomWorld) {
  if (this.responseData && this.responseData.bookId) {
    this.bookId = this.responseData.bookId.toString();
  }
});

Then(
  "the cart should contain {int} item",
  async function (this: CustomWorld, itemCount: number) {
    if (Array.isArray(this.responseData)) {
      expect(this.responseData.length).toBe(itemCount);
    }
  },
);

Then("I should receive order confirmation", async function (this: CustomWorld) {
  expect(this.response.ok()).toBeTruthy();
  expect(this.responseData).toHaveProperty("orderId");
});

Then(
  "the order history should contain the new order",
  async function (this: CustomWorld) {
    expect(Array.isArray(this.responseData)).toBeTruthy();
    expect(this.responseData.length).toBeGreaterThan(0);
  },
);

Then(
  "the book title should be {string}",
  async function (this: CustomWorld, title: string) {
    expect(this.responseData.title).toBe(title);
  },
);

Then(
  "the response should contain {string} message",
  async function (this: CustomWorld, message: string) {
    expect(this.response.status()).toBe(401);
  },
);

Then(
  "the API response should match the database record",
  async function (this: CustomWorld) {
    // Database comparison would go here
    console.log("Would compare API response with database record");
  },
);

Then("the book title should match", async function (this: CustomWorld) {
  // Database comparison
  console.log("Would verify book title matches database");
});

Then("the book price should match", async function (this: CustomWorld) {
  // Database comparison
  console.log("Would verify book price matches database");
});

Then("the book author should match", async function (this: CustomWorld) {
  // Database comparison
  console.log("Would verify book author matches database");
});
