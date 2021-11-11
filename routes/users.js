var express = require('express');
// const { rawListeners } = require('node-notifier');
var router = express.Router();

var UsersController = require('../controllers/users');

router.get('/new', UsersController.New);
router.post('/', UsersController.Create);
router.get('/:id', UsersController.ViewMe);

module.exports = router;
