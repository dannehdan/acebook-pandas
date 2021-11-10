const os = require('os');
const path = require('path');
const appPrefix = 'acebook-pandas';

const tmpDir = path.join(os.tmpdir(), appPrefix);

var multiparty = require('connect-multiparty'),
  multipartyMiddleware = multiparty({ uploadDir: tmpDir });

var express = require('express');
var router = express.Router();

var PostsController = require('../controllers/posts');

router.get('/', PostsController.Index);
router.post('/', multipartyMiddleware, PostsController.Create);
router.get('/new', PostsController.New);

// todo CRUD the link - PATCH /:post_id/like
router.patch('/testLikes', PostsController.Like);

module.exports = router;
