Feature: BookCart Login Functionality
  As a user of BookCart
  I want to be able to login
  So that I can access personalized features

  Background:
    Given I am on the BookCart home page

  @smoke @login
  Scenario: Display login form
    When I click on the login button
    Then I should see the login form
    And I should see the username input field
    And I should see the password input field

  @smoke @login
  Scenario: Login validation - Empty credentials
    When I click on the login button
    And I click the login submit button without entering credentials
    Then I should see validation error messages

  @login
  Scenario: Login validation - Invalid credentials
    When I click on the login button
    And I enter username "invaliduser" and password "wrongpass"
    And I click the login submit button
    Then I should see an error message

  @login
  Scenario: Navigate to register page
    When I click on the login button
    And I click on the register link
    Then I should see the registration form

  @login
  Scenario: Close login dialog
    When I click on the login button
    And I close the login dialog
    Then I should be back on the home page
