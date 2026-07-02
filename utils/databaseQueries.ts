/**
 * Database Query Templates and Resolver
 *
 * This module provides:
 * - Query templates with placeholders
 * - Query resolver to inject parameters
 * - API to Database mapping
 */

// ============================================================================
// Query Types
// ============================================================================

export enum QueryType {
  MYSQL = "MYSQL",
  BIGQUERY = "BIGQUERY",
  CLICKHOUSE = "CLICKHOUSE",
  MSSQL = "MSSQL",
}

// ============================================================================
// Query Name Enum
// ============================================================================

export enum QueryName {
  // Cart queries
  GET_CART_ITEMS = "GET_CART_ITEMS",
  GET_CART_TOTAL = "GET_CART_TOTAL",
  GET_CART_COUNT = "GET_CART_COUNT",

  // Book queries
  GET_BOOKS_BY_CATEGORY = "GET_BOOKS_BY_CATEGORY",
  GET_BOOK_DETAILS = "GET_BOOK_DETAILS",
  GET_ALL_BOOKS = "GET_ALL_BOOKS",

  // User queries
  GET_USER_INFO = "GET_USER_INFO",
  GET_USER_ORDERS = "GET_USER_ORDERS",

  // Order queries
  GET_ORDER_DETAILS = "GET_ORDER_DETAILS",
  GET_ORDER_ITEMS = "GET_ORDER_ITEMS",

  // Analytics queries (examples for complex validation)
  EVENT_TYPES_BY_CATEGORY_MYSQL = "EVENT_TYPES_BY_CATEGORY_MYSQL",
  EVENT_TYPES_BY_CATEGORY_BIGQUERY = "EVENT_TYPES_BY_CATEGORY_BIGQUERY",
  SALES_BY_CATEGORY = "SALES_BY_CATEGORY",
}

// ============================================================================
// Query Templates
// ============================================================================

export const QUERY_TEMPLATES: Record<QueryName, string> = {
  // Cart queries
  [QueryName.GET_CART_ITEMS]: `
    SELECT sc.*, b.Title, b.Author, b.Price, b.Category
    FROM ShoppingCart sc
    JOIN Book b ON sc.BookId = b.BookId
    WHERE sc.UserId = {userId}
    ORDER BY sc.CartId
  `,

  [QueryName.GET_CART_TOTAL]: `
    SELECT 
      SUM(ci.Quantity * b.Price) as Total,
      SUM(ci.Quantity) as TotalItems,
      COUNT(DISTINCT ci.ProductId) as UniqueBooks
    FROM Cart c
    JOIN CartItems ci ON c.CartId = ci.CartId
    JOIN Book b ON ci.ProductId = b.BookId
    WHERE c.UserId = {userId}
  `,

  [QueryName.GET_CART_COUNT]: `
    SELECT COUNT(*) as ItemCount
    FROM Cart c
    JOIN CartItems ci ON c.CartId = ci.CartId
    WHERE c.UserId = {userId}
  `,

  // Book queries
  [QueryName.GET_BOOKS_BY_CATEGORY]: `
    SELECT BookId, Title, Author, Price, Category
    FROM Book
    WHERE Category = '{category}'
    ORDER BY Title
  `,

  [QueryName.GET_BOOK_DETAILS]: `
    SELECT *
    FROM Book
    WHERE BookId = {bookId}
  `,

  [QueryName.GET_ALL_BOOKS]: `
    SELECT BookId, Title, Author, Price, Category
    FROM Book
    ORDER BY BookId
  `,

  // User queries
  [QueryName.GET_USER_INFO]: `
    SELECT UserID as UserId, Username, FirstName, LastName
    FROM UserMaster
    WHERE Username = '{username}'
  `,

  [QueryName.GET_USER_ORDERS]: `
    SELECT o.*, COUNT(od.OrderDetailsId) as ItemCount
    FROM CustomerOrders o
    LEFT JOIN CustomerOrderDetails od ON o.OrderId = od.OrderId
    WHERE o.UserID = {userId}
    GROUP BY o.OrderId, o.UserID, o.DateCreated, o.CartTotal
    ORDER BY o.DateCreated DESC
  `,

  // Order queries
  [QueryName.GET_ORDER_DETAILS]: `
    SELECT *
    FROM CustomerOrders
    WHERE OrderId = '{orderId}'
  `,

  [QueryName.GET_ORDER_ITEMS]: `
    SELECT od.*, b.Title, b.Author, b.Price
    FROM CustomerOrderDetails od
    JOIN Book b ON od.ProductId = b.BookID
    WHERE od.OrderId = '{orderId}'
  `,

  // Analytics queries (MySQL example)
  [QueryName.EVENT_TYPES_BY_CATEGORY_MYSQL]: `
    SELECT 
      category,
      event_type,
      COUNT(*) as total_events,
      COUNT(DISTINCT device_id) as unique_devices
    FROM events
    WHERE account_id = {accountId}
      AND event_time BETWEEN '{startTime}' AND '{endTime}'
    GROUP BY category, event_type
    ORDER BY category, event_type
  `,

  // Analytics queries (BigQuery example)
  [QueryName.EVENT_TYPES_BY_CATEGORY_BIGQUERY]: `
    SELECT 
      category,
      event_type,
      COUNT(*) as total_events,
      COUNT(DISTINCT device_id) as unique_devices
    FROM \`project.dataset.events\`
    WHERE account_id = @accountId
      AND event_time BETWEEN TIMESTAMP(@startTime) AND TIMESTAMP(@endTime)
    GROUP BY category, event_type
    ORDER BY category, event_type
  `,

  [QueryName.SALES_BY_CATEGORY]: `
    SELECT 
      b.Category,
      COUNT(DISTINCT o.OrderId) as TotalOrders,
      SUM(od.Quantity) as TotalQuantity,
      SUM(od.Quantity * od.Price) as TotalRevenue
    FROM CustomerOrderDetails od
    JOIN Book b ON od.ProductId = b.BookID
    JOIN CustomerOrders o ON od.OrderId = o.OrderId
    WHERE o.DateCreated BETWEEN '{startDate}' AND '{endDate}'
    GROUP BY b.Category
    ORDER BY TotalRevenue DESC
  `,
};

