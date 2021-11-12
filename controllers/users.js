const Post = require('../models/post');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const UsersController = {
  New: function (req, res) {
    res.render('users/new', { title: 'Sign Up' });
  },

  Create: async function (req, res) {
    const userInfo = { ...req.body };
    const hashedPassword = await bcrypt.hash(userInfo.password, 10);
    userInfo.password = hashedPassword;

    const user = new User(userInfo);

    User.findOne({ email: user.email }).then(userReturned => {
      if (userReturned) {
        req.session.message = {
          type: 'danger',
          intro: 'User already exists!',
          message: 'If you already have an account, please sign in.'
        };
        res.status(400).redirect('/sessions/new');
      } else {
        user.save(function (err) {
          if (err) {
            console.error('Saving new user error:\n', err);
            throw err;
          }
          req.session.message = {
            type: 'success',
            intro: `Welcome, ${user.name}!`,
            message: 'Enjoy your time at Acebook Pandas!'
          };
          req.session.user = user;
          res.status(201).redirect('/posts');
        });
      }
    });
  },

  ViewMe: (req, res) => {
    User.findById(req.params.id || 'Anonymous', (err, foundUser) => {
      if (err) {
        req.session.message = {
          type: 'danger',
          intro: 'User not found!',
          message: 'This user may no longer exist'
        };

        res.redirect('/posts');
      } else {
        Post.find({ poster: foundUser.email }, (err, posts) => {
          if (err) throw err;
          else {
            const resParams = {
              title: foundUser.name,
              user: foundUser,
              posts: posts
            };
            res.render('users/user', resParams);
          }
        });
      }
    });
  }
};

module.exports = UsersController;
