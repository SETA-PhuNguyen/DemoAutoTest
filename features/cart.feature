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

  @cart
  Scenario: View empty cart message
    When I navigate to the shopping cart
    Then I should see the cart page loaded

  @cart
  Scenario: Cart icon is visible on home page
    Then I should see the cart icon on the navigation bar

  @cart
  Scenario: Navigate back from cart to home
    When I navigate to the shopping cart
    And I click continue shopping
    Then I should be on the cart page