// ============================================================================
// API to Database Mapping
// ============================================================================

export interface QueryMapping {
  queryName: QueryName;
  queryType: QueryType;
  description: string;
}

export const API_DATABASE_MAPPING: Record<string, QueryMapping> = {
  "cart.getItems": {
    queryName: QueryName.GET_CART_ITEMS,
    queryType: QueryType.MSSQL,
    description: "Get all items in user cart",
  },
  "cart.getTotal": {
    queryName: QueryName.GET_CART_TOTAL,
    queryType: QueryType.MSSQL,
    description: "Get cart total and statistics",
  },
  "cart.getCount": {
    queryName: QueryName.GET_CART_COUNT,
    queryType: QueryType.MSSQL,
    description: "Get cart item count",
  },
  "books.getByCategory": {
    queryName: QueryName.GET_BOOKS_BY_CATEGORY,
    queryType: QueryType.MSSQL,
    description: "Get books by category",
  },
  "books.getDetails": {
    queryName: QueryName.GET_BOOK_DETAILS,
    queryType: QueryType.MSSQL,
    description: "Get book details by ID",
  },
  "analytics.eventsByCategory.mysql": {
    queryName: QueryName.EVENT_TYPES_BY_CATEGORY_MYSQL,
    queryType: QueryType.MYSQL,
    description: "Get event types grouped by category (MySQL)",
  },
  "analytics.eventsByCategory.bigquery": {
    queryName: QueryName.EVENT_TYPES_BY_CATEGORY_BIGQUERY,
    queryType: QueryType.BIGQUERY,
    description: "Get event types grouped by category (BigQuery)",
  },
  "sales.byCategory": {
    queryName: QueryName.SALES_BY_CATEGORY,
    queryType: QueryType.MSSQL,
    description: "Get sales statistics by book category",
  },
};

// ============================================================================
// Query Resolver
// ============================================================================

export class QueryResolver {
  /**
   * Resolve query template with parameters
   * Replaces {param} placeholders with actual values
   *
   * @param queryName - Name of the query from QueryName enum
   * @param params - Object containing parameter values
   * @returns Resolved query string
   */
  static resolve(queryName: QueryName, params: Record<string, any>): string {
    let query = QUERY_TEMPLATES[queryName];

    if (!query) {
      throw new Error(`Query template not found for: ${queryName}`);
    }

    // Log original query for debugging
    console.log(`\n📝 Resolving query: ${queryName}`);
    console.log("Parameters:", JSON.stringify(params, null, 2));

    // Replace all placeholders
    Object.keys(params).forEach((key) => {
      const placeholder = `{${key}}`;
      const value = params[key];

      // Handle different value types
      if (value === null || value === undefined) {
        throw new Error(`Parameter '${key}' is null or undefined`);
      }

      // Replace all occurrences
      query = query.split(placeholder).join(value);
    });

    // Check for unresolved placeholders
    const unresolvedPlaceholders = query.match(/\{[^}]+\}/g);
    if (unresolvedPlaceholders) {
      throw new Error(
        `Unresolved placeholders in query: ${unresolvedPlaceholders.join(", ")}`,
      );
    }

    console.log("✅ Resolved query:", query.trim());

    return query.trim();
  }

  /**
   * Get query mapping by API key
   *
   * @param apiKey - API key from API_DATABASE_MAPPING
   * @returns Query mapping object
   */
  static getMapping(apiKey: string): QueryMapping {
    const mapping = API_DATABASE_MAPPING[apiKey];

    if (!mapping) {
      throw new Error(`Query mapping not found for API key: ${apiKey}`);
    }

    return mapping;
  }

  /**
   * Validate required parameters for a query
   *
   * @param queryName - Name of the query
   * @param params - Provided parameters
   */
  static validateParams(
    queryName: QueryName,
    params: Record<string, any>,
  ): void {
    const query = QUERY_TEMPLATES[queryName];
    const placeholders = query.match(/\{([^}]+)\}/g);

    if (!placeholders) {
      return; // No parameters required
    }

    const requiredParams = placeholders.map((p) => p.slice(1, -1)); // Remove { }
    const missingParams = requiredParams.filter((param) => !(param in params));

    if (missingParams.length > 0) {
      throw new Error(
        `Missing required parameters for ${queryName}: ${missingParams.join(", ")}`,
      );
    }
  }
}
