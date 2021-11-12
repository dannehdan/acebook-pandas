const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/users');

router.get('/new', UsersController.New);
router.post('/', UsersController.Create);
router.get('/', UsersController.ViewMe);
router.get('/:id', UsersController.ViewMe);
router.post('/:id', UsersController.ChangeMe);

module.exports = router;
