describe('Viewing own profile page', function () {
  beforeEach(async () => {
    await cy.task('db:drop:all');
  });

  it('User can view their own email address when they view their profile page', () => {
    cy.visit('/users/new');
    cy.get('#new-user-form').find('#name').type('a');
    cy.get('#new-user-form').find('#email').type(`a@example.com`);
    cy.get('#new-user-form').find('#password').type('12345');
    cy.get('#new-user-form').submit();
    cy.contains('Profile').click();
    cy.get('h1').should('contain', 'a@example.com');
  });
});
