/************************************************************************************************************************
- also add commands to index.d.ts or TS will scream. Like this:

/cypress/support/commands.ts:
Cypress.Commands.add('visitApp', () => {
  cy.visit(Cypress.env('APP_URL'));
});

/cypress/support/index.d.ts:
declare namespace Cypress {
  interface Chainable<Subject> {
    visitApp(): Chainable<Subject>
  }
}

************************************************************************************************************************/



Cypress.Commands.add('visitApp', () => {
  cy.visit(Cypress.env('APP_URL')); //env vars are defined in /cypress.config.ts: e2e: {env: {APP_URL: 'http://localhost:3000', ANOTHER_VAR: 'var_value}}
});
