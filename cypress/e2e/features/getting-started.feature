Feature: To-do app

  Background:
  Given I open To-do app page
  
  Scenario: Displays two todo items by default
    Then I should see two items

  Scenario: Adds a new todo item
    When I add a new todo
    Then I should see a new todo

  Scenario: Can check off an item as completed
    When I check a todo
    Then todo should appear as completed

  Scenario: Check links to other pages
    Then I navigate to other pages
  
  Scenario: Check A11y 
    When I inject a11y tests
    Then I should see no a11y violations