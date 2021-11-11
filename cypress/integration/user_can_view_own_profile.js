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
    cy.contains('a').click();
    cy.contains('My Profile').click();
    cy.get('h1').should('contain', 'a@example.com');
  });
});

// describe('Sign in', function () {
//   it('can sign in a returning user', function () {
//     cy.visitSignUpPage();
//     cy.signUpNewUser('Freddy', 'freddy');
//     cy.logOutUser();
//     cy.visitSignInPage();
//     cy.signInUser('freddy', '12345');

//     cy.get('title').should('contain', 'Posts');
//     cy.get('#alert-message').should('contain', 'Welcome back, Freddy!');
//   });

//   it("Doesn't allow log in for non-existing user", function () {
//     cy.visitSignInPage();
//     cy.signInUser('einstein', '12345');
//     cy.get('title').should('contain', 'Log In');
//     cy.get('#alert-message').should('contain', 'User not found!');
//   });
// });
