declare namespace Cypress {
  interface Chainable<Subject> {
    visitApp(): Chainable<Subject>
  }
}