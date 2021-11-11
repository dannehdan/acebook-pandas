var HomeController = {
  Index: function (req, res) {
    const resParams = { title: 'Acebook', user: req.session.user };
    res.render('home/index', resParams);
  }
};

module.exports = HomeController;
