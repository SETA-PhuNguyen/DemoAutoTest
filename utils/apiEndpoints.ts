/**
 * API Endpoints Configuration for BookCart Application
 *
 * This file centralizes all API endpoint definitions following the same pattern as
 * the architecture document. It provides:
 * - Type-safe endpoint references via enum
 * - Path parameter resolution utilities
 * - Common headers, status codes, and timeouts
 * - Environment-aware configuration
 */

/**
 * ApiEndpoints - Centralized enum of all BookCart API endpoints
 * Use these constants instead of hardcoded strings throughout the codebase
 */
export enum ApiEndpoints {
  // Authentication
  LOGIN = "/Login",

  // User Management
  USER_REGISTER = "/User",
  USER_DETAILS = "/User/{userId}",
  USER_UPDATE = "/User/{userId}",
  USER_DELETE = "/User/{userId}",
  USER_VALIDATE_USERNAME = "/User/validateUserName/{username}",

  // Books
  BOOK_LIST = "/Book",
  BOOK_DETAILS = "/Book/{bookId}",
  BOOK_SIMILAR = "/Book/GetSimilarBooks/{bookId}",
  BOOK_CATEGORIES = "/Book/GetCategoriesList",

  // Shopping Cart
  CART_GET = "/ShoppingCart/{userId}",
  CART_ADD = "/ShoppingCart/AddToCart/{userId}/{bookId}",
  CART_UPDATE = "/ShoppingCart/{cartId}",
  CART_CLEAR = "/ShoppingCart/ClearCart/{userId}",
  CART_REDUCE = "/ShoppingCart/ReduceCartItem/{cartId}",

  // Wishlist
  WISHLIST_GET = "/Wishlist/{userId}",
  WISHLIST_TOGGLE = "/Wishlist/ToggleWishlist/{userId}/{bookId}",
  WISHLIST_CLEAR = "/Wishlist/ClearWishlist/{userId}",

  // Checkout & Orders
  CHECKOUT = "/Checkout",
  ORDERS_GET = "/Order/{userId}",
  ORDER_DETAILS = "/Order/OrderDetails/{orderId}",
}

/**
 * ApiEndpointResolver - Utility class for resolving endpoints with path parameters
 * Provides methods for dynamic endpoint construction and environment handling
 */
export class ApiEndpointResolver {
  /**
   * Replace path parameters in an endpoint with actual values
   * Example: "/Book/{bookId}" with {bookId: "123"} => "/Book/123"
   *
   * @param endpoint - The endpoint template with placeholders
   * @param params - Object containing parameter values
   * @returns Resolved endpoint with parameters replaced
   */
  static replacePathParams(
    endpoint: string,
    params: Record<string, string | number>,
  ): string {
    let resolved = endpoint;

    for (const [key, value] of Object.entries(params)) {
      resolved = resolved.replace(`{${key}}`, String(value));
    }

    return resolved;
  }

  /**
   * Get the base API URL from environment variables
   * Falls back to localhost if not configured
   *
   * @returns Base API URL
   */
  static getBaseUrl(): string {
    return process.env.API_BASE_URL || "https://localhost:53424/api";
  }

  /**
   * Construct full URL by combining base URL with endpoint
   *
   * @param endpoint - API endpoint path
   * @param params - Optional path parameters
   * @returns Complete URL
   */
  static getFullUrl(
    endpoint: string,
    params?: Record<string, string | number>,
  ): string {
    const baseUrl = this.getBaseUrl();
    const resolvedEndpoint = params
      ? this.replacePathParams(endpoint, params)
      : endpoint;

    return `${baseUrl}${resolvedEndpoint}`;
  }

  /**
   * Get environment configuration
   *
   * @returns Environment configuration object
   */
  static getEnvironmentConfig(): {
    baseUrl: string;
    environment: string;
    isLocalhost: boolean;
  } {
    const baseUrl = this.getBaseUrl();
    const environment = process.env.TEST_ENV || "local";
    const isLocalhost = baseUrl.includes("localhost");

    return {
      baseUrl,
      environment,
      isLocalhost,
    };
  }
}

/**
 * Common API Headers
 * Use these constants for consistent header naming
 */
export const ApiHeaders = {
  CONTENT_TYPE: "Content-Type",
  CONTENT_TYPE_JSON: "application/json",
  AUTHORIZATION: "Authorization",
  ACCEPT: "Accept",
} as const;

/**
 * API Timeouts (in milliseconds)
 * Use these for consistent timeout handling
 */
export const ApiTimeouts = {
  DEFAULT: 30000, // 30 seconds - Normal API requests
  SHORT: 10000, // 10 seconds - Quick operations
  LONG: 60000, // 60 seconds - Long operations (exports, bulk operations)
} as const;

/**
 * HTTP Status Codes
 * Use these constants instead of magic numbers
 */
export const ApiStatusCodes = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Base URL Resolver
 * Resolves base URLs from environment variables
 */
export class BaseUrlResolver {
  static resolve(configKey: string): string {
    return process.env[configKey] || "";
  }
}

/**
 * Example Usage:
 *
 * // 1. Simple endpoint without parameters
 * const endpoint = ApiEndpoints.BOOK_LIST;
 * const url = ApiEndpointResolver.getFullUrl(endpoint);
 * // Result: "https://localhost:53424/api/Book"
 *
 * // 2. Endpoint with path parameters
 * const endpoint = ApiEndpoints.BOOK_DETAILS;
 * const url = ApiEndpointResolver.getFullUrl(endpoint, { bookId: "123" });
 * // Result: "https://localhost:53424/api/Book/123"
 *
 * // 3. Multiple path parameters
 * const endpoint = ApiEndpoints.CART_ADD;
 * const url = ApiEndpointResolver.getFullUrl(endpoint, {
 *   userId: "user-001",
 *   bookId: "book-123"
 * });
 * // Result: "https://localhost:53424/api/ShoppingCart/AddToCart/user-001/book-123"
 *
 * // 4. Using headers
 * const headers = {
 *   [ApiHeaders.CONTENT_TYPE]: ApiHeaders.CONTENT_TYPE_JSON,
 *   [ApiHeaders.AUTHORIZATION]: `Bearer ${token}`,
 * };
 *
 * // 5. Using status codes
 * if (response.status === ApiStatusCodes.OK) {
 *   // Success
 * }
 */
