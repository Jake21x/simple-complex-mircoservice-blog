const bodyParser = require("body-parser");
const express = require("express");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const blocked_words = ["https:", "http:", "file:"];

app.post("/events", async (req, res) => {
  const { action, data } = req.body;

  if (action == "comment-created") {
    const { content } = data;

    const raw = {
      ...data,
      status: blocked_words.find((r) => {
        return content.includes(r);
      })
        ? "rejected"
        : "approved",
    };

    await axios.post("http://localhost:8001/events", {
      action: "moderated-comment",
      data: raw,
    });

    console.log("moderated-comment >  ", raw);
  }
  res.send({});
});

app.listen(9002, () => {
  console.log("moderation running: ", 9002);
});
