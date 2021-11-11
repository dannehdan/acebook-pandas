const User = require('../models/user');
const bcrypt = require('bcrypt');

const SessionsController = {
  New: function (req, res) {
    if (req.session.user) {
      req.session.message = {
        type: 'warning',
        intro: `You are already logged in as ${req.session.user.name}!`,
        message: 'To switch user, please, log out first.'
      };
      res.redirect('/posts');
    } else {
      res.render('sessions/new', { title: 'Log In' });
    }
  },

  Create: function (req, res) {
    // trying to log in
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email }).then(async user => {
      if (!user) {
        req.session.message = {
          type: 'danger',
          intro: `User not found!`,
          message: 'If this is your first visit, please sign up first.'
        };
        return res.redirect('/sessions/new');
      }

      try {
        if (await bcrypt.compare(password, user.password)) {
          req.session.user = user;
          req.session.message = {
            type: 'success',
            intro: `Welcome back, ${user.name}!`,
            message: 'Lots has happened since you last visited!'
          };
          res.redirect('/posts');
        } else {
          req.session.message = {
            type: 'danger',
            intro: `Unsuccessful login!`,
            message: 'Are you sure you entered your password correctly?'
          };
          res.redirect('/sessions/new');
        }
      } catch (err) {
        res.status(500).send({ info: 'error', message: 'There was an error' });
      }
    });
  },

  Destroy: function (req, res) {
    if (req.session.user && req.cookies.user_sid) {
      res.clearCookie('user_sid');
    }
    res.redirect('/');
  }
};

module.exports = SessionsController;
