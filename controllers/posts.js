var Post = require('../models/post');
var Comment = require('../models/comment');
const User = require('../models/user');

var { nanoid } = require('nanoid');
var timeDifference = require('../js_helpers');

var PostsController = {
  Index: function (req, res) {
    var scrollTo = req.query.scroll_to;
    // console.log("Scroll:", scrollTo);

    Post.aggregate([
      {
        // Get poster for their name
        $lookup: {
          from: User.collection.name,
          localField: 'poster',
          foreignField: 'email',
          as: 'posterName'
        }
      },
      {
        // Get comments linked to post
        $lookup: {
          from: Comment.collection.name,
          localField: '_id',
          foreignField: 'postId',
          as: 'comments'
        }
      },
      {
        $unwind: {
          path: '$comments',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: User.collection.name,
          localField: 'comments.poster',
          foreignField: 'email',
          as: 'comments.commenterInfo'
        }
      },
      {
        $sort: { 'comments.createdAt': -1 }
      },
      {
        $group: {
          _id: '$_id',
          message: { $first: '$message' },
          poster: { $first: '$poster' },
          posterName: { $first: '$posterName' },
          updatedAt: { $first: '$updatedAt' },
          createdAt: { $first: '$createdAt' },
          likes: { $first: '$likes' },
          comments: { $push: '$comments' },
          imageLink: { $first: '$imageLink' }
        }
      },
      {
        $project: {
          _id: 1,
          message: 1,
          poster: 1,
          posterName: 1,
          updatedAt: 1,
          createdAt: 1,
          likes: 1,
          imageLink: 1,
          // comments: 1
          comments: {
            $filter: {
              input: '$comments',
              as: 'c',
              cond: { $ifNull: ['$$c._id', false] }
            }
          }
        }
      }
    ])
      .sort({ createdAt: 'desc' })
      .exec(function (err, aggregateRes) {
        if (err) {
          throw err;
        } else {
          // console.log(aggregateRes.map(post => {
          // let comments = post.comments;
          // let commenters = [];
          // comments.forEach(function(comment) {
          //     commenters.push(JSON.stringify(comment.commenterInfo));
          // });
          // return commenters;
          // }));
          let formattedPosts = aggregateRes.map(post => {
            let date = new Date(post.createdAt);
            post.dateString = timeDifference(date);

            post.comments = post.comments.sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt);
            });
            post.comments.forEach(comment => {
              let date = new Date(comment.createdAt);
              comment.dateString = timeDifference(date);
              comment.toCollapse = post.comments.indexOf(comment) > 1;
              comment.commentLiked = comment.likes.includes(
                req.session.user.email
              );
              comment.commentLikes = comment.likes.length;
              // comment.posterInfo = await User.findOne({
              //     email: comment.poster
              // }).exec();
              // console.log(comment.commenterInfo);

              if (comment.commenterInfo.length < 1) {
                comment.commenterName = 'Anonymous';
              } else {
                comment.commenterName = comment.commenterInfo[0].name;
              }
            });
            post.needsCommentExpander = post.comments.length > 2;

            post.likes = post.likes === undefined ? [] : post.likes;
            return {
              ...post,
              posterName: post.posterName[0]
                ? post.posterName[0].name
                : 'Anonymous',
              postLikes: post.likes.length,
              postLiked: post.likes.includes(req.session.user.email)
            };
          });
          const resParams = { posts: formattedPosts, title: 'Posts' };
          if (scrollTo) {
            resParams.scrollToComment = scrollTo;
          }

          res.render('posts/index', resParams);
        }
      });
  },

  New: function (req, res) {
    res.render('posts/new', { title: 'New Post' });
  },

  Create: function (req, res) {
    // console.log(req);
    req.body.poster = req.session.user.email;
    // console.log(req.body.poster);

    if (req.files && req.files.image) {
      const img = req.files.image;
      img.name = img.name.replaceAll(/\s/g, '_');
      // keep image extension (like .jpeg) to later append onto the unique image name
      const imageNameExtension = img.name.split('.')[1];
      // nanoid returns random string, and append the original image extension onto it
      img.name = `${nanoid()}.${imageNameExtension}`;
      const uploadPath = `/images/post_imgs/${img.name}`;
      img.mv(`public${uploadPath}`, function (err) {
        if (err) {
          return res.status(500).send(err);
        }
        req.body.imageLink = uploadPath;
        const post = new Post(req.body);
        post.save(function (err) {
          if (err) {
            throw err;
          }

          res.status(201).redirect('/posts');
        });
      });
    } else {
      const post = new Post(req.body);
      post.save(err => {
        if (err) {
          throw err;
        }
        res.status(201).redirect('/posts');
      });
    }
  },
  Like: async function (req, res) {
    const likerEmail = req.session.user.email;
    const postId = req.body.postId;
    const postLikes = await Post.findOne({ _id: postId }).then(post => {
      return post.likes;
    });
    if (postLikes.includes(likerEmail)) {
      Post.updateOne({ _id: postId }, { $pull: { likes: likerEmail } }).then(
        response => {
          res.send(response);
        }
      );
    } else {
      Post.updateOne({ _id: postId }, { $push: { likes: likerEmail } }).then(
        response => {
          res.send(response);
        }
      );
    }
  }
};

module.exports = PostsController;
