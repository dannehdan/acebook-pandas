var Post = require('../models/post');
const User = require('../models/user');

var timeDifference = require('../js_helpers');

const { Storage } = require('@google-cloud/storage');
const path = require('path');

const fs = require('fs');

const gc = new Storage({
  keyFilename:
    process.env.GCLOUD_ACCESS_TOKEN ||
    path.resolve('', 'acebook-pandas-058c2fa6bf72.json'),
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
  await acebookBucket.upload(image.path, {
    destination: `post-images/${image.name}`
  });
  const imagePath = `http://acebook-pandas-images.storage.googleapis.com/post-images/${image.name}`;

  console.log(`file uploaded to ${imagePath}`);

  return imagePath;
}

var PostsController = {
  Index: function (req, res) {
    Post.aggregate([
      {
        $lookup: {
          from: User.collection.name,
          localField: 'poster',
          foreignField: 'email',
          as: 'posterName'
        }
      }
    ])
      .sort({ createdAt: 'desc' })
      .exec(function (err, aggregateRes) {
        if (err) {
          throw err;
        } else {
          let formattedPosts = aggregateRes.map(post => {
            let date = new Date(post.createdAt);
            post.dateString = timeDifference(date);
            if (post.likes == undefined) {
              post.likes = [];
            }
            return {
              ...post,
              posterName: post.posterName[0]
                ? post.posterName[0].name
                : 'Unknown User',
              postLikes: post.likes.length,
              postLiked: post.likes.includes(req.session.user.email)
            };
          });
          res.render('posts/index', {
            posts: formattedPosts,
            title: 'Posts',
            user: req.session.user
          });
        }
      });

    // Post.find(function(err, posts) {
    //     if (err) {
    //         throw err;
    //     }
    //     console.log(posts);
    //     res.render('posts/index', { posts: posts, title: "Posts" });
    // }).sort({ createdAt: 'desc' });
  },

  New: function (req, res) {
    res.render('posts/new', { title: 'New Post' });
  },

  Create: function (req, res) {
    req.body.poster = req.session.user.email;

    if (req.files && req.files.image) {
      const img = req.files.image;

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
      post.save(err => {
        if (err) {
          throw err;
        }
        res.status(201).redirect('/posts');
      });
    }
  },
  Like: async function (req) {
    const likerEmail = req.session.user.email;
    const postId = req.body.postId;
    const postLikes = await Post.findOne({ _id: postId }).then(post => {
      return post.likes;
    });
    if (postLikes.includes(likerEmail)) {
      Post.updateOne({ _id: postId }, { $pull: { likes: likerEmail } }).then(
        response => {
          return response;
        }
      );
    } else {
      Post.updateOne({ _id: postId }, { $push: { likes: likerEmail } }).then(
        response => {
          return response;
        }
      );
    }
  }
};

module.exports = PostsController;
