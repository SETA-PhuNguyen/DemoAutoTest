import * as sql from "mssql";

/**
 * Database configuration interface
 */
interface DbConfig {
  user: string;
  password: string;
  server: string;
  database: string;
  options: {
    encrypt: boolean;
    trustServerCertificate: boolean;
  };
}

/**
 * Database helper class for BookCart database operations
 */
export class DatabaseHelper {
  private config: DbConfig;
  private pool: sql.ConnectionPool | null = null;

  constructor() {
    this.config = {
      user: process.env.DB_USER || "sa",
      password: process.env.DB_PASSWORD || "YourPassword123",
      server: process.env.DB_SERVER || "localhost",
      database: process.env.DB_NAME || "BookCart",
      options: {
        encrypt: true,
        trustServerCertificate: true,
      },
    };
  }

  /**
   * Connect to the database
   */
  async connect(): Promise<void> {
    try {
      if (!this.pool) {
        this.pool = await sql.connect(this.config);
        console.log("Database connected successfully");
      }
    } catch (error) {
      console.error("Database connection failed:", error);
      throw error;
    }
  }

  /**
   * Disconnect from the database
   */
  async disconnect(): Promise<void> {
    try {
      if (this.pool) {
        await this.pool.close();
        this.pool = null;
        console.log("Database disconnected successfully");
      }
    } catch (error) {
      console.error("Database disconnection failed:", error);
      throw error;
    }
  }

  /**
   * Get book by ID
   */
  async getBookById(bookId: number): Promise<any> {
    await this.connect();
    try {
      const result = await this.pool!.request()
        .input("bookId", sql.Int, bookId)
        .query("SELECT * FROM Book WHERE BookId = @bookId");

      return result.recordset[0];
    } catch (error) {
      console.error("Error fetching book:", error);
      throw error;
    }
  }

