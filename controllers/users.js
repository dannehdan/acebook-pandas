var User = require('../models/user');

var UsersController = {
  New: function(req, res) {
    res.render('users/new', {});
  },

  Create: function(req, res) {
    var user = new User(req.body);
    user.save(function(err) {
      if (err) { throw err; }
      res.status(201).redirect('/posts');
    });
  },

  EditProfilePic:  (req, res) => {
    console.log("REQUEST FROM /upload (files):\n", req.files);
    let sampleFile = req.files.img;
    let uploadPath = 'public/images/usersprofile/' + sampleFile.name;
    sampleFile.mv(uploadPath, function(err) {
      if (err) {
        return res.status(500).send(err);
      }
      res.send('File uploaded!');
    });
  },

  Profile:  (req, res) => {
    res.render('users/editprofile');
  }
};

module.exports = UsersController;
