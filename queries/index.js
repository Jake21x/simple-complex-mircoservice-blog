const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { action, data } = req.body;

  if (action == "post-created") {
    const { id } = data;
    posts[id] = {
      ...data,
      comments: [],
    };
    console.log("post-created > ", posts, data);
  }

  if (action == "comment-created") {
    const { postid } = data;
    const post = posts[postid];

    console.log("comment-created > posts ", posts);
    console.log("comment-created > data ", data);
    console.log("comment-created > post", post);
    post.comments.push(data);
  }

  if (action == "comment-update") {
    const { postid, id, status, content } = data;
    const comments = posts[postid].comments;
    let comment = comments.find((r) => {
      return r.id === id;
    });
    comment.status = status;
    comment.content = content;

    console.log("comment-moderated > posts ", posts, postid, id, comment);
  }

  res.send({});
});

app.listen(9001, () => {
  console.log("queries running: ", 9001);
});
