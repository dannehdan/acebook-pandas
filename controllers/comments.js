var Comment = require('../models/comment');

var CommentsController = {
  Create: function (req, res) {
    req.body.poster = req.session.user.email;
    const comment = new Comment(req.body);

    comment.save(err => {
      if (err) {
        throw err;
      }
      const commentId = encodeURIComponent(comment._id);
      res.redirect('/posts?scroll_to=' + commentId);
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
    const action = commentLikes.includes(likerEmail) ? { $pull: { likes: likerEmail } } : { $push: { likes: likerEmail } };
    Comment.updateOne(
      { _id: commentId },
      action
    ).then(response => {
      res.send(response);
    });
  }
};

module.exports = CommentsController;
