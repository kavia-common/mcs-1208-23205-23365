describe('DashboardHost smoke', () => {
  beforeEach(() => {
    // Ensure each test starts clean and the app reads empty auth state on load
    cy.visit('/', {
      onBeforeLoad(win) {
        try {
          win.localStorage.clear();
        } catch {
          // ignore if access blocked
        }
      },
    });
  });

  it('renders header and home', () => {
    cy.get('[data-cy="header"]').should('exist');
    cy.get('[data-cy="home"]').should('exist');
  });

  it('has navigation links', () => {
    cy.get('[data-cy="nav-asset"]').should('exist');
    cy.get('[data-cy="nav-templates"]').should('exist');
    cy.get('[data-cy="nav-explorer"]').should('exist');
  });

  it('can go to login and back', () => {
    cy.get('[data-cy="nav-login"]').should('be.visible').click();
    cy.get('[data-cy="login"]').should('exist');
    cy.get('[data-cy="login-button"]').click();
    cy.get('[data-cy="user-name"]').should('contain', 'Demo User');
    cy.location('pathname').should('eq', '/');
  });
});
