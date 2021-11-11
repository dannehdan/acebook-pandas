const multiparty = require('connect-multiparty');
const multipartyMiddleware = multiparty();

const express = require('express');
const router = express.Router();

const PostsController = require('../controllers/posts');
const CommentsController = require('../controllers/comments');

router.get('/', PostsController.Index);
router.post('/', multipartyMiddleware, PostsController.Create);
router.get('/search', PostsController.Search);

// TODO: CRUD the link - PATCH /:post_id/like
router.patch('/testLikes', PostsController.Like);
router.post('/testComments', CommentsController.Create);
router.patch('/testCommentsLike', CommentsController.Like);

module.exports = router;
