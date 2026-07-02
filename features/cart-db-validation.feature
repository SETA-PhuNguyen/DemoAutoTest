Feature: BookCart Shopping Cart with Database Validation
  As a QA Engineer
  I want to validate UI data against database
  So that I can ensure data consistency

  Background:
    Given I am on the BookCart home page

#   @cart @dbValidation @database
#   Scenario Outline: Validate cart total matches database
#     Given I have "<bookCount>" books in my cart
#     When I navigate to the shopping cart
#     And I capture the cart total from UI
#     And I store it as "cartTotalFromUI"
    
#     # Execute database query to get cart total
#     When I execute database query "<queryName>" with parameters:
#       | parameter | value    |
#       | userId    | <userId> |
#     And I store the database results as "cartDataFromDB"
    
#     # Validate UI matches DB within tolerance
#     Then the UI value "cartTotalFromUI" should match DB value "cartDataFromDB[0].Total" within:
#       | toleranceType | value   |
#       | absolute      | 0.01    |
#       | percentage    | 0.05    |

#     Examples:
#       | bookCount | queryName      | userId |
#       | 2         | cart.getTotal  | 1      |
#       | 3         | cart.getTotal  | 1      |

#   @cart @dbValidation @database @itemCount
#   Scenario Outline: Validate cart item count
#     Given I have "<bookCount>" books in my cart
#     When I navigate to the shopping cart
    
#     # Get count from UI
#     Then the cart should contain <bookCount> items
    
#     # Execute database query
#     When I execute database query "<queryName>" with parameters:
#       | parameter | value    |
#       | userId    | <userId> |
#     Then the database query should return <expectedRowCount> rows
#     And I store the database results as "cartCountFromDB"

#     Examples:
#       | bookCount | queryName      | userId | expectedRowCount |
#       | 2         | cart.getCount  | 1      | 1                |
#       | 3         | cart.getCount  | 1      | 1                |

#   @cart @dbValidation @database @complex @wip
#   Scenario Outline: Validate cart items details match database
#     Given I have the following books in my cart:
#       | Title       | Price | Quantity |
#       | Book One    | 10.00 | 2        |
#       | Book Two    | 15.00 | 1        |
#       | Book Three  | 20.00 | 3        |
    
#     When I navigate to the shopping cart
#     And I capture all cart items from UI
#     And I store it as "cartItemsFromUI"
    
#     # Execute database query to get cart items
#     When I execute database query "<queryName>" with parameters:
#       | parameter | value    |
#       | userId    | <userId> |
#     And I store the database results as "cartItemsFromDB"
    
#     # Validate complex data with composite keys
#     Then the UI data "cartItemsFromUI" should match DB data "cartItemsFromDB" by keys:
#       | keyField | compareField | toleranceType | toleranceValue |
#       | Title    | Quantity     | absolute      | 0              |
#       | Title    | Price        | absolute      | 0.01           |

#     Examples:
#       | queryName       | userId |
#       | cart.getItems   | 1      |

#   @cart @dbValidation @database @analytics @wip
#   Scenario Outline: Validate sales by category
#     # Note: This scenario requires CustomerOrders/CustomerOrderDetails tables
#     When I execute database query "<queryName>" with parameters:
#       | parameter | value        |
#       | startDate | <startDate>  |
#       | endDate   | <endDate>    |
#     And I store the database results as "salesByCategory"
#     And I print stored value "salesByCategory"
#     Then the database query should return at least <minExpectedRows> rows

#     Examples:
#       | queryName        | startDate  | endDate    | minExpectedRows |
#       | sales.byCategory | 2024-01-01 | 2026-12-31 | 0               |

  @cart @dbValidation @database @category
  Scenario Outline: Validate books by category match database
    # Filter books by category on UI
    When I select the "<category>" category
    And I capture the book count from UI
    And I store it as "bookCountFromUI"
    
    # Execute database query to get books by category
    When I execute database query "<queryName>" with parameters:
      | parameter | value        |
      | category  | <category>   |
    And I store the database results as "booksByCategory"
    
    # Validate UI count matches DB count
    Then the UI value "bookCountFromUI" should match DB value "booksByCategory" count

    Examples:
      | category  | queryName           |
      | Biography | books.getByCategory |
      | Fiction   | books.getByCategory |
      | Mystery   | books.getByCategory |
      | Fantasy   | books.getByCategory |
      | Romance   | books.getByCategory |
