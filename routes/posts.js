var multiparty = require('connect-multiparty'),
  multipartyMiddleware = multiparty();

var express = require('express');
var router = express.Router();

var PostsController = require('../controllers/posts');
var CommentsController = require('../controllers/comments');

router.get('/', PostsController.Index);
router.post('/', multipartyMiddleware, PostsController.Create);
// router.get('/new', PostsController.New);

// todo CRUD the link - PATCH /:post_id/like
router.patch('/testLikes', PostsController.Like);
router.post('/testComments', CommentsController.Create);
router.patch('/testCommentsLike', CommentsController.Like);

module.exports = router;
