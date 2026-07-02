/**
 * Database Validation Step Definitions
 *
 * Steps for executing database queries and validating UI vs DB data
 *
 * Features:
 * 1. Execute queries with parameter resolution
 * 2. Store DB results
 * 3. Fetch UI data
 * 4. Validate UI vs DB with tolerance
 * 5. Detailed diff reporting
 */

import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/world";
import { PlaceholderResolver } from "../../utils/placeholderResolver";
import {
  QueryResolver,
  API_DATABASE_MAPPING,
  QueryName,
  QueryType,
} from "../../utils/databaseQueries";
import { DatabaseQueryExecutor } from "../../utils/databaseConnections";

// ============================================================================
// Step 2: Execute Query with Parameter Resolution
// ============================================================================

/**
 * Execute database query by name and type
 * Resolves placeholders from testData/storedValues
 *
 * Example:
 *   When I execute query "cart.getTotal" with type "MSSQL" and parameters:
 *     | parameter  | value     |
 *     | userId     | <userId>  |
 */
When(
  "I execute query {string} with type {string} and parameters:",
  async function (
    this: CustomWorld,
    queryKey: string,
    queryType: string,
    dataTable: any,
  ) {
    console.log(`\n🔍 Executing query: ${queryKey}`);

    // 1. Get query mapping
    const mapping = QueryResolver.getMapping(queryKey);
    console.log(`   Query name: ${mapping.queryName}`);
    console.log(`   Query type: ${mapping.queryType}`);
    console.log(`   Description: ${mapping.description}`);

    // 2. Parse parameters from DataTable
    const rawParams: Record<string, string> = {};
    const rows = dataTable.hashes();

    for (const row of rows) {
      rawParams[row.parameter] = row.value;
    }

    console.log("   Raw parameters:", JSON.stringify(rawParams, null, 2));

    // 3. Resolve placeholders
    const resolvedParams = PlaceholderResolver.resolveObject(
      rawParams,
      this.testData,
      this.storedValues,
    );

    console.log(
      "   Resolved parameters:",
      JSON.stringify(resolvedParams, null, 2),
    );

    // 4. Get resolved query
    const query = QueryResolver.resolve(mapping.queryName, resolvedParams);

    // 5. Execute query
    const results = await DatabaseQueryExecutor.executeQuery(
      mapping.queryType,
      query,
    );

    // 6. Store results in storedValues
    this.storedValues.lastDbQuery = {
      queryKey,
      queryName: mapping.queryName,
      queryType: mapping.queryType,
      parameters: resolvedParams,
      results,
      rowCount: results.length,
      executedAt: new Date().toISOString(),
    };

    console.log(
      `✅ Query executed successfully, ${results.length} rows returned`,
    );
  },
);

/**
 * Simplified execute query (uses query type from mapping)
 *
 * Example:
 *   When I execute database query "cart.getTotal" with parameters:
 *     | parameter  | value     |
 *     | userId     | <userId>  |
 */
When(
  "I execute database query {string} with parameters:",
  async function (this: CustomWorld, queryKey: string, dataTable: any) {
    console.log(`\n🔍 Executing query: ${queryKey}`);

    // 1. Get query mapping
    const mapping = QueryResolver.getMapping(queryKey);
    console.log(`   Query name: ${mapping.queryName}`);
    console.log(`   Query type: ${mapping.queryType}`);
    console.log(`   Description: ${mapping.description}`);

    // 2. Parse parameters from DataTable
    const rawParams: Record<string, string> = {};
    const rows = dataTable.hashes();

    for (const row of rows) {
      rawParams[row.parameter] = row.value;
    }

    console.log("   Raw parameters:", JSON.stringify(rawParams, null, 2));

    // 3. Resolve placeholders
    const resolvedParams = PlaceholderResolver.resolveObject(
      rawParams,
      this.testData,
      this.storedValues,
    );

    console.log(
      "   Resolved parameters:",
      JSON.stringify(resolvedParams, null, 2),
    );

    // 4. Get resolved query
    const query = QueryResolver.resolve(mapping.queryName, resolvedParams);

    // 5. Execute query
    const results = await DatabaseQueryExecutor.executeQuery(
      mapping.queryType,
      query,
    );

    // 6. Store results in storedValues
    this.storedValues.lastDbQuery = {
      queryKey,
      queryName: mapping.queryName,
      queryType: mapping.queryType,
      parameters: resolvedParams,
      results,
      rowCount: results.length,
      executedAt: new Date().toISOString(),
    };

    console.log(
      `✅ Query executed successfully, ${results.length} rows returned`,
    );
  },
);

