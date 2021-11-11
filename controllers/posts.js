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
    // console.log(process.env.GCLOUD_ACCESS_TOKEN)
    fetch(process.env.GCLOUD_ACCESS_LINK)
      .then(response => {
        return response.json();
      })
      .then(data => {
        fs.writeFile(
          path.join(os.tmpdir(), 'credentials.json'),
          JSON.stringify(data),
          function (err) {
            if (err) console.error('error', err);
          }
        );
      });
  }
};

createCredentialsJSON();

// console.log(path.resolve(os.tmpdir(), 'credentials.json'));

const gc = new Storage({
  keyFilename: path.resolve(os.tmpdir(), 'credentials.json'),
  projectId: 'acebook-pandas'
});

const acebookBucket = gc.bucket('acebook-pandas-images');

// async function uploadFile(file) {
//     await acebookBucket.upload(path.join(tmpDir, file.name), {
//         destination: `post-images/${file.name}`
//     });
//     const filePath = `http://acebook-pandas-images.storage.googleapis.com/post-images/${file.name}`;

//     console.log(`file uploaded to ${filePath}`);

//     return filePath;
// }

async function uploadImage(image) {
  // console.log(image);
  // console.log(fs.existsSync(path.join(image.path)));
  await acebookBucket.upload(image.path, {
    destination: `post-images/${image.name}`
  });
  const imagePath = `http://acebook-pandas-images.storage.googleapis.com/post-images/${image.name}`;

  console.log(`file uploaded to ${imagePath}`);

  return imagePath;
}

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
    const search = req.query.search;

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
          let filteredPosts = aggregateRes.filter(post =>
            post.message.includes(search)
          );
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
              posterName: post.posterName[0]
                ? post.posterName[0].name
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
    // console.log(req);
    req.body.poster = req.session.user.email;

    if (req.files && req.files.image && req.files.image.size) {
      const img = req.files.image;

      img.name = img.name.replaceAll(/\s/g, '_');
      // keep image extension (like .jpeg) to later append onto the unique image name
      const imageNameExtension = img.name.split('.')[1];
      // nanoid returns random string, and append the original image extension onto it
      img.name = `${nanoid()}.${imageNameExtension}`;

      uploadImage(img)
        .then(response => {
          console.log('Upload path is: ' + response);
          req.body.imageLink = response;
          const post = new Post(req.body);

          fs.rmSync(img.path);

          post.save(function (err) {
            if (err) {
              console.log('Error here!');
              throw err;
            }

            res.status(201).redirect('/posts');
          });
        })
        .catch(e => console.error('Error here actually', e));
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
