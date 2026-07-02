/**
 * Test Data for Cart DB Validation Feature - Staging Environment
 *
 * This file contains test data specific to the Cart DB Validation feature in staging environment.
 * Data is organized by scenario tags for easy lookup.
 */

import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export interface TestDataStructure {
  common: Record<string, any>;
  scenarios: Record<string, Record<string, any>>;
}

export const testData: TestDataStructure = {
  // Common data shared across all scenarios in this feature
  common: {
    userId: "1001",
    username: "staginguser",
    accountId: "67890",
    environment: "staging",
    baseUrl: process.env.BASE_URL || "https://localhost:53424",
    apiUrl: process.env.API_BASE_URL || "https://localhost:53424/api",
    database: {
      host: process.env.DB_SERVER || "staging-db.bookcart.com",
      port: 1433,
      database: process.env.DB_NAME || "BookCart",
      user: process.env.DB_USER || "sa",
      password: process.env.DB_PASSWORD || "",
    },
  },

  // Scenario-specific data mapped by scenario tags
  scenarios: {
    // @cart @dbValidation @database - Validate cart total
    dbValidation: {
      userId: "1001",
      bookCount: "2",
      queryName: "cart.getTotal",
      tolerance: {
        absolute: 0.01,
        percentage: 0.05,
      },
    },

    // @cart @dbValidation @database - Validate item count
    itemCount: {
      userId: "1001",
      bookCount: "3",
      queryName: "cart.getCount",
      expectedRowCount: 1,
    },

    // @cart @dbValidation @database @complex - Validate cart items details
    complex: {
      userId: "1001",
      queryName: "cart.getItems",
      books: [
        { title: "Book One", price: "10.00", quantity: "2" },
        { title: "Book Two", price: "15.00", quantity: "1" },
        { title: "Book Three", price: "20.00", quantity: "3" },
      ],
      tolerance: {
        quantityAbsolute: 0,
        priceAbsolute: 0.01,
      },
    },

    // @cart @dbValidation @database @analytics @wip - Sales by category
    analytics: {
      queryName: "sales.byCategory",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      minExpectedRows: 1,
    },
  },
};

export default testData;
