describe('DashboardHost smoke', () => {
  it('renders header and home', () => {
    cy.visit('/');
    cy.get('[data-cy="header"]').should('exist');
    cy.get('[data-cy="home"]').should('exist');
  });

  it('has navigation links', () => {
    cy.get('[data-cy="nav-asset"]').should('exist');
    cy.get('[data-cy="nav-templates"]').should('exist');
    cy.get('[data-cy="nav-explorer"]').should('exist');
  });

  it('can go to login and back', () => {
    cy.get('[data-cy="nav-login"]').click();
    cy.get('[data-cy="login"]').should('exist');
    cy.get('[data-cy="login-button"]').click();
    cy.get('[data-cy="user-name"]').should('contain', 'Demo User');
  });
});
