Feature: BookCart Search Functionality
  As a user of BookCart
  I want to search for books
  So that I can find books I'm interested in

  Background:
    Given I am on the BookCart home page

  @smoke @search
  Scenario: Search input field is visible
    Then I should see the search input field
    And the search input field should be editable

  @search
  Scenario: Search for a book successfully
    When I search for "Harry Potter"
    Then I should see search results

  @search
  Scenario: Handle empty search results
    When I search for "NonExistentBookTitle12345"
    Then I should see a "No books found" message

  @search
  Scenario: Clear search results
    When I search for "Fiction"
    And I clear the search input
    Then I should see all books or default results

  @search
  Scenario Outline: Search for different book categories
    When I search for "<searchTerm>"
    Then I should see search results

    Examples:
      | searchTerm |
      | Fiction    |
      | Mystery    |
      | Romance    |
