var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
    message: String,
    imageLink: String,
    poster: String
}, { timestamps: true });

var Post = mongoose.model('Post', PostSchema);

module.exports = Post;