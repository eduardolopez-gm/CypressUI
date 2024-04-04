Feature: To-do app

  Background:
  Given I open To-do app page

  @smoke
  Scenario: Displays two todo items by default
    Then I should see two items

  Scenario: Adds a new todo item
    When I add a new todo
    Then I should see a new todo

  @smoke
  Scenario: Can check off an item as completed
    When I check a todo
    Then todo should appear as completed
  @regression
  Scenario: Check links to other pages
    Then I navigate to other pages