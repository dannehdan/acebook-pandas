describe('Liking comments', function () {
  beforeEach(async function () {
    await cy.task('db:drop:all');
  });

  it('allows a user to like a comment', function () {
    cy.createPost('new post');
    cy.addComment('one');

    cy.contains('one').get('.like-comment-button').click();
    cy.reload();
    cy.contains('one').get('.like-counter').should('contain', '1');
  });

  it('allows a user to unlike a post', function () {
    cy.createPost('new post');
    cy.addComment('one');

    cy.contains('one').get('.like-comment-button').click();
    cy.reload();
    cy.contains('one').get('.like-counter').should('contain', '1');

    cy.contains('one').get('.like-comment-button').click();
    cy.reload();
    cy.contains('one').get('.like-counter').should('contain', '0');
  });
});
