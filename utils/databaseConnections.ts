/**
 * Database Connection Utilities
 *
 * Supports multiple database types:
 * - MySQL
 * - BigQuery
 * - ClickHouse
 * - MSSQL (existing)
 *
 * Features:
 * - Connection pooling
 * - Automatic retry with exponential backoff
 * - Query logging
 * - Result count tracking
 * - Timeout handling
 */

import * as sql from "mssql";
import { QueryType } from "./databaseQueries";

// ============================================================================
// Configuration Interfaces
// ============================================================================

export interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export interface QueryOptions {
  timeout?: number;
  retry?: RetryConfig;
  logQuery?: boolean;
  logResults?: boolean;
}

// ============================================================================
// Default Configuration
// ============================================================================

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
};

const DEFAULT_QUERY_OPTIONS: QueryOptions = {
  timeout: 30000, // 30 seconds
  retry: DEFAULT_RETRY_CONFIG,
  logQuery: true,
  logResults: false,
};

// ============================================================================
// MySQL Connection Utility
// ============================================================================

export class MySQLConnectionUtil {
  private static mysql: any; // Lazy loaded
  private static connection: any = null;

  /**
   * Initialize MySQL connection
   */
  private static async initConnection(): Promise<any> {
    if (!this.mysql) {
      this.mysql = require("mysql2/promise");
    }

    if (!this.connection) {
      this.connection = await this.mysql.createConnection({
        host: process.env.MYSQL_HOST || "localhost",
        port: parseInt(process.env.MYSQL_PORT || "3306"),
        user: process.env.MYSQL_USER || "root",
        password: process.env.MYSQL_PASSWORD || "",
        database: process.env.MYSQL_DATABASE || "test",
        connectTimeout: 10000,
      });

      console.log("✅ MySQL connection established");
    }

    return this.connection;
  }

  /**
   * Execute MySQL query with retry logic
   */
  static async buildMySQLQuery(
    query: string,
    options: QueryOptions = DEFAULT_QUERY_OPTIONS,
  ): Promise<any[]> {
    const config = { ...DEFAULT_QUERY_OPTIONS, ...options };
    let lastError: any;

    for (
      let attempt = 1;
      attempt <= (config.retry?.maxRetries || 3);
      attempt++
    ) {
      try {
        if (config.logQuery) {
          console.log(`\n🔍 MySQL Query (Attempt ${attempt}):`);
          console.log(query);
        }

        const connection = await this.initConnection();
        const startTime = Date.now();

        const [rows] = await connection.query(query);

        const duration = Date.now() - startTime;
        const rowCount = Array.isArray(rows) ? rows.length : 0;

        console.log(`✅ MySQL query executed successfully`);
        console.log(`   Duration: ${duration}ms`);
        console.log(`   Rows returned: ${rowCount}`);

        if (config.logResults && rowCount > 0) {
          console.log("Sample result:", JSON.stringify(rows[0], null, 2));
        }

        return rows as any[];
      } catch (error: any) {
        lastError = error;
        console.error(
          `❌ MySQL query failed (Attempt ${attempt}):`,
          error.message,
        );

        if (attempt < (config.retry?.maxRetries || 3)) {
          const delay = Math.min(
            (config.retry?.initialDelay || 1000) *
              Math.pow(config.retry?.backoffMultiplier || 2, attempt - 1),
            config.retry?.maxDelay || 10000,
          );
          console.log(`⏳ Retrying in ${delay}ms...`);
          await this.sleep(delay);
        }
      }
    }

    throw new Error(
      `MySQL query failed after ${config.retry?.maxRetries} attempts: ${lastError.message}`,
    );
  }

  /**
   * Close MySQL connection
   */
  static async closeConnection(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
      console.log("MySQL connection closed");
    }
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// ============================================================================
// BigQuery Connection Utility
// ============================================================================

export class BigQueryUtil {
  private static bigquery: any; // Lazy loaded
  private static client: any = null;

  /**
   * Initialize BigQuery client
   */
  private static initClient(): any {
    if (!this.bigquery) {
      const { BigQuery } = require("@google-cloud/bigquery");
      this.bigquery = BigQuery;
    }

    if (!this.client) {
      this.client = new this.bigquery({
        projectId: process.env.GCP_PROJECT_ID,
        keyFilename: process.env.GCP_KEY_FILE,
      });

      console.log("✅ BigQuery client initialized");
    }

    return this.client;
  }

