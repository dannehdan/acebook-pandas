# Acebook

This is a Node.js Acebook engineering project by pandas team. This project can be viewed locally, or is hosted at https://acebook-pandas.herokuapp.com/

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
- [Nano ID](https://github.com/ai/nanoid#readme) to generate unique string for image names.
- [Node Fetch](https://github.com/node-fetch/node-fetch) to get login credentials from JSON file.
- [Google Cloud Storage](https://www.npmjs.com/package/@google-cloud/storage) to upload images to the Google Cloud.
- [Connect-multiparty](https://github.com/expressjs/connect-multiparty#readme) to handle multipart forms (e.g. form for creating post with an image).

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
- [x] As a user, so I can disscuss interesting topic, I would like to add a comment to a post.
- [x] As a user, so I can support a comment, I would like to be able to like it.
- [ ] As a user, so I can correct my typos, I would like to edit my post or comment after posting.
- [ ] As a user, so I can redact my opinion, I would like to delete a post or comment.
- [x] As a user, so everything looks good, I would like a nice UI.

## Tickets and process
[Trello Board](https://trello.com/b/o0oJVI0n/acebook-pandas)

### Run this project locally

```
npm install
```
Install and start MongoDB
```
brew tap mongodb/brew
brew install mongodb-community@4.2
brew services start mongodb-community@4.2
```

To start the server locally:
```
npm start
```
Browse to [http://localhost:3000](http://localhost:3000)

### Running tests

Start a test server, then run the test suite
```
npm run start:test
```

This starts the server on port `3030` and uses the `acebook_test` MongoDB database,
so that integration tests do not interact with the development server.

```
npm test
```
