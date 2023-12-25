const express = require("express");
const router  = express.Router();

router.get("/", (req, res) => {
  res.send("Get Users");
});

router.get("/:id", (req, res) => {
  res.send("Get for show user");
});

router.post("/", (req, res) => {
  res.send("Post for show user");
});

router.delete("/:id", (req, res) => {
  res.send("Delete for show user");
});


module.exports = router;