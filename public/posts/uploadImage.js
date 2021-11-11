// // const img = document.getElementById("post-img");
// const UPLOAD_URL = "https://api.imgur.com/3/upload";
// const CLIENT_ID = "50568a11aeca3cf";

// // img.addEventListener("change", () => {

// // })

// // img.addEventListener('change', function() {
// //     var file = img.files[0];

// //     upload(file, (response) => {
// //         console.log("[+] Success uploading!");
// //         console.log(response);
// //         // let res = JSON.parse(this.responseText);

// //         console.log("Link: " + response.data.link);
// //     });
// // });

// // var upload = function(file, cb) {
// //     // Form data
// //     let fd = new FormData();
// //     fd.append("image", file, file.name);

// //     // AJAX Request
// //     let xhr = new XMLHttpRequest();
// //     xhr.addEventListener("load", cb);
// //     xhr.open("POST", UPLOAD_URL);
// //     // Send authentication headers.
// //     xhr.setRequestHeader("Authorization", "Client-ID " + CLIENT_ID);
// //     // Send form data
// //     xhr.send(fd);
// // };

// var injectUrl = function() {
//     console.log("[+] Success uploading!");
//     let res = JSON.parse(this.responseText);
//     // imgPrevDiv.setAttribute("src", res.data.link);
//     console.log(res.data.link);
//     // urlPrev.value = res.data.link;
// };

// /**
//  * Should be called onchange="uploadToImgur.call(this)" on a file input
//  * element.
//  */
// // eslint-disable-next-line no-unused-vars
// var uploadToImgur = function() {
//     if ('files' in this && this.files.length > 0)
//         upload(this.files[0], injectUrl);
// };

// var upload = function(file, cb) {
//     console.log("Attempting upload");
//     // empty url prev data
//     // urlPrev.value = "";
//     // Get client id on change
//     // var CLIENT_ID = CLIENT_ID_HARD || document.querySelector("#client-id").value;

//     // if (CLIENT_ID.length < 1) {
//     //     throw new Error("I need a client Id!");
//     // }

//     // Form data
//     let fd = new FormData();
//     fd.append("image", file, file.name);

//     // AJAX Request
//     let xhr = new XMLHttpRequest();
//     xhr.addEventListener("load", cb);
//     xhr.open("POST", UPLOAD_URL);
//     // Send authentication headers.
//     xhr.setRequestHeader("Authorization", "Client-ID " + CLIENT_ID);
//     // Send form data
//     xhr.send(fd);
// };

// const img = document.getElementById("post-img");
// const CLIENT_ID = "50568a11aeca3cf";
// img.addEventListener("change", ev => {
//     const formdata = new FormData()
//     formdata.append("image", ev.target.files[0])
//     fetch("https://api.imgur.com/3/upload", {
//         method: "post",
//         headers: {
//             Authorization: "Client-ID " + CLIENT_ID
//         },
//         body: formdata
//     }).then(data => data.json()).then((err, response) => {
//         if (err) { console.log(err); } else {
//             console.log(response.data.link);
//         }
//     })
// })

// document.getElementById("post-img").onchange = () => {
//     const files = document.getElementById('post-img').files;
//     const file = files[0];
//     if (file == null) {
//         return alert('No file selected.');
//     }
//     getSignedRequest(file);
// };

// function getSignedRequest(file) {
//     const xhr = new XMLHttpRequest();
//     xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
//     xhr.onreadystatechange = () => {
//         if (xhr.readyState === 4) {
//             if (xhr.status === 200) {
//                 const response = JSON.parse(xhr.responseText);
//                 uploadFile(file, response.signedRequest, response.url);
//             } else {
//                 alert('Could not get signed URL.');
//             }
//         }
//     };
//     xhr.send();
// }

// function uploadFile(file, signedRequest, url) {
//     const xhr = new XMLHttpRequest();
//     xhr.open('PUT', signedRequest);
//     xhr.onreadystatechange = () => {
//         if (xhr.readyState === 4) {
//             if (xhr.status === 200) {
//                 console.log(url);
//             } else {
//                 alert('Could not upload file.');
//             }
//         }
//     };
//     xhr.send(file);
// }

// const img = document.getElementById("post-img");

// document.getElementById("post-img").onchange = () => {

// };
