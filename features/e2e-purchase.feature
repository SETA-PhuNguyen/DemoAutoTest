Feature: End-to-End Purchase Flow
  As a customer of BookCart
  I want to complete a full purchase journey
  So that I can buy books

  @e2e @purchase @smoke
  Scenario: Complete purchase flow - Browse and add to cart
    Given I am on the BookCart home page
    When I search for "Harry Potter"
    And I select the first book from search results
    And I verify the book details are displayed correctly
    And I add the book to cart with quantity "1"
    Then the book should be added to the cart
    And the cart icon should show 1 item
    And I should receive a confirmation message

  @e2e @purchase
  Scenario: Browse category and add multiple books to cart
    Given I am on the BookCart home page
    When I select the "Fiction" category
    And I verify the category filter is applied
    And I add the first "2" books to cart
    Then I should see "2" items in the cart
    And the cart total should match the sum of book prices
    And both books should be visible in the cart

  @e2e @purchase @filter
  Scenario: Search, filter, and add to cart
    Given I am on the BookCart home page
    When I search for "Mystery"
    And I select the "Mystery" category
    And I verify filtered results match the criteria
    And I add the first book to cart
    And I navigate to the shopping cart
    Then I should see the added book in cart
    And the book should have correct title and price

  @e2e @purchase @quantity
  Scenario: Add to cart and update quantity
    Given I am on the BookCart home page
    When I search for "Fiction"
    And I add a book to cart
    And I navigate to the shopping cart
    And I verify the initial quantity is 1
    And I update the book quantity to "3"
    Then the quantity should display as 3
    And the cart total should be updated correctly
    And the unit price should remain unchanged

  @e2e @purchase @authenticated
  Scenario: Complete checkout flow as registered user
    Given I am on the BookCart home page
    And I am logged in as a registered user with username "testuser" and password "Test@123"
    When I search for "Fiction"
    And I add a book to cart with price verification
    And I navigate to the shopping cart
    And I verify cart contents are correct
    And I proceed to checkout
    And I enter shipping details:
      | Name     | John Doe           |
      | Address  | 123 Main Street    |
      | City     | New York           |
      | State    | NY                 |
      | ZipCode  | 10001              |
    And I verify order summary is correct
    And I confirm the order
    Then I should see order confirmation
    And I should receive an order number
    And the cart should be empty after order

  @e2e @purchase @guest
  Scenario: Attempt checkout as guest user
    Given I am on the BookCart home page
    And I am not logged in
    When I add a book to cart
    And I navigate to the shopping cart
    And I proceed to checkout
    Then I should be redirected to login page
    And I should see a message to login before checkout

  @e2e @purchase @validation
  Scenario: Validate checkout with empty cart
    Given I am on the BookCart home page
    And I am logged in as a registered user with username "testuser" and password "Test@123"
    When I navigate to the shopping cart
    And my cart is empty
    And I try to proceed to checkout
    Then I should see "Cart is empty" message
    And the checkout button should be disabled

  @e2e @purchase @multipleItems
  Scenario: Complete purchase with multiple different books
    Given I am on the BookCart home page
    And I am logged in as a registered user with username "testuser" and password "Test@123"
    When I add books from different categories:
      | Category  | Quantity |
      | Fiction   | 1        |
      | Mystery   | 2        |
      | Romance   | 1        |
    And I navigate to the shopping cart
    And I verify all books are in cart with correct quantities
    And I proceed to checkout
    And I enter complete shipping details
    And I confirm the order
    Then I should see order confirmation
    And all books should be listed in the order summary
    And the total should match cart total

  @e2e @purchase @priceValidation
  Scenario: Validate prices throughout purchase flow
    Given I am on the BookCart home page
    When I select a book with price "$19.99"
    And I note the book price as "expected_price"
    And I add the book to cart
    And I navigate to the shopping cart
    Then the cart should show the same price "$19.99"
    And I am logged in as a registered user with username "testuser" and password "Test@123"
    When I proceed to checkout
    Then the checkout summary should show the same price "$19.99"

  @e2e @purchase @error
  Scenario: Handle errors during checkout
    Given I am on the BookCart home page
    And I am logged in as a registered user with username "testuser" and password "Test@123"
    When I add a book to cart
    And I navigate to the shopping cart
    And I proceed to checkout
    And I enter incomplete shipping details
    And I try to confirm the order
    Then I should see validation errors
    And the order should not be processed
    And I should remain on the checkout page
