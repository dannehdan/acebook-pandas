var mongoose = require('mongoose');
// var Post = require('../models/post');

var CommentSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    message: String,
    poster: String,
    likes: Array
  },
  { timestamps: true }
);

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
