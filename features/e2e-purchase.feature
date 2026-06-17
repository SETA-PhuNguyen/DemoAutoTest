Feature: End-to-End Purchase Flow
  As a customer of BookCart
  I want to complete a full purchase journey
  So that I can buy books

  @e2e @purchase
  Scenario: Complete purchase flow - Browse and add to cart
    Given I am on the BookCart home page
    When I search for "Harry Potter"
    And I select the first book from search results
    And I add the book to cart with quantity "1"
    Then the book should be added to the cart

  @e2e @purchase
  Scenario: Browse category and add multiple books to cart
    Given I am on the BookCart home page
    When I select the "Fiction" category
    And I add the first "2" books to cart
    Then I should see "2" items in the cart

  @e2e @purchase
  Scenario: Search, filter, and add to cart
    Given I am on the BookCart home page
    When I search for "Mystery"
    And I select the "Mystery" category
    And I add the first book to cart
    And I navigate to the shopping cart
    Then I should see the added book in cart

  @e2e @purchase
  Scenario: Add to cart and update quantity
    Given I am on the BookCart home page
    When I search for "Fiction"
    And I add a book to cart
    And I navigate to the shopping cart
    And I update the book quantity to "3"
    Then the cart total should be updated

  @e2e @purchase
  Scenario: Complete checkout flow
    Given I am on the BookCart home page
    And I am logged in as a registered user
    When I add a book to cart
    And I navigate to the shopping cart
    And I proceed to checkout
    And I enter shipping details
    And I confirm the order
    Then I should see order confirmation