  /**
   * Execute BigQuery query with retry logic
   */
  static async buildBigQuery(
    query: string,
    options: QueryOptions = DEFAULT_QUERY_OPTIONS,
  ): Promise<any[]> {
    const config = { ...DEFAULT_QUERY_OPTIONS, ...options };
    let lastError: any;

    for (
      let attempt = 1;
      attempt <= (config.retry?.maxRetries || 3);
      attempt++
    ) {
      try {
        if (config.logQuery) {
          console.log(`\n🔍 BigQuery Query (Attempt ${attempt}):`);
          console.log(query);
        }

        const client = this.initClient();
        const startTime = Date.now();

        const [rows] = await client.query({
          query,
          timeout: config.timeout,
        });

        const duration = Date.now() - startTime;
        const rowCount = rows.length;

        console.log(`✅ BigQuery query executed successfully`);
        console.log(`   Duration: ${duration}ms`);
        console.log(`   Rows returned: ${rowCount}`);

        if (config.logResults && rowCount > 0) {
          console.log("Sample result:", JSON.stringify(rows[0], null, 2));
        }

        return rows;
      } catch (error: any) {
        lastError = error;
        console.error(
          `❌ BigQuery query failed (Attempt ${attempt}):`,
          error.message,
        );

        if (attempt < (config.retry?.maxRetries || 3)) {
          const delay = Math.min(
            (config.retry?.initialDelay || 1000) *
              Math.pow(config.retry?.backoffMultiplier || 2, attempt - 1),
            config.retry?.maxDelay || 10000,
          );
          console.log(`⏳ Retrying in ${delay}ms...`);
          await this.sleep(delay);
        }
      }
    }

    throw new Error(
      `BigQuery query failed after ${config.retry?.maxRetries} attempts: ${lastError.message}`,
    );
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// ============================================================================
// ClickHouse Connection Utility
// ============================================================================

export class ClickHouseUtil {
  private static clickhouse: any; // Lazy loaded
  private static client: any = null;

  /**
   * Initialize ClickHouse client
   */
  private static initClient(): any {
    if (!this.clickhouse) {
      const { ClickHouse } = require("clickhouse");
      this.clickhouse = ClickHouse;
    }

    if (!this.client) {
      this.client = new this.clickhouse({
        url: process.env.CLICKHOUSE_URL || "http://localhost",
        port: parseInt(process.env.CLICKHOUSE_PORT || "8123"),
        basicAuth: {
          username: process.env.CLICKHOUSE_USER || "default",
          password: process.env.CLICKHOUSE_PASSWORD || "",
        },
        config: {
          database: process.env.CLICKHOUSE_DATABASE || "default",
        },
      });

      console.log("✅ ClickHouse client initialized");
    }

    return this.client;
  }

  /**
   * Execute ClickHouse query with retry logic
   */
  static async buildClickHouseQuery(
    query: string,
    options: QueryOptions = DEFAULT_QUERY_OPTIONS,
  ): Promise<any[]> {
    const config = { ...DEFAULT_QUERY_OPTIONS, ...options };
    let lastError: any;

    for (
      let attempt = 1;
      attempt <= (config.retry?.maxRetries || 3);
      attempt++
    ) {
      try {
        if (config.logQuery) {
          console.log(`\n🔍 ClickHouse Query (Attempt ${attempt}):`);
          console.log(query);
        }

        const client = this.initClient();
        const startTime = Date.now();

        const rows = await client.query(query).toPromise();

        const duration = Date.now() - startTime;
        const rowCount = Array.isArray(rows) ? rows.length : 0;

        console.log(`✅ ClickHouse query executed successfully`);
        console.log(`   Duration: ${duration}ms`);
        console.log(`   Rows returned: ${rowCount}`);

        if (config.logResults && rowCount > 0) {
          console.log("Sample result:", JSON.stringify(rows[0], null, 2));
        }

        return rows;
      } catch (error: any) {
        lastError = error;
        console.error(
          `❌ ClickHouse query failed (Attempt ${attempt}):`,
          error.message,
        );

        if (attempt < (config.retry?.maxRetries || 3)) {
          const delay = Math.min(
            (config.retry?.initialDelay || 1000) *
              Math.pow(config.retry?.backoffMultiplier || 2, attempt - 1),
            config.retry?.maxDelay || 10000,
          );
          console.log(`⏳ Retrying in ${delay}ms...`);
          await this.sleep(delay);
        }
      }
    }

    throw new Error(
      `ClickHouse query failed after ${config.retry?.maxRetries} attempts: ${lastError.message}`,
    );
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// ============================================================================
// MSSQL Connection Utility (Enhanced)
// ============================================================================

export class MSSQLUtil {
  private static pool: sql.ConnectionPool | null = null;

  /**
   * Initialize MSSQL connection pool
   */
  private static async initPool(): Promise<sql.ConnectionPool> {
    if (!this.pool) {
      const config: sql.config = {
        user: process.env.DB_USER || "sa",
        password: process.env.DB_PASSWORD || "",
        server: process.env.DB_SERVER || "localhost",
        database: process.env.DB_NAME || "BookCart",
        options: {
          encrypt: true,
          trustServerCertificate: true,
          connectTimeout: 10000,
        },
      };

      this.pool = await sql.connect(config);
      console.log("✅ MSSQL connection pool established");
    }

    return this.pool;
  }

  /**
   * Execute MSSQL query with retry logic
   */
  static async buildMSSQLQuery(
    query: string,
    options: QueryOptions = DEFAULT_QUERY_OPTIONS,
  ): Promise<any[]> {
    const config = { ...DEFAULT_QUERY_OPTIONS, ...options };
    let lastError: any;

    for (
      let attempt = 1;
      attempt <= (config.retry?.maxRetries || 3);
      attempt++
    ) {
      try {
        if (config.logQuery) {
          console.log(`\n🔍 MSSQL Query (Attempt ${attempt}):`);
          console.log(query);
        }

        const pool = await this.initPool();
        const startTime = Date.now();

        const result = await pool.request().query(query);

        const duration = Date.now() - startTime;
        const rowCount = result.recordset.length;

        console.log(`✅ MSSQL query executed successfully`);
        console.log(`   Duration: ${duration}ms`);
        console.log(`   Rows returned: ${rowCount}`);

        if (config.logResults && rowCount > 0) {
          console.log(
            "Sample result:",
            JSON.stringify(result.recordset[0], null, 2),
          );
        }

        return result.recordset;
      } catch (error: any) {
        lastError = error;
        console.error(
          `❌ MSSQL query failed (Attempt ${attempt}):`,
          error.message,
        );

        if (attempt < (config.retry?.maxRetries || 3)) {
          const delay = Math.min(
            (config.retry?.initialDelay || 1000) *
              Math.pow(config.retry?.backoffMultiplier || 2, attempt - 1),
            config.retry?.maxDelay || 10000,
          );
          console.log(`⏳ Retrying in ${delay}ms...`);
          await this.sleep(delay);
        }
      }
    }

    throw new Error(
      `MSSQL query failed after ${config.retry?.maxRetries} attempts: ${lastError.message}`,
    );
  }

  /**
   * Close MSSQL connection pool
   */
  static async closePool(): Promise<void> {
    if (this.pool) {
      await this.pool.close();
      this.pool = null;
      console.log("MSSQL connection pool closed");
    }
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// ============================================================================
// Universal Query Executor
// ============================================================================

export class DatabaseQueryExecutor {
  /**
   * Execute query based on database type
   */
  static async executeQuery(
    queryType: QueryType,
    query: string,
    options?: QueryOptions,
  ): Promise<any[]> {
    console.log(`\n🗄️  Executing ${queryType} query...`);

    switch (queryType) {
      case QueryType.MYSQL:
        return await MySQLConnectionUtil.buildMySQLQuery(query, options);

      case QueryType.BIGQUERY:
        return await BigQueryUtil.buildBigQuery(query, options);

      case QueryType.CLICKHOUSE:
        return await ClickHouseUtil.buildClickHouseQuery(query, options);

      case QueryType.MSSQL:
        return await MSSQLUtil.buildMSSQLQuery(query, options);

      default:
        throw new Error(`Unsupported query type: ${queryType}`);
    }
  }

  /**
   * Close all database connections
   */
  static async closeAllConnections(): Promise<void> {
    await Promise.all([
      MySQLConnectionUtil.closeConnection(),
      MSSQLUtil.closePool(),
    ]);
  }
}
