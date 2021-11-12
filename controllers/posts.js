var Post = require('../models/post');
var Comment = require('../models/comment');
const User = require('../models/user');

var timeDifference = require('../js_helpers');

const { Storage } = require('@google-cloud/storage');
const path = require('path');

const fs = require('fs');
const os = require('os');

const { nanoid } = require('nanoid');

const fetch = require('node-fetch');

const createCredentialsJSON = async function () {
  if (process.env.GCLOUD_ACCESS_LINK) {
    fetch(process.env.GCLOUD_ACCESS_LINK)
      .then(result => {
        return result.json();
      })
      .then(data => {
        fs.writeFile(
          path.join(os.tmpdir(), 'credentials.json'),
          JSON.stringify(data),
          function (err) {
            if (err)
              console.error('Creating Google Cloud cregentials error:\n', err);
          }
        );
      });
  }
};
createCredentialsJSON();

const gc = new Storage({
  keyFilename: path.resolve(os.tmpdir(), 'credentials.json'),
  projectId: 'acebook-pandas'
});

const acebookBucket = gc.bucket('acebook-pandas-images');

async function uploadImage(image) {
  await acebookBucket.upload(image.path, {
    destination: `post-images/${image.name}`
  });

  const imagePath = `http://acebook-pandas-images.storage.googleapis.com/post-images/${image.name}`;

  return imagePath;
}

var PostsController = {
  Index: function (req, res) {
    var scrollTo = req.query.scroll_to;

    Post.aggregate([
      {
        // Get poster for their name
        $lookup: {
          from: User.collection.name,
          localField: 'poster',
          foreignField: 'email',
          as: 'posterInfo'
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
          posterInfo: { $first: '$posterInfo' },
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
          posterInfo: 1,
          updatedAt: 1,
          createdAt: 1,
          likes: 1,
          imageLink: 1,
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
          console.error('Posts aggregating error:\n', err);
          throw err;
        } else {
          let formattedPosts = aggregateRes.map(post => {
            post.dateString = timeDifference(new Date(post.createdAt));

            // sort comments by date
            post.comments = post.comments.sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt);
            });

            post.comments.forEach((comment, index) => {
              comment.dateString = timeDifference(new Date(comment.createdAt));

              // hide older comments, if more than two
              comment.toCollapse = index > 1;

              // is comment liked by current user?
              comment.commentLiked = comment.likes.includes(
                req.session.user.email
              );

              comment.commentLikes = comment.likes.length;

              comment.commenterName = comment.commenterInfo.length
                ? comment.commenterInfo[0].name
                : 'Anonymous';
            });

            post.needsCommentExpander = post.comments.length > 2;

            post.likes = post.likes || [];
            console.log(post.posterInfo);
            return {
              ...post,
              posterName: post.posterInfo[0]
                ? post.posterInfo[0].name
                : 'Anonymous',
              posterId: post.posterInfo[0]
                ? post.posterInfo[0]._id
                : 'Anonymous',
              postLikes: post.likes.length,
              postLiked: post.likes.includes(req.session.user.email)
            };
          });

          const resParams = {
            posts: formattedPosts,
            title: 'Posts',
            user: req.session.user
          };

          if (scrollTo) {
            resParams.scrollToComment = scrollTo;
          }

          res.render('posts/index', resParams);
        }
      });
  },

  Search: function (req, res) {
    const searchValue = req.query.search_value;
    const searchType = req.query.search_type;

    Post.aggregate([
      {
        // Get poster for their name
        $lookup: {
          from: User.collection.name,
          localField: 'poster',
          foreignField: 'email',
          as: 'posterInfo'
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
          posterInfo: { $first: '$posterInfo' },
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
          posterInfo: 1,
          updatedAt: 1,
          createdAt: 1,
          likes: 1,
          imageLink: 1,
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
          let filteredPosts = aggregateRes.filter(post => {
            switch (searchType) {
              case 'content':
                return post.message && post.message.includes(searchValue);
              case 'author':
                return (
                  post.posterInfo[0] &&
                  post.posterInfo[0].name.includes(searchValue)
                );
              // return post.posterInfo[0] && post.posterInfo[0].name && post.posterInfo[0].name.includes(searchValue);
              default:
                return false;
            }
          });
          let formattedPosts = filteredPosts.map(post => {
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
              posterName: post.posterInfo[0]
                ? post.posterInfo[0].name
                : 'Anonymous',
              postLikes: post.likes.length,
              postLiked: post.likes.includes(req.session.user.email)
            };
          });
          const resParams = {
            posts: formattedPosts,
            title: 'Posts',
            user: req.session.user
          };

          res.render('posts/search', resParams);
        }
      });
  },

  Create: function (req, res) {
    req.body.poster = req.session.user.email;

    if (req.files && req.files.image && req.files.image.size) {
      const img = req.files.image;

      // remove spaces
      img.name = img.name.replaceAll(/\s/g, '_');

      // keep image extension (like .jpeg) to later append onto the unique image name
      const imageNameExtension = img.name.split('.').pop();

      // nanoid returns random string, and append the original image extension onto it
      img.name = `${nanoid()}.${imageNameExtension}`;

      uploadImage(img)
        .then(result => {
          req.body.imageLink = result;
          const post = new Post(req.body);

          fs.rmSync(img.path);

          post.save(function (err) {
            if (err) {
              console.error('Post saving error:\n', err);
              throw err;
            }

            res.status(201).redirect('/posts');
          });
        })
        .catch(err => console.error('Uploading image error:\n', err));
    } else {
      const post = new Post(req.body);
      fs.rmSync(req.files.image.path);
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
    const postLikes = await Post.findOne({ _id: postId }).then(
      post => post.likes
    );
    const action = postLikes.includes(likerEmail)
      ? { $pull: { likes: likerEmail } }
      : { $push: { likes: likerEmail } };

    Post.updateOne({ _id: postId }, action).then(result => {
      res.send(result);
    });
  }
};

module.exports = PostsController;