  /**
   * Get all books
   */
  async getAllBooks(): Promise<any[]> {
    await this.connect();
    try {
      const result = await this.pool!.request().query(
        "SELECT * FROM Book ORDER BY BookId",
      );

      return result.recordset;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  }

  /**
   * Get books by category
   */
  async getBooksByCategory(categoryId: number): Promise<any[]> {
    await this.connect();
    try {
      const result = await this.pool!.request()
        .input("categoryId", sql.Int, categoryId)
        .query("SELECT * FROM Book WHERE CategoryId = @categoryId");

      return result.recordset;
    } catch (error) {
      console.error("Error fetching books by category:", error);
      throw error;
    }
  }

  /**
   * Get user by username
   */
  async getUserByUsername(username: string): Promise<any> {
    await this.connect();
    try {
      const result = await this.pool!.request()
        .input("username", sql.VarChar, username)
        .query("SELECT * FROM [User] WHERE Username = @username");

      return result.recordset[0];
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  /**
   * Get shopping cart for user
   */
  async getShoppingCart(userId: number): Promise<any[]> {
    await this.connect();
    try {
      const result = await this.pool!.request().input("userId", sql.Int, userId)
        .query(`
          SELECT sc.*, b.Title, b.Author, b.Price
          FROM ShoppingCart sc
          JOIN Book b ON sc.BookId = b.BookId
          WHERE sc.UserId = @userId
        `);

      return result.recordset;
    } catch (error) {
      console.error("Error fetching shopping cart:", error);
      throw error;
    }
  }

  /**
   * Get order by user ID
   */
  async getOrdersByUserId(userId: number): Promise<any[]> {
    await this.connect();
    try {
      const result = await this.pool!.request().input("userId", sql.Int, userId)
        .query(`
          SELECT o.*, od.*, b.Title, b.Author, b.Price
          FROM [Order] o
          JOIN OrderDetails od ON o.OrderId = od.OrderId
          JOIN Book b ON od.BookId = b.BookId
          WHERE o.UserId = @userId
          ORDER BY o.OrderId DESC
        `);

      return result.recordset;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  /**
   * Insert test book (for test data setup)
   */
  async insertTestBook(bookData: {
    title: string;
    author: string;
    category: number;
    price: number;
    coverFileName?: string;
  }): Promise<number> {
    await this.connect();
    try {
      const result = await this.pool!.request()
        .input("title", sql.VarChar, bookData.title)
        .input("author", sql.VarChar, bookData.author)
        .input("category", sql.Int, bookData.category)
        .input("price", sql.Decimal(10, 2), bookData.price)
        .input(
          "coverFileName",
          sql.VarChar,
          bookData.coverFileName || "default.jpg",
        ).query(`
          INSERT INTO Book (Title, Author, CategoryId, Price, CoverFileName)
          VALUES (@title, @author, @category, @price, @coverFileName);
          SELECT SCOPE_IDENTITY() AS BookId;
        `);

      return result.recordset[0].BookId;
    } catch (error) {
      console.error("Error inserting test book:", error);
      throw error;
    }
  }

  /**
   * Delete test book
   */
  async deleteTestBook(bookId: number): Promise<void> {
    await this.connect();
    try {
      await this.pool!.request()
        .input("bookId", sql.Int, bookId)
        .query("DELETE FROM Book WHERE BookId = @bookId");
    } catch (error) {
      console.error("Error deleting test book:", error);
      throw error;
    }
  }

  /**
   * Create test user (for test data setup)
   */
  async createTestUser(userData: {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    gender: string;
  }): Promise<number> {
    await this.connect();
    try {
      const result = await this.pool!.request()
        .input("username", sql.VarChar, userData.username)
        .input("password", sql.VarChar, userData.password)
        .input("firstName", sql.VarChar, userData.firstName)
        .input("lastName", sql.VarChar, userData.lastName)
        .input("gender", sql.VarChar, userData.gender).query(`
          INSERT INTO [User] (Username, Password, FirstName, LastName, Gender, UserTypeId)
          VALUES (@username, @password, @firstName, @lastName, @gender, 1);
          SELECT SCOPE_IDENTITY() AS UserId;
        `);

      return result.recordset[0].UserId;
    } catch (error) {
      console.error("Error creating test user:", error);
      throw error;
    }
  }

  /**
   * Delete test user
   */
  async deleteTestUser(userId: number): Promise<void> {
    await this.connect();
    try {
      // Delete related records first
      await this.pool!.request().input("userId", sql.Int, userId).query(`
          DELETE FROM ShoppingCart WHERE UserId = @userId;
          DELETE FROM [Order] WHERE UserId = @userId;
          DELETE FROM Wishlist WHERE UserId = @userId;
          DELETE FROM [User] WHERE UserId = @userId;
        `);
    } catch (error) {
      console.error("Error deleting test user:", error);
      throw error;
    }
  }

  /**
   * Clear shopping cart for user
   */
  async clearShoppingCart(userId: number): Promise<void> {
    await this.connect();
    try {
      await this.pool!.request()
        .input("userId", sql.Int, userId)
        .query("DELETE FROM ShoppingCart WHERE UserId = @userId");
    } catch (error) {
      console.error("Error clearing shopping cart:", error);
      throw error;
    }
  }

  /**
   * Execute custom query
   */
  async executeQuery(query: string, params: any = {}): Promise<any> {
    await this.connect();
    try {
      const request = this.pool!.request();

      // Add parameters
      Object.keys(params).forEach((key) => {
        request.input(key, params[key]);
      });

      const result = await request.query(query);
      return result.recordset;
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  }

  /**
   * Verify data consistency between API and database
   */
  async verifyBookData(bookId: number, apiData: any): Promise<boolean> {
    const dbData = await this.getBookById(bookId);

    if (!dbData) {
      return false;
    }

    return (
      dbData.BookId === apiData.bookId &&
      dbData.Title === apiData.title &&
      dbData.Author === apiData.author &&
      parseFloat(dbData.Price) === parseFloat(apiData.price)
    );
  }

  /**
   * Setup complex test data
   */
  async setupComplexTestData(): Promise<{
    userId: number;
    bookIds: number[];
    categoryId: number;
  }> {
    await this.connect();

    try {
      // Create a test user
      const userId = await this.createTestUser({
        username: `testuser_${Date.now()}`,
        password: "Test@123",
        firstName: "Test",
        lastName: "User",
        gender: "Male",
      });

      // Create multiple test books
      const book1Id = await this.insertTestBook({
        title: "Test Book 1",
        author: "Test Author 1",
        category: 1,
        price: 19.99,
      });

      const book2Id = await this.insertTestBook({
        title: "Test Book 2",
        author: "Test Author 2",
        category: 1,
        price: 29.99,
      });

      const book3Id = await this.insertTestBook({
        title: "Test Book 3",
        author: "Test Author 3",
        category: 2,
        price: 15.99,
      });

      // Add books to shopping cart
      await this.pool!.request()
        .input("userId", sql.Int, userId)
        .input("bookId", sql.Int, book1Id)
        .input("quantity", sql.Int, 2)
        .query(
          "INSERT INTO ShoppingCart (UserId, BookId, Quantity) VALUES (@userId, @bookId, @quantity)",
        );

      return {
        userId,
        bookIds: [book1Id, book2Id, book3Id],
        categoryId: 1,
      };
    } catch (error) {
      console.error("Error setting up complex test data:", error);
      throw error;
    }
  }

  /**
   * Cleanup complex test data
   */
  async cleanupComplexTestData(
    userId: number,
    bookIds: number[],
  ): Promise<void> {
    try {
      // Delete test user (which will cascade delete related records)
      await this.deleteTestUser(userId);

      // Delete test books
      for (const bookId of bookIds) {
        await this.deleteTestBook(bookId);
      }
    } catch (error) {
      console.error("Error cleaning up test data:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const dbHelper = new DatabaseHelper();
