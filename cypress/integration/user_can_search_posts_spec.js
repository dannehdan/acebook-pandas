describe('Searching posts', function () {
  beforeEach(async () => {
    await cy.task('db:drop:all');
  });

  it('should filter posts based on search term', function () {
    cy.visitSignUpPage();
    cy.signUpNewUser('Hermione Granger', 'hermione');

    cy.makeTestPost();

    cy.get('#new-post-form').find('[type="text"]').type('My new home');
    cy.get('#new-post-form').submit();

    cy.get('#search-bar').find('[type="text"]').type('Panda');
    cy.get('#search-bar').submit();

    cy.contains('Panda');
    cy.contains('My new home').should('not.exist');
  });
});
