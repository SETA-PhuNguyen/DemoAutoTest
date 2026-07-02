Feature: BookCart Shopping Cart
  As a user of BookCart
  I want to manage my shopping cart
  So that I can purchase books

  Background:
    Given I am on the BookCart home page

  @smoke @cart
  Scenario: Navigate to shopping cart page
    When I navigate to the shopping cart
    Then I should be on the cart page
    And the cart page should load completely
    And I should see the cart header

  @cart @empty
  Scenario: View empty cart message
    When I navigate to the shopping cart
    Then I should see the cart page loaded
    And I should see "Your cart is empty" message
    And I should see "Continue Shopping" button

  @cart @ui
  Scenario: Cart icon is visible on home page
    Then I should see the cart icon on the navigation bar
    And the cart icon should display item count
    And the cart icon should be clickable

  @cart @navigation
  Scenario: Navigate back from cart to home
    When I navigate to the shopping cart
    And I click continue shopping
    Then I should be redirected to home page
    And I should see the book listings

  @cart @add
  Scenario: Add single book to cart
    When I select the first book
    And I add the book to cart with quantity "1"
    Then the book should be added to the cart
    And the cart count should increase by 1
    And I should see a success notification

  @cart @add
  Scenario: Add multiple books to cart
    When I add "3" different books to the cart
    Then the cart should contain 3 items
    And the cart total should be calculated correctly
    And each book should be listed in the cart

  @cart @quantity
  Scenario: Update book quantity in cart
    Given I have "1" book in my cart
    When I navigate to the shopping cart
    And I increase the quantity to "3"
    Then the quantity should be updated to 3
    And the subtotal for that book should be updated
    And the cart total should reflect the change

  @cart @quantity
  Scenario: Decrease book quantity in cart
    Given I have a book with quantity "3" in my cart
    When I navigate to the shopping cart
    And I decrease the quantity to "1"
    Then the quantity should be updated to 1
    And the subtotal should be recalculated

  @cart @remove
  Scenario: Remove book from cart
    Given I have "2" books in my cart
    When I navigate to the shopping cart
    And I remove the first book
    Then the book should be removed from the cart
    And the cart count should decrease by 1
    And the cart total should be updated

  @cart @remove
  Scenario: Clear all items from cart
    Given I have "3" books in my cart
    When I navigate to the shopping cart
    And I click "Clear Cart" button
    Then the cart should be empty
    And I should see "Your cart is empty" message

  @cart @calculation
  Scenario: Verify cart total calculation
    Given I have the following books in my cart:
      | Title           | Price  | Quantity |
      | Test Book 1     | 10.00  | 2        |
      | Test Book 2     | 15.00  | 1        |
    When I navigate to the shopping cart
    Then the subtotal should be "35.00"
    And the grand total should include tax if applicable
    And all price calculations should be accurate

  @cart @validation
  Scenario: Validate maximum quantity limit
    Given I have "1" book in my cart
    When I navigate to the shopping cart
    And I try to increase quantity beyond maximum limit
    Then I should see a validation message
    And the quantity should not exceed the maximum allowed

  @cart @persistence
  Scenario: Cart persists across page navigation
    Given I have "2" books in my cart
    When I navigate to the home page
    And I navigate back to the shopping cart
    Then I should still see 2 items in my cart
    And the cart contents should be unchanged

  @cart @guest
  Scenario: Guest user cart functionality
    Given I am not logged in
    When I add a book to cart
    And I navigate to the shopping cart
    Then I should see the added book
    And I should be prompted to login for checkout
