import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * Configuration helper class for accessing environment variables
 * Provides centralized configuration management for the test suite
 */
export class Config {
  // Application URLs
  static readonly BASE_URL = process.env.BASE_URL || "https://localhost:53424";
  static readonly API_BASE_URL =
    process.env.API_BASE_URL || "https://localhost:53424/api";

  // Database Configuration
  static readonly DB_SERVER = process.env.DB_SERVER || "localhost";
  static readonly DB_NAME = process.env.DB_NAME || "BookCart";
  static readonly DB_USER = process.env.DB_USER || "sa";
  static readonly DB_PASSWORD = process.env.DB_PASSWORD || "YourPassword123";

  // Test User Credentials
  static readonly TEST_USERNAME = process.env.TEST_USERNAME || "testuser";
  static readonly TEST_PASSWORD = process.env.TEST_PASSWORD || "Test@123";

  // Admin Credentials
  static readonly ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
  static readonly ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123";

  // Test Configuration
  static readonly HEADLESS =
    process.env.HEADLESS === "true" || process.env.HEADLESS === "1";
  static readonly SLOW_MO = parseInt(process.env.SLOW_MO || "0");
  static readonly TIMEOUT = parseInt(process.env.TIMEOUT || "30000");

  // Reporting
  static readonly ALLURE_RESULTS_DIR =
    process.env.ALLURE_RESULTS_DIR || "allure-results";
  static readonly ALLURE_REPORT_DIR =
    process.env.ALLURE_REPORT_DIR || "allure-report";

  /**
   * Get database connection configuration
   */
  static getDatabaseConfig() {
    return {
      user: this.DB_USER,
      password: this.DB_PASSWORD,
      server: this.DB_SERVER,
      database: this.DB_NAME,
      options: {
        encrypt: true,
        trustServerCertificate: true,
      },
    };
  }

  /**
   * Get test user credentials
   */
  static getTestUserCredentials() {
    return {
      username: this.TEST_USERNAME,
      password: this.TEST_PASSWORD,
    };
  }

  /**
   * Get admin credentials
   */
  static getAdminCredentials() {
    return {
      username: this.ADMIN_USERNAME,
      password: this.ADMIN_PASSWORD,
    };
  }

  /**
   * Get browser launch options
   */
  static getBrowserOptions() {
    return {
      headless: this.HEADLESS,
      slowMo: this.SLOW_MO,
    };
  }

  /**
   * Get timeout configuration
   */
  static getTimeout() {
    return this.TIMEOUT;
  }

  /**
   * Validate required environment variables
   */
  static validate(): { valid: boolean; missing: string[] } {
    const required = [
      "BASE_URL",
      "API_BASE_URL",
      "DB_SERVER",
      "DB_NAME",
      "TEST_USERNAME",
      "TEST_PASSWORD",
    ];

    const missing: string[] = [];

    required.forEach((key) => {
      if (!process.env[key]) {
        missing.push(key);
      }
    });

    return {
      valid: missing.length === 0,
      missing,
    };
  }

  /**
   * Print current configuration (useful for debugging)
   */
  static printConfig() {
    console.log("========================================");
    console.log("Test Configuration");
    console.log("========================================");
    console.log(`BASE_URL: ${this.BASE_URL}`);
    console.log(`API_BASE_URL: ${this.API_BASE_URL}`);
    console.log(`DB_SERVER: ${this.DB_SERVER}`);
    console.log(`DB_NAME: ${this.DB_NAME}`);
    console.log(`DB_USER: ${this.DB_USER}`);
    console.log(`DB_PASSWORD: ${"*".repeat(this.DB_PASSWORD.length)}`);
    console.log(`TEST_USERNAME: ${this.TEST_USERNAME}`);
    console.log(`TEST_PASSWORD: ${"*".repeat(this.TEST_PASSWORD.length)}`);
    console.log(`HEADLESS: ${this.HEADLESS}`);
    console.log(`SLOW_MO: ${this.SLOW_MO}ms`);
    console.log(`TIMEOUT: ${this.TIMEOUT}ms`);
    console.log("========================================");
  }
}

// Export for use in tests
export default Config;
