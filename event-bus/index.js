const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { default: axios } = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const eventstack = [];

app.post("/events", async (req, res) => {
  const evt = req.body;
  console.log("EventBus", evt);

  eventstack.push(evt);

  // for (let _evt in eventstack) {
  //   try {
  await axios.post("http://localhost:8000/events", evt); //post
  await axios.post("http://localhost:8001/events", evt); //comment
  await axios.post("http://localhost:9001/events", evt); //queries
  await axios.post("http://localhost:9002/events", evt); //moderator

  const index = eventstack.findIndex(_evt);
  eventstack.splice(index, 1);
  //   } catch (e) {
  //     console.log("error: event hold");
  //   }
  // }

  res.send({ status: "OK" });
});
app.listen(9000, () => {
  console.log("EventBus running", 9000);
});