// ============================================================================
// Step 5: Store DB Results to Named Key
// ============================================================================

/**
 * Store last DB query results to a named key in storedValues
 *
 * Example:
 *   And I store the database results as "cartTotalFromDB"
 */
Then(
  "I store the database results as {string}",
  function (this: CustomWorld, key: string) {
    if (!this.storedValues.lastDbQuery) {
      throw new Error("No database query results to store");
    }

    this.storedValues[key] = this.storedValues.lastDbQuery.results;

    console.log(
      `✅ Stored ${this.storedValues.lastDbQuery.rowCount} rows as: ${key}`,
    );
  },
);

// ============================================================================
// Step 6: Fetch UI Data and Store
// ============================================================================

/**
 * Generic step to capture UI data
 * Implementation depends on specific page objects
 *
 * Example:
 *   When I capture the cart total from UI
 *   And I store it as "cartTotalFromUI"
 */
When("I capture the cart total from UI", async function (this: CustomWorld) {
  // Get cart total from page
  const totalElement = this.page
    .locator('[class*="total"], .total-price, [class*="grand-total"]')
    .last();
  const totalText = await totalElement.textContent();

  // Extract numeric value
  const total = parseFloat(totalText?.replace(/[^0-9.]/g, "") || "0");

  this.storedValues.uiCartTotal = total;

  console.log(`✅ Captured cart total from UI: ${total}`);
});

/**
 * Store captured value
 */
Then("I store it as {string}", function (this: CustomWorld, key: string) {
  // Get the last captured value
  const lastValue = this.storedValues.uiCartTotal || this.savedValue;

  if (!lastValue) {
    throw new Error("No value to store. Capture a value first.");
  }

  this.storedValues[key] = lastValue;

  console.log(`✅ Stored value as: ${key} = ${lastValue}`);
});

// ============================================================================
// Step 7: Validate UI vs DB with Tolerance
// ============================================================================

/**
 * Validate numeric values with absolute and percentage tolerance
 *
 * Example:
 *   Then the UI value "cartTotalFromUI" should match DB value "cartTotalFromDB" within:
 *     | toleranceType | value |
 *     | absolute      | 0.01  |
 *     | percentage    | 0.05  |
 */
