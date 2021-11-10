var Post = require('../models/post');
const User = require('../models/user');

var { nanoid } = require('nanoid');
var timeDifference = require('../js_helpers');

const { Storage } = require('@google-cloud/storage');
const path = require('path');

const os = require('os');
const appPrefix = 'acebook-pandas';
const tmpDir = path.join(os.tmpdir(), appPrefix);

const gc = new Storage({
  keyFilename:
    process.env.GCLOUD_ACCESS_TOKEN ||
    path.resolve('', 'acebook-pandas-058c2fa6bf72.json'),
  projectId: 'acebook-pandas'
});

const acebookBucket = gc.bucket('acebook-pandas-images');

async function uploadFile(file) {
  await acebookBucket.upload(path.join(tmpDir, file.name), {
    destination: `post-images/${file.name}`
  });
  const filePath = `http://acebook-pandas-images.storage.googleapis.com/post-images/${file.name}`;

  console.log(`file uploaded to ${filePath}`);

  return filePath;
}

// eslint-disable-next-line node/no-extraneous-require
// var request = require('request');

// var stream = require("stream");

// var imgur = {
//     _clientID: "50568a11aeca3cf",
//     upload: async function(_image, _cb) {
//         console.log("hi");
//         if (this._clientID && _image) {
//             var options = {
//                 url: 'https://api.imgur.com/3/upload',
//                 headers: {
//                     'Authorization': 'Client-ID ' + this._clientID
//                 }
//             };
//             var post = request.post(options, function(err, req, body) {
//                 try {
//                     console.log(body);
//                     _cb(err, JSON.parse(body));
//                 } catch (e) {
//                     _cb(err, body);
//                 }
//             });
//             var upload = post.form();
//             upload.append('type', 'file');

//             const readable = new stream.Readable()
//             readable._read = () => {} // _read is required but you can noop it
//             readable.push(_image.data)
//             readable.push(null)

//             upload.append('image', readable);
//         }
//     }
// };

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
    // console.log(req.body.poster);

    if (req.files && req.files.image) {
      const img = req.files.image;
      console.log(img);

      // imgur.upload(img, function(err, res) {
      //     console.log(res.data.link); //log the imgur url
      // });

      img.name = img.name.replaceAll(/\s/g, '_');
      // keep image extension (like .jpeg) to later append onto the unique image name
      const imageNameExtension = img.name.split('.')[1];
      // nanoid returns random string, and append the original image extension onto it
      img.name = `${nanoid()}.${imageNameExtension}`;

      const uploadPath = `${img.name}`;

      img.mv(`${tmpDir}/${uploadPath}`, function (err) {
        if (err) {
          return res.status(500).send(err);
        }

        uploadFile(img)
          .then(response => {
            console.log('Upload path is: ' + response);
            req.body.imageLink = response;
            const post = new Post(req.body);

            post.save(function (err) {
              if (err) {
                throw err;
              }

              res.status(201).redirect('/posts');
            });
          })
          .catch(e => console.error(e));
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
