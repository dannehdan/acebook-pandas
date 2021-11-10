# Acebook

This is a Node.js Acebook engineering project by pandas team.

It uses:
- [Express](https://expressjs.com/) web framework for Node.js.
- [Nodemon](https://nodemon.io/) to reload the server automatically.
- [Handlebars](https://handlebarsjs.com/) to render view templates.
- [Mongoose](https://mongoosejs.com) to model objects in MongoDB.
- [ESLint](https://eslint.org) for linting.
- [Jest](https://jestjs.io/) for testing.
- [Cypress](https://www.cypress.io/) for end-to-end testing.
- [Husky](https://typicode.github.io/husky/) for pre-commit hook.
- [Prettier](https://prettier.io/) to style code consistently.
- [Bootstrap](https://getbootstrap.com/) to make UI prettier.
- [Bcrypt](https://www.npmjs.com/package/bcrypt) to store passwords safely.

## User Stories

- [x] As a user, so I can access my account, I would like to login.
- [x] As a user, so I can login, I would like to sign up.
- [x] As a user, so I can change accounts, I would like to log out.
- [x] As a user, so I can share my opinion, I would like to upload posts (consisting of picture and text).
- [x] As a user, so I can read other people's thoughts, I would like to view all posts (recent first).
- [x] As a user, so I can stay up to date, I would like to see recent posts first.
- [x] As a user, so I can navigate the site easily, I would like to have a navigation bar.
- [x] As a user, so I can support an opinion, I would like to add a like to the post.
- [x] As a user, so I can change my mind, I would like to remove my like from the post.
- [x] As a user, so I can know who wrote a post, I would like to see their name next to it.
- [ ] As a user, so I can know who wrote a post, I would like to see their photo next to it.
- [ ] As a user, so I can introduce myself, I would like to enter info about me (DOB, bio and photo).
- [ ] As a user, so I can disscuss interesting topic, I would like to add a comment to a post.
- [ ] As a user, so I can support a comment, I would like to be able to like it.
- [ ] As a user, so I can correct my typos, I would like to edit my post or comment after posting.
- [ ] As a user, so I can redact my opinion, I would like to delete a post or comment.
- [ ] As a user, so everything looks good, I would like a nice UI.

## Card wall

[Trello Board](https://trello.com/b/o0oJVI0n/acebook-pandas)

## Quickstart

### Install Node.js

1. Install Node Version Manager (NVM)
   ```
   brew install nvm
   ```
   Then follow the instructions to update your `~/.bash_profile`.
1. Open a new terminal
1. Install the latest long term support (LTS) version of [Node.js](https://nodejs.org/en/), currently `12.14.1`.
   ```
   nvm install 12.14.1
   ```

### Set up your project

1. Fork this repository
1. Rename your fork to `acebook-<team name>`
1. Clone your fork to your local machine
1. Install Node.js dependencies
   ```
   npm install
   ```
1. Install an ESLint plugin for your editor. For example: [linter-eslint](https://github.com/AtomLinter/linter-eslint) for Atom.
1. Install MongoDB
   ```
   brew tap mongodb/brew
   brew install mongodb-community@4.2
   ```
1. Start MongoDB
   ```
   brew services start mongodb-community@4.2
   ```

### Start

1. Start the server
   ```
   npm start
   ```
1. Browse to [http://localhost:3000](http://localhost:3000)

### Test

- Run all tests
  ```
  npm test
  ```
- Run a check
  ```bash
  npm run lint              # linter only
  npm run test:unit         # unit tests only
  npm run test:integration  # integration tests only

  # Bonus: only one integration test
  npm run cy:run -- --spec cypress/integration/user_likes_spec.js
  ```

#### Start test server

The server must be running locally with test configuration for the
integration tests to pass.

```
npm run start:test
```

This starts the server on port `3030` and uses the `acebook_test` MongoDB database,
so that integration tests do not interact with the development server.
