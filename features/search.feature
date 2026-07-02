Feature: BookCart Search Functionality
  As a user of BookCart
  I want to search for books
  So that I can find books I'm interested in

  Background:
    Given I am on the BookCart home page

  @smoke @search
  Scenario: Search input field is visible and functional
    Then I should see the search input field
    And the search input field should be editable
    And the search input field should have placeholder text

  @search @positive
  Scenario: Search for a book successfully by title
    When I search for "Harry Potter"
    Then I should see search results
    And all results should contain "Harry Potter" in the title
    And the number of results should be displayed

  @search @positive
  Scenario: Search for books by author
    When I search for "author name"
    Then I should see search results
    And the results should match the author criteria

  @search @negative
  Scenario: Handle empty search results
    When I search for "NonExistentBookTitle12345XYZ"
    Then I should see a "No books found" message
    And no book cards should be displayed
    And I should see a suggestion to try different keywords

  @search @ui
  Scenario: Clear search results
    When I search for "Fiction"
    And I see search results displayed
    And I clear the search input
    Then I should see all books or default results
    And the search input should be empty

  @search @validation
  Scenario: Search with special characters
    When I search for "@#$%^&*()"
    Then the system should handle the search gracefully
    And either show no results or relevant books

  @search @validation
  Scenario: Search with very long text
    When I search for "This is a very long search query that contains many words and should be handled properly by the system without breaking the interface or causing errors in the search functionality"
    Then the system should handle the search gracefully
    And the search input should truncate or wrap text appropriately

  @search @performance
  Scenario: Search results load within acceptable time
    When I search for "Fiction"
    Then I should see search results within 3 seconds
    And the page should remain responsive

  @search @data
  Scenario Outline: Search for different book categories
    When I search for "<searchTerm>"
    Then I should see search results
    And the results should be relevant to "<searchTerm>"
    And each result should have a title, author, and price

    Examples:
      | searchTerm |
      | Fiction    |
      | Mystery    |
      | Romance    |
      | Biography  |
      | Fantasy    |

  @search @integration
  Scenario: Search and filter combination
    When I search for "Mystery"
    And I select the "Mystery" category filter
    Then I should see filtered search results
    And all results should be Mystery books
    And the results should match the search term

  @search @realtime
  Scenario: Search with real-time results
    When I start typing "Harr" in the search field
    Then I should see search suggestions or results update in real-time
    And the results should refine as I type more characters
