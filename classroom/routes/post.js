const express = require("express");
const router = express.Router();

router.get("/posts", (req, res) => {
  res.send("Get Users");
});

router.get("/posts/:id", (req, res) => {
  res.send("Get for show user");
});

router.post("/posts", (req, res) => {
  res.send("Post for show user");
});

router.delete("/posts/:id", (req, res) => {
  res.send("Delete for show user");
});

module.exports = router;