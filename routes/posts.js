var express = require('express');
var router = express.Router();

var PostsController = require('../controllers/posts');
var CommentsController = require('../controllers/comments');

router.get('/', PostsController.Index);
router.post('/', PostsController.Create);
router.get('/new', PostsController.New);

// todo CRUD the link - PATCH /:post_id/like
router.patch('/testLikes', PostsController.Like);
router.post('/testComments', CommentsController.Create);

module.exports = router;