Then(
  "the UI value {string} should match DB value {string} within:",
  function (this: CustomWorld, uiKey: string, dbKey: string, dataTable: any) {
    const uiValue = this.storedValues[uiKey];
    const dbValue = this.storedValues[dbKey];

    if (uiValue === undefined) {
      throw new Error(`UI value not found for key: ${uiKey}`);
    }

    if (dbValue === undefined) {
      throw new Error(`DB value not found for key: ${dbKey}`);
    }

    // Parse tolerance settings
    const tolerances: Record<string, number> = {};
    const rows = dataTable.hashes();

    for (const row of rows) {
      tolerances[row.toleranceType] = parseFloat(row.value);
    }

    console.log(`\n📊 Validating: ${uiKey} vs ${dbKey}`);
    console.log(`   UI Value: ${uiValue}`);
    console.log(`   DB Value: ${dbValue}`);
    console.log(`   Tolerances:`, tolerances);

    // Convert to numbers
    const uiNum = typeof uiValue === "number" ? uiValue : parseFloat(uiValue);
    const dbNum = typeof dbValue === "number" ? dbValue : parseFloat(dbValue);

    if (isNaN(uiNum) || isNaN(dbNum)) {
      throw new Error(
        `Cannot compare non-numeric values: UI=${uiValue}, DB=${dbValue}`,
      );
    }

    // Calculate difference
    const absoluteDiff = Math.abs(uiNum - dbNum);
    const percentageDiff =
      dbNum !== 0 ? (absoluteDiff / Math.abs(dbNum)) * 100 : 0;

    console.log(`   Absolute difference: ${absoluteDiff.toFixed(4)}`);
    console.log(`   Percentage difference: ${percentageDiff.toFixed(2)}%`);

    // Check tolerances
    let passed = true;
    const failures: string[] = [];

    if (
      tolerances.absolute !== undefined &&
      absoluteDiff > tolerances.absolute
    ) {
      passed = false;
      failures.push(
        `Absolute difference ${absoluteDiff.toFixed(4)} exceeds tolerance ${tolerances.absolute}`,
      );
    }

    if (
      tolerances.percentage !== undefined &&
      percentageDiff > tolerances.percentage
    ) {
      passed = false;
      failures.push(
        `Percentage difference ${percentageDiff.toFixed(2)}% exceeds tolerance ${tolerances.percentage}%`,
      );
    }

    if (!passed) {
      const errorMsg = [
        `❌ Validation failed: ${uiKey} vs ${dbKey}`,
        `   UI Value: ${uiNum}`,
        `   DB Value: ${dbNum}`,
        `   Absolute Diff: ${absoluteDiff.toFixed(4)}`,
        `   Percentage Diff: ${percentageDiff.toFixed(2)}%`,
        `   Failures:`,
        ...failures.map((f) => `     - ${f}`),
      ].join("\n");

      throw new Error(errorMsg);
    }

    console.log(`✅ Validation passed`);
  },
);

// ============================================================================
// Step 8: Validate Complex Data with Detailed Diff
// ============================================================================

/**
 * Validate array of objects (e.g., cart items, event types by category)
 * Compares by composite key with tolerance
 *
 * Example:
 *   Then the UI data "eventTypesFromUI" should match DB data "eventTypesFromDB" by keys:
 *     | keyField    | compareField | toleranceType | toleranceValue |
 *     | category    | total_events | absolute      | 5              |
 *     | event_type  | unique_devices | percentage  | 0.1            |
 */
