/**
 * Placeholder Resolver Utility
 *
 * Resolves placeholders like <account>, <startTime>, <endTime>
 * from test data and stored values
 *
 * Usage:
 *   resolvePlaceholders("<account>", testData, storedValues)
 *   // Returns: "12345"
 */

// ============================================================================
// Placeholder Resolution
// ============================================================================

export class PlaceholderResolver {
  /**
   * Resolve a single placeholder value
   *
   * @param value - Value that may contain placeholders like <key>
   * @param testData - Test data loaded from feature file
   * @param storedValues - Runtime stored values
   * @returns Resolved value
   */
  static resolve(
    value: string,
    testData: any = {},
    storedValues: any = {},
  ): string {
    if (!value || typeof value !== "string") {
      return value;
    }

    // Check if value contains placeholder pattern <...>
    const placeholderPattern = /<([^>]+)>/g;
    let resolvedValue = value;

    const matches = value.matchAll(placeholderPattern);
    for (const match of matches) {
      const fullMatch = match[0]; // <key>
      const key = match[1]; // key

      // Try to resolve from storedValues first (runtime values)
      if (storedValues && key in storedValues) {
        resolvedValue = resolvedValue.replace(fullMatch, storedValues[key]);
        continue;
      }

      // Try to resolve from testData (scenario/common data)
      if (testData && key in testData) {
        resolvedValue = resolvedValue.replace(fullMatch, testData[key]);
        continue;
      }

      // Try nested path in testData (e.g., user.id)
      const nestedValue = this.getNestedValue(testData, key);
      if (nestedValue !== undefined) {
        resolvedValue = resolvedValue.replace(fullMatch, nestedValue);
        continue;
      }

      // If not found, throw error
      throw new Error(
        `Cannot resolve placeholder: ${fullMatch}. ` +
          `Not found in testData or storedValues. ` +
          `Available in testData: ${Object.keys(testData).join(", ")}. ` +
          `Available in storedValues: ${Object.keys(storedValues).join(", ")}`,
      );
    }

    return resolvedValue;
  }

  /**
   * Resolve all placeholders in an object
   *
   * @param obj - Object with values that may contain placeholders
   * @param testData - Test data
   * @param storedValues - Stored values
   * @returns Object with all placeholders resolved
   */
  static resolveObject(
    obj: Record<string, any>,
    testData: any = {},
    storedValues: any = {},
  ): Record<string, any> {
    const resolved: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "string") {
        resolved[key] = this.resolve(value, testData, storedValues);
      } else if (typeof value === "object" && value !== null) {
        resolved[key] = this.resolveObject(value, testData, storedValues);
      } else {
        resolved[key] = value;
      }
    }

    return resolved;
  }

  /**
   * Get nested value from object using dot notation
   *
   * @param obj - Object to search
   * @param path - Dot-separated path (e.g., "user.id")
   * @returns Value at path or undefined
   */
  private static getNestedValue(obj: any, path: string): any {
    if (!obj) return undefined;

    const keys = path.split(".");
    let current = obj;

    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
    }

    return current;
  }

  /**
   * Resolve DataTable rows (Cucumber table)
   *
   * @param rows - DataTable rows with hashes
   * @param testData - Test data
   * @param storedValues - Stored values
   * @returns Resolved rows
   */
  static resolveDataTable(
    rows: Array<Record<string, string>>,
    testData: any = {},
    storedValues: any = {},
  ): Array<Record<string, string>> {
    return rows.map((row) => this.resolveObject(row, testData, storedValues));
  }
}

// ============================================================================
// Helper Functions for Common Placeholders
// ============================================================================

/**
 * Generate current timestamp in ISO format
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Generate timestamp N days ago
 */
export function getTimestampDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

/**
 * Generate timestamp N hours ago
 */
export function getTimestampHoursAgo(hours: number): string {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date.toISOString();
}

/**
 * Format timestamp for SQL
 */
export function formatTimestampForSQL(timestamp: string): string {
  return new Date(timestamp).toISOString().slice(0, 19).replace("T", " ");
}

/**
 * Quick resolve helper function
 */
export function resolvePlaceholders(
  value: string,
  testData: any,
  storedValues: any,
): string {
  return PlaceholderResolver.resolve(value, testData, storedValues);
}
