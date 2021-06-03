const { randomBytes } = require("crypto");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const express = require("express");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  posts[id] = { id, title, like: 0, created_at: new Date().toISOString() };

  await axios.post("http://localhost:9000/events", {
    action: "post-created",
    data: posts[id],
  });

  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  const { action } = req.body;
  console.log("posts > event", action);
  res.send({});
});

app.listen(8000, () => {
  console.log("posts running: ", 8000);
});
