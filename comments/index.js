const { randomBytes } = require("crypto");
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const postComments = {};

app.get("/posts/:id/comments", (req, res) => {
  const comments = postComments[req.params.id] || [];
  res.send(comments);
});

app.post("/posts/:id/comments", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = postComments[req.params.id] || [];
  const raw = {
    id,
    content,
    postid: req.params.id,
    status: "pending",
    like: 0,
    created_at: new Date().toISOString(),
  };
  comments.push(raw);
  postComments[req.params.id] = comments;

  await axios.post("http://localhost:9000/events", {
    action: "comment-created",
    data: raw,
  });

  res.status(201).send(comments);
});

app.post("/events", (req, res) => {
  const { action, data } = req.body;

  if (action == "moderated-comment") {
    const { postid, id, status, content } = data;
    const comments = postComments[postid];
    let comment = comments.find((r) => {
      return r.id === id;
    });
    comment.status = status;
    comment.content = content;

    console.log("comment-moderated", data);

    axios.post("http://localhost:9000/events", {
      action: "comment-update",
      data: comment,
    });
  }

  res.send({});
});

app.listen(8001, () => {
  console.log("comments running: ", 8001);
});