Then(
  "the UI data {string} should match DB data {string} by keys:",
  function (this: CustomWorld, uiKey: string, dbKey: string, dataTable: any) {
    const uiData = this.storedValues[uiKey];
    const dbData = this.storedValues[dbKey];

    if (!uiData) {
      throw new Error(`UI data not found for key: ${uiKey}`);
    }

    if (!dbData) {
      throw new Error(`DB data not found for key: ${dbKey}`);
    }

    if (!Array.isArray(uiData) || !Array.isArray(dbData)) {
      throw new Error("Both UI and DB data must be arrays");
    }

    // Parse comparison configuration
    const rows = dataTable.hashes();
    const keyFields: string[] = [];
    const compareFields: {
      field: string;
      toleranceType: string;
      toleranceValue: number;
    }[] = [];

    for (const row of rows) {
      if (row.compareField) {
        compareFields.push({
          field: row.compareField,
          toleranceType: row.toleranceType || "absolute",
          toleranceValue: parseFloat(row.toleranceValue || "0"),
        });
      }
      if (row.keyField) {
        keyFields.push(row.keyField);
      }
    }

    console.log(`\n📊 Validating complex data: ${uiKey} vs ${dbKey}`);
    console.log(`   Key fields: ${keyFields.join(", ")}`);
    console.log(`   Compare fields:`, compareFields);

    // Create maps by composite key
    const uiMap = new Map<string, any>();
    const dbMap = new Map<string, any>();

    for (const item of uiData) {
      const compositeKey = keyFields.map((k) => item[k]).join("|");
      uiMap.set(compositeKey, item);
    }

    for (const item of dbData) {
      const compositeKey = keyFields.map((k) => item[k]).join("|");
      dbMap.set(compositeKey, item);
    }

    // Compare
    const allKeys = new Set([...uiMap.keys(), ...dbMap.keys()]);
    const diffs: string[] = [];

    for (const key of allKeys) {
      const uiItem = uiMap.get(key);
      const dbItem = dbMap.get(key);

      if (!uiItem) {
        diffs.push(`❌ Key "${key}" exists in DB but not in UI`);
        diffs.push(`   DB values: ${JSON.stringify(dbItem)}`);
        continue;
      }

      if (!dbItem) {
        diffs.push(`❌ Key "${key}" exists in UI but not in DB`);
        diffs.push(`   UI values: ${JSON.stringify(uiItem)}`);
        continue;
      }

      // Compare each field
      for (const compareConfig of compareFields) {
        const field = compareConfig.field;
        const uiValue = parseFloat(uiItem[field]);
        const dbValue = parseFloat(dbItem[field]);

        if (isNaN(uiValue) || isNaN(dbValue)) {
          diffs.push(`❌ Key "${key}", field "${field}": non-numeric values`);
          diffs.push(`   UI: ${uiItem[field]}, DB: ${dbItem[field]}`);
          continue;
        }

        const absoluteDiff = Math.abs(uiValue - dbValue);
        const percentageDiff =
          dbValue !== 0 ? (absoluteDiff / Math.abs(dbValue)) * 100 : 0;

        let failed = false;
        if (
          compareConfig.toleranceType === "absolute" &&
          absoluteDiff > compareConfig.toleranceValue
        ) {
          failed = true;
        } else if (
          compareConfig.toleranceType === "percentage" &&
          percentageDiff > compareConfig.toleranceValue
        ) {
          failed = true;
        }

        if (failed) {
          diffs.push(
            `❌ Key "${key}", field "${field}": values exceed tolerance`,
          );
          diffs.push(`   UI: ${uiValue}, DB: ${dbValue}`);
          diffs.push(
            `   Absolute diff: ${absoluteDiff.toFixed(4)}, Percentage diff: ${percentageDiff.toFixed(2)}%`,
          );
          diffs.push(
            `   Tolerance: ${compareConfig.toleranceType} = ${compareConfig.toleranceValue}`,
          );
        }
      }
    }

    // Report results
    if (diffs.length > 0) {
      const errorMsg = [
        `❌ Data validation failed: ${uiKey} vs ${dbKey}`,
        `   UI items: ${uiData.length}`,
        `   DB items: ${dbData.length}`,
        `   Differences found: ${diffs.length}`,
        "",
        ...diffs,
      ].join("\n");

      throw new Error(errorMsg);
    }

    console.log(`✅ Validation passed: all ${allKeys.size} keys match`);
  },
);

// ============================================================================
// Helper Steps
// ============================================================================

/**
 * Debug step to print stored values
 */
Then(
  "I print stored value {string}",
  function (this: CustomWorld, key: string) {
    const value = this.storedValues[key];
    console.log(`\n🐛 Stored value "${key}":`);
    console.log(JSON.stringify(value, null, 2));
  },
);

/**
 * Assert DB query returned specific number of rows
 */
Then(
  "the database query should return {int} rows",
  function (this: CustomWorld, expectedCount: number) {
    if (!this.storedValues.lastDbQuery) {
      throw new Error("No database query results found");
    }

    const actualCount = this.storedValues.lastDbQuery.rowCount;

    expect(actualCount).toBe(expectedCount);

    console.log(`✅ DB query returned ${actualCount} row(s) as expected`);
  },
);

Then(
  "the database query should return at least {int} rows",
  function (this: CustomWorld, minCount: number) {
    if (!this.storedValues.lastDbQuery) {
      throw new Error("No database query results found");
    }

    const actualCount = this.storedValues.lastDbQuery.rowCount;

    expect(actualCount).toBeGreaterThanOrEqual(minCount);

    console.log(
      `✅ DB query returned ${actualCount} row(s) (expected at least: ${minCount})`,
    );
  },
);
