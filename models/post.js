var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema(
  {
    message: { type: String, default: 'no message given' },
    imageLink: String,
    poster: String,
    likes: Array
  },
  { timestamps: true }
);

var Post = mongoose.model('Post', PostSchema);

module.exports = Post;
