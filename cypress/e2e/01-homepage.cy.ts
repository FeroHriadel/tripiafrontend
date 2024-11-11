describe('Home Page', () => {
  
  beforeEach(() => {
    cy.visitApp();
  });

  it('SignIn button exists', () => {
    cy.contains('Log in', { timeout: 10000});
  });

  it('Can visit TripsPage', () => {
    cy.contains('See Trips').click();
    cy.contains('LATEST TRIPS', {timeout: 10000});
  });

  it('PostTrip redirects unauth user to SigninPage', () => {
    cy.contains('Post a Trip').click();
    cy.contains('LOG IN', { timeout: 10000});
  });

});