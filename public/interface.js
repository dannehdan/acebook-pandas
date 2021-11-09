// eslint-disable-next-line no-unused-vars
var addLike = id => {
  const likeUrl = '/posts/testLikes';
  const data = { postId: id };

  fetch(likeUrl, {
    method: 'PATCH', // or 'PUT'
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });

  // fetch(likeUrl).then((data) => { return data.json() }).then((res) => console.log(res));

  if (
    document.getElementById('like-' + id).querySelector('.like-text')
      .innerText == 'Like'
  ) {
    //send like to DB
    document
      .getElementById('like-' + id)
      .querySelector('.like-text').innerText = 'Liked';
    let count = document
      .getElementById('like-' + id)
      .querySelector('.like-number').innerText;
    document
      .getElementById('like-' + id)
      .querySelector('.like-number').innerText = Number(count) + 1;
  } else {
    //remove like from DB
    document
      .getElementById('like-' + id)
      .querySelector('.like-text').innerText = 'Like';
    let count = document
      .getElementById('like-' + id)
      .querySelector('.like-number').innerText;
    document
      .getElementById('like-' + id)
      .querySelector('.like-number').innerText = Number(count) - 1;
  }
  addComment(id);
};

// eslint-disable-next-line no-unused-vars
var handleCommentLike = id => {
  const likeUrl = '/posts/testCommentsLike';
  const data = { commentId: id };

  fetch(likeUrl, {
    method: 'PATCH', // or 'PUT'
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });

  // fetch(likeUrl).then((data) => { return data.json() }).then((res) => console.log(res));

  if (
    document.getElementById('comment-' + id).querySelector('.like-text')
      .innerText == 'Like'
  ) {
    //send like to DB
    document
      .getElementById('comment-' + id)
      .querySelector('.like-text').innerText = 'Liked';
    let count = document
      .getElementById('comment-' + id)
      .querySelector('.like-number').innerText;
    document
      .getElementById('comment-' + id)
      .querySelector('.like-number').innerText = Number(count) + 1;
  } else {
    //remove like from DB
    document
      .getElementById('comment-' + id)
      .querySelector('.like-text').innerText = 'Like';
    let count = document
      .getElementById('comment-' + id)
      .querySelector('.like-number').innerText;
    document
      .getElementById('comment-' + id)
      .querySelector('.like-number').innerText = Number(count) - 1;
  }
};

// eslint-disable-next-line no-unused-vars
var addComment = id => {
  const commentUrl = '/posts/testComments';
  const data = {
    postId: id,
    message: document.getElementById('comment-text-for-' + id).innerText
  };
  console.log(data.message);
  fetch(commentUrl, {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      // location.reload();
    })
    .catch(error => {
      console.error('Error:', error);
    });
};
