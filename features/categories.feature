Feature: BookCart Category Filtering
  As a user of BookCart
  I want to filter books by category
  So that I can browse books in specific genres

  Background:
    Given I am on the BookCart home page

  @smoke @categories
  Scenario: Filter books by Biography category
    When I select the "Biography" category
    Then I should see books filtered by the category

  @categories
  Scenario: Filter books by Fiction category
    When I select the "Fiction" category
    Then I should see books filtered by the category

  @categories
  Scenario: Filter books by Mystery category
    When I select the "Mystery" category
    Then I should see books filtered by the category

  @categories
  Scenario: Filter books by Fantasy category
    When I select the "Fantasy" category
    Then I should see books filtered by the category

  @categories
  Scenario: Filter books by Romance category
    When I select the "Romance" category
    Then I should see books filtered by the category

  @categories
  Scenario Outline: Filter books by various categories
    When I select the "<category>" category
    Then I should see books filtered by the category

    Examples:
      | category  |
      | Biography |
      | Fiction   |
      | Mystery   |
      | Fantasy   |
      | Romance   |
