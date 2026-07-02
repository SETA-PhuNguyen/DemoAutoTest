Feature: BookCart Login Functionality
  As a user of BookCart
  I want to be able to login
  So that I can access personalized features

  Background:
    Given I am on the BookCart home page

  @smoke @login
  Scenario: Display login form with all required fields
    When I click on the login button
    Then I should see the login form
    And I should see the username input field
    And I should see the password input field
    And the login submit button should be visible
    And the username field should be editable
    And the password field should be editable

  @smoke @login @validation
  Scenario: Login validation - Empty credentials
    When I click on the login button
    And I click the login submit button without entering credentials
    Then I should see validation error messages
    And I should see "Username is required" error
    And I should see "Password is required" error

  @login @validation
  Scenario: Login validation - Invalid username format
    When I click on the login button
    And I enter username "ab" and password "ValidPass123"
    And I click the login submit button
    Then I should see "Username must be at least 3 characters" error

  @login @negative
  Scenario: Login validation - Invalid credentials
    When I click on the login button
    And I enter username "invaliduser" and password "wrongpass"
    And I click the login submit button
    Then I should see an error message "Invalid credentials"
    And I should remain on the login page

  @login @positive
  Scenario: Successful login with valid credentials
    When I click on the login button
    And I enter username "testuser" and password "Test@123"
    And I click the login submit button
    Then I should be successfully logged in
    And I should see the user profile menu
    And the login button should be replaced with logout button

  @login @navigation
  Scenario: Navigate to register page
    When I click on the login button
    And I click on the register link
    Then I should see the registration form
    And I should see all registration fields
    And I should see password confirmation field

  @login @ui
  Scenario: Close login dialog
    When I click on the login button
    And I close the login dialog
    Then I should be back on the home page
    And the login dialog should not be visible

  @login @security
  Scenario: Password field should mask input
    When I click on the login button
    And I enter password "SecurePass123"
    Then the password field should be of type "password"
    And the password characters should be masked

  @login @session
  Scenario: Logout successfully
    Given I am logged in as "testuser"
    When I click on the logout button
    Then I should be logged out successfully
    And I should see the login button again
