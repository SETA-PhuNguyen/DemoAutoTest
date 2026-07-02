Feature: BookCart API Testing
  As a QA engineer
  I want to test the BookCart API endpoints
  So that I can ensure the backend functionality is working correctly

  @api @smoke @books
  Scenario: Get all books from API
    When I send a GET request to "/Book"
    Then the response status code should be 200
    And the response should contain a list of books
    And each book should have the following fields:
      | bookId      |
      | title       |
      | author      |
      | category    |
      | price       |
      | coverFileName |

  @api @books @positive
  Scenario: Get a specific book by ID
    Given I know a valid book ID "1"
    When I send a GET request to "/Book/1"
    Then the response status code should be 200
    And the response should contain book details
    And the book should have a valid title
    And the book should have a valid price greater than 0

  @api @books @negative
  Scenario: Get a book with invalid ID
    When I send a GET request to "/Book/99999"
    Then the response status code should be 404
    And the response should contain an error message

  @api @categories @positive
  Scenario: Get all categories
    When I send a GET request to "/Book/GetCategoriesList"
    Then the response status code should be 200
    And the response should contain a list of categories
    And each category should have categoryId and categoryName

  @api @books @dataValidation
  Scenario: Validate book data structure
    When I send a GET request to "/Book"
    And I select the first book from the response
    Then the book price should be a positive number
    And the book title should not be empty
    And the book author should not be empty
    And the book category should be a valid category

  @api @books @similar
  Scenario: Get similar books for a book
    Given I have a valid book ID "1"
    When I send a GET request to "/Book/GetSimilarBooks/1"
    Then the response status code should be 200
    And the response should contain similar books
    And similar books should be from the same category

  @api @auth @login @positive @manual
  Scenario: Login with valid credentials
    # Note: This requires "testuser" to exist in database
    # Create user first: username=testuser, password=Test@123
    When I send a POST request to "/Login" with body:
      """
      {
        "username": "testuser",
        "password": "Test@123"
      }
      """
    Then the response status code should be 200
    And the response should contain an authentication token
    And the response should contain user details

  @api @auth @login @negative
  Scenario: Login with invalid credentials
    When I send a POST request to "/Login" with body:
      """
      {
        "username": "invaliduser",
        "password": "wrongpassword"
      }
      """
    Then the response status code should be 401
    And the response should contain an error message "Invalid credentials"

  @api @auth @register @positive @wip
  Scenario: Register a new user
    # Note: Currently failing with 400 - API validation issue
    # Need to investigate exact schema requirements from Swagger
    When I send a POST request to "/User" with body:
      """
      {
        "firstName": "John",
        "lastName": "Doe",
        "username": "johndoe_<timestamp>",
        "password": "Test@123",
        "gender": "Male",
        "userTypeId": 1
      }
      """
    Then the response status code should be 201
    And the response should contain the new user ID

  @api @user @validation
  Scenario: Validate username availability
    When I send a GET request to "/User/validateUserName/testuser"
    Then the response status code should be 200
    And the response should indicate if username is available

  @api @cart @positive
  Scenario: Add book to shopping cart
    Given I am authenticated as "testuser"
    And I have a valid userId "1" and bookId "1"
    When I send a POST request to "/ShoppingCart/AddToCart/1/1"
    Then the response status code should be 200
    And the book should be added to the cart via API

  @api @cart @get @manual
  Scenario: Get shopping cart items
    # Note: Requires testuser to exist in database
    Given I am authenticated as "testuser"
    And I have a valid userId "1"
    When I send a GET request to "/ShoppingCart/1"
    Then the response status code should be 200
    And the response should contain cart items
    And each cart item should have book details and quantity

  @api @cart @update
  Scenario: Update cart item quantity
    Given I am authenticated as "testuser"
    And I have a book in my cart
    When I send a PUT request to "/ShoppingCart/1/1" with quantity "3"
    Then the response status code should be 200
    And the cart should be updated with new quantity

  @api @cart @delete
  Scenario: Remove item from cart
    Given I am authenticated as "testuser"
    And I have items in my cart
    When I send a DELETE request to "/ShoppingCart/1/1"
    Then the response status code should be 200
    And the item should be removed from cart

  @api @cart @clear
  Scenario: Clear entire shopping cart
    Given I am authenticated as "testuser"
    And I have multiple items in my cart
    When I send a DELETE request to "/ShoppingCart/1"
    Then the response status code should be 200
    And the cart should be empty via API

  @api @checkout @positive @manual
  Scenario: Complete checkout process
    # Note: Requires testuser to exist in database
    Given I am authenticated as "testuser"
    And I have items in my cart
    When I send a POST request to "/CheckOut/1" with shipping details:
      """
      {
        "name": "John Doe",
        "addressLine1": "123 Main St",
        "addressLine2": "Apt 4B",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "USA"
      }
      """
    Then the response status code should be 200
    And the response should contain order confirmation
    And the order should have a valid order ID

  @api @orders @get @manual
  Scenario: Get user orders
    # Note: Requires testuser to exist in database
    Given I am authenticated as "testuser"
    When I send a GET request to "/Order/1"
    Then the response status code should be 200
    And the response should contain order history
    And each order should have order details and items

  @api @wishlist @add @manual
  Scenario: Add book to wishlist
    # Note: Requires testuser to exist in database
    Given I am authenticated as "testuser"
    When I send a POST request to "/Wishlist/ToggleWishlist/1/1"
    Then the response status code should be 200
    And the book should be added to wishlist

  @api @wishlist @get @manual
  Scenario: Get user wishlist
    # Note: Requires testuser to exist in database
    Given I am authenticated as "testuser"
    When I send a GET request to "/Wishlist/1"
    Then the response status code should be 200
    And the response should contain wishlist items

  @api @wishlist @remove @manual
  Scenario: Remove book from wishlist
    # Note: Requires testuser to exist in database
    Given I am authenticated as "testuser"
    And I have a book in my wishlist
    When I send a POST request to "/Wishlist/ToggleWishlist/1/1"
    Then the response status code should be 200
    And the book should be removed from wishlist

  @api @integration @e2e @wip
  Scenario: Complete API flow - Register, Login, Add to Cart, Checkout
    # Note: Currently failing because registration returns 400
    # Depends on user registration working correctly
    # Register new user
    When I send a POST request to "/User" with unique user data
    Then the response status code should be 201
    And I save the new user ID
    # Login with new user
    When I send a POST request to "/Login" with new user credentials
    Then the response status code should be 200
    And I save the authentication token
    # Add book to cart
    When I send a POST request to "/ShoppingCart/AddToCart/<userId>/1" with auth token
    Then the response status code should be 200
    # Get cart
    When I send a GET request to "/ShoppingCart/<userId>" with auth token
    Then the response status code should be 200
    And the cart should contain 1 item
    # Checkout
    When I send a POST request to "/CheckOut/<userId>" with complete order details
    Then the response status code should be 200
    And I should receive order confirmation
    # Verify order
    When I send a GET request to "/Order/<userId>" with auth token
    Then the response status code should be 200
    And the order history should contain the new order

  @api @performance
  Scenario: API response time validation
    When I send a GET request to "/Book"
    Then the response status code should be 200
    And the response time should be less than 2000 milliseconds

  @api @books @crud @manual
  Scenario: Create, Read, Update, Delete book (Admin only)
    # Note: Requires admin user to exist in database
    Given I am authenticated as an admin user
    # Create
    When I send a POST request to "/Book" with new book data:
      """
      {
        "title": "Test Book",
        "author": "Test Author",
        "category": "Fiction",
        "price": 19.99,
        "coverFileName": "test.jpg"
      }
      """
    Then the response status code should be 201
    And I save the new book ID
    # Read
    When I send a GET request to "/Book/<bookId>"
    Then the response status code should be 200
    And the book title should be "Test Book"
    # Update
    When I send a PUT request to "/Book" with updated book data
    Then the response status code should be 200
    # Delete
    When I send a DELETE request to "/Book/<bookId>"
    Then the response status code should be 200

  @api @security
  Scenario: Verify protected endpoints require authentication
    When I send a POST request to "/CheckOut/1" without authentication
    Then the response status code should be 401
    And the response should contain "Unauthorized" message

  @api @dataIntegrity
  Scenario: Validate data consistency between API and database
    Given I have database connection
    When I send a GET request to "/Book/1"
    Then the response status code should be 200
    And I query the database for book with ID "1"
    Then the API response should match the database record
    And the book title should match
    And the book price should match
    And the book author should match
