/**
 * Test Data for Cart Feature - Staging Environment
 *
 * This file contains test data specific to the Cart feature in staging environment.
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
  },

  // Scenario-specific data mapped by scenario tags
  scenarios: {
    smoke: {
      testUserId: "1001",
      expectedCartUrl: "/shopping-cart",
    },

    empty: {
      userId: "1002",
      emptyMessage: "Your cart is empty",
      continueShoppingButton: "Continue Shopping",
    },

    add: {
      userId: "1003",
      bookId: "201",
      bookTitle: "Staging Book 1",
      bookPrice: "12.99",
      quantity: "1",
    },

    quantity: {
      userId: "1004",
      initialQuantity: "1",
      updatedQuantity: "3",
      maxQuantity: "10",
    },

    remove: {
      userId: "1005",
      cartItemCount: "2",
    },

    calculation: {
      userId: "1006",
      taxRate: "0.08",
      shippingCost: "5.00",
    },

    validation: {
      userId: "1007",
      accountId: "67890",
      startTime: "2024-01-01 00:00:00",
      endTime: "2024-12-31 23:59:59",
      queryName: "cart.getTotal",
      tolerance: {
        absolute: 0.01,
        percentage: 0.05,
      },
    },

    dbValidation: {
      userId: "1008",
      accountId: "67890",
      startTime: "2024-01-01 00:00:00",
      endTime: "2024-12-31 23:59:59",
      expectedCategories: ["Fiction", "Non-Fiction", "Biography"],
      tolerance: {
        absolute: 1,
        percentage: 0.1,
      },
    },
  },
};

export default testData;
