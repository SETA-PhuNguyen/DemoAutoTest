/**
 * Test Data for Cart Feature - Development Environment
 *
 * This file contains test data specific to the Cart feature in dev environment.
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
    userId: "1",
    username: "testuser",
    accountId: "12345",
    environment: "dev",
    baseUrl: process.env.BASE_URL || "https://localhost:53424",
    apiUrl: process.env.API_BASE_URL || "https://localhost:53424/api",
  },

  // Scenario-specific data mapped by scenario tags
  scenarios: {
    // @smoke @cart
    smoke: {
      testUserId: "1",
      expectedCartUrl: "/shopping-cart",
    },

    // @cart @empty
    empty: {
      userId: "2",
      emptyMessage: "Your cart is empty",
      continueShoppingButton: "Continue Shopping",
    },

    // @cart @add
    add: {
      userId: "3",
      bookId: "101",
      bookTitle: "Test Book 1",
      bookPrice: "10.00",
      quantity: "1",
    },

    // @cart @quantity
    quantity: {
      userId: "4",
      initialQuantity: "1",
      updatedQuantity: "3",
      maxQuantity: "10",
    },

    // @cart @remove
    remove: {
      userId: "5",
      cartItemCount: "2",
    },

    // @cart @calculation
    calculation: {
      userId: "6",
      taxRate: "0.08",
      shippingCost: "5.00",
    },

    // @cart @validation - DB validation example
    validation: {
      userId: "7",
      accountId: "12345",
      startTime: "2024-01-01 00:00:00",
      endTime: "2024-12-31 23:59:59",
      queryName: "cart.getTotal",
      tolerance: {
        absolute: 0.01, // Allow $0.01 difference
        percentage: 0.05, // Allow 5% difference
      },
    },

    // @cart @dbValidation - Advanced DB validation
    dbValidation: {
      userId: "8",
      accountId: "12345",
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
