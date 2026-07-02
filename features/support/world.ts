import { Browser, Page, BrowserContext } from "@playwright/test";
import { APIRequestContext, APIResponse } from "@playwright/test";
import { HomePage } from "../../pages/HomePage";
import { LoginPage } from "../../pages/LoginPage";
import { CartPage } from "../../pages/CartPage";
import { BookDetailsPage } from "../../pages/BookDetailsPage";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * CustomWorld - Unified World context for UI, API, and hybrid testing
 *
 * This class serves as the central state container for all test types:
 * - UI Testing: Uses browser, page, and page objects
 * - API Testing: Uses apiContext and API-related properties
 * - Hybrid Testing: Can coordinate between UI and API seamlessly
 *
 * Architecture inspired by enterprise test automation patterns.
 */
export class CustomWorld {
  // ============================================================================
  // UI Testing Components
  // ============================================================================

  /** Playwright browser instance */
  browser!: Browser;

  /** Browser context for isolation */
  context!: BrowserContext;

  /** Current page instance */
  page!: Page;

  // Page Objects (UI Layer)
  homePage!: HomePage;
  loginPage!: LoginPage;
  cartPage!: CartPage;
  bookDetailsPage!: BookDetailsPage;

  // ============================================================================
  // API Testing Components
  // ============================================================================

  /** API request context for making HTTP requests */
  apiContext!: APIRequestContext;

  /** Base URL for API requests */
  baseURL: string = process.env.API_BASE_URL || "https://localhost:53424/api";

  /** Last API response received */
  response!: APIResponse;

  /** Store last API response data */
  lastApiResponse?: any;

  /** Store API errors for validation */
  lastApiError?: any;

  /** Authentication token for API requests */
  authToken: string = "";

  /** Access token (alternative to authToken) */
  accessToken?: string;

  /** Current user ID */
  userId: string = "";

  /** Current book ID */
  bookId: string = "";

  /** Parsed response data */
  responseData: any;

  /** Request start timestamp for performance measurement */
  requestStartTime: number = 0;

  /** Response time in milliseconds */
  responseTime: number = 0;

  // ============================================================================
  // API Request State Management
  // ============================================================================

  /**
   * API Request Configuration
   * Built by "When" steps, executed by API layer
   */
  apiRequest?: {
    baseUrl: string;
    endpoint: string;
    method: string;
    queryParams: { [key: string]: any };
    headers: { [key: string]: string };
    pathParams?: { [key: string]: any };
    requestBody?: any;
    skipAuth?: boolean;
  };

  // ============================================================================
  // Test Data Management
  // ============================================================================

  /** Environment-specific test data */
  testData?: any;

  /** Scenario tags for conditional logic */
  scenarioTags?: string[];

  // ============================================================================
  // Value Storage & Reuse
  // ============================================================================

  /** Store a single extracted value */
  savedValue?: string;

  /** Store multiple extracted values */
  savedValues: string[] = [];

  /** Store complex objects or named values */
  storedValues: any = {};

  // ============================================================================
  // Database Validation Support
  // ============================================================================

  /** Track current filter type for DB validation */
  dbFilterType?: string;

  /** Database query results */
  dbQueryResult?: any[];

  /** Generic query results */
  queryResults?: any[];

  // ============================================================================
  // Resource Tracking for Cleanup
  // ============================================================================

  /** Track created user for cleanup */
  createdUserId?: string;

  /** Track created order for cleanup */
  createdOrderId?: string;

  // ============================================================================
  // Dynamic State Management
  // ============================================================================

  /** Capture exact start time for time-based queries */
  dynamicStartTime?: string;

  /** Capture exact end time for time-based queries */
  dynamicEndTime?: string;

  // ============================================================================
  // Export & Count Validation
  // ============================================================================

  /** Count of items in various contexts */
  itemCount?: number;

  /** Count of books in search results */
  bookCount?: number;

  /** Count of cart items */
  cartItemCount?: number;

  // ============================================================================
  // Parallel Request Support
  // ============================================================================

  /**
   * Store results from multiple parallel API requests
   * Used with Promise.all for concurrent API testing
   */
  allApiResponses?: Array<{
    status: number;
    statusText: string;
    headers: Record<string, string>;
    data: any;
  }>;
}

/**
 * SharedWorld - Shared context that can be used across different test types
 * Use this for data that needs to be shared between UI and API tests
 */
export class SharedWorld {
  // Shared test data
  testData: Map<string, any> = new Map();

  // Store data with a key
  setData(key: string, value: any): void {
    this.testData.set(key, value);
  }

  // Retrieve data by key
  getData(key: string): any {
    return this.testData.get(key);
  }

  // Check if data exists
  hasData(key: string): boolean {
    return this.testData.has(key);
  }

  // Clear all data
  clearData(): void {
    this.testData.clear();
  }

  // Remove specific data
  removeData(key: string): void {
    this.testData.delete(key);
  }
}

// Export a singleton instance for shared data across tests
export const sharedWorld = new SharedWorld();
