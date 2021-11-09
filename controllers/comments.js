var Comment = require('../models/comment');

var CommentsController = {
  Create: function (req, res) {
    req.body.poster = req.session.user.email;
    console.log(req.body.message);
    const comment = new Comment(req.body);

    comment.save(err => {
      if (err) {
        throw err;
      }
      //  res.status(201).send({ message: 'Comment Added' });
      res.redirect('/posts');
    });
  },
  Like: async function (req, res) {
    const likerEmail = req.session.user.email;
    const commentId = req.body.commentId;
    const commentLikes = await Comment.findOne({ _id: commentId }).then(
      comment => {
        return comment.likes;
      }
    );
    if (commentLikes.includes(likerEmail)) {
      Comment.updateOne(
        { _id: commentId },
        { $pull: { likes: likerEmail } }
      ).then(response => {
        res.send(response);
      });
    } else {
      Comment.updateOne(
        { _id: commentId },
        { $push: { likes: likerEmail } }
      ).then(response => {
        res.send(response);
      });
    }
  }
};

module.exports = CommentsController;
