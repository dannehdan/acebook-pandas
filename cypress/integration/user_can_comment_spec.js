describe('Creating comments', function () {
  beforeEach(async function () {
    await cy.task('db:drop:all');
  });

  it('have comment toggle button under post', () => {
    cy.createPost('Hello, world!');
    cy.get('.post')
      .find('.comment-toggle-button')
      .should('contain', 'Add comment');
  });

  it('toggler on click shows input field for comment and comment button', () => {
    cy.createPost('hi there!');

    cy.contains('Add comment').click();

    cy.get('.comment-box-div')
      .find('.comment-text')
      .should('have.attr', 'required');
    cy.get('.comment-box-div')
      .find('.comment-button')
      .should('contain', 'Comment');
  });

  it('user can comment a post', () => {
    cy.createPost('very interesting post');

    cy.get('.comment-toggle-button').click();
    cy.get('.comment-box-div').find('.comment-text').type('good point!');
    cy.get('.comment-box-div').find('.comment-button').click();

    cy.get('.comments-div')
      .find('.comment-message')
      .should('contain', 'good point!');
  });

  it('can see only two most recent comments by default', () => {
    cy.createPost('very interesting post');

    cy.addComment('one');
    cy.addComment('two');
    cy.addComment('three');

    cy.get('.comments-div').should('contain', 'three');
    cy.get('.comments-div').should('contain', 'two');
    cy.get('.comments-div')
      .find('.collapse-comment')
      .should('contain', 'one')
      .should('not.be.visible');
  });

  it('can see all comments after clicking "show more" button', () => {
    cy.createPost('very interesting post');

    const comments = ['one', 'two', 'three'];
    for (const comment of comments) {
      cy.addComment(comment);
    }

    cy.get('.show-more-button').click();
    cy.get('.comments-div').scrollIntoView();

    for (const comment of comments) {
      cy.get('.comments-div')
        .find('.comment-message')
        .contains(comment)
        .should('be.visible');
    }
  });

  it("can see a name of the comment's author", () => {
    cy.createPost('very interesting post');
    cy.logOutUser();
    cy.visit('/users/new');
    cy.signUpNewUser('Luna Lovegood', 'luna');
    cy.addComment('Nargles would approve this!');

    cy.get('.comments-div')
      .find('.commenter-name')
      .should('contain', 'Luna Lovegood');
  });
});
