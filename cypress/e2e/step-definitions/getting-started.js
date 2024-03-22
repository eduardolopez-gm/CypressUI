import { Given, When , Then } from "cypress-cucumber-preprocessor/steps";

const url = 'https://example.cypress.io/todo'
const newItem = 'Feed the cat'
Given('I open To-do app page', () => {
  cy.visit(url)
})

Then('I should see two items', ()=>{
    cy.get('.todo-list li').first().should('have.text', 'Pay electric bill')
    cy.get('.todo-list li').last().should('have.text', 'Walk the dog')
})

When('I add a new todo', ()=>{
    cy.get('[data-test=new-todo]').type(`${newItem}{enter}`)
})
Then('I should see a new todo', ()=>{
    cy.get('.todo-list li')
      .should('have.length', 3)
      .last()
      .should('have.text', newItem)
})

When('I check a todo', ()=>{
    cy.contains('Pay electric bill')
      .parent()
      .find('input[type=checkbox]')
      .check()
})

Then('todo should appear as completed', ()=>{
    cy.contains('Pay electric bill')
      .parents('li')
      .should('have.class', 'completed')
})

Then('I navigate to other pages', ()=>{
    cy.get('a').each(page => {
        cy.log(page.prop)
        cy.request(page.prop('href')).
        then(response => {
            expect(response.status).eq(200)
        })
        })
}) 