const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Creating a user using : POST "/api/auth/". Doesn't require Auth
router.get("/", (req, res) => {
  console.log(req.body);
  const user = User(req.body);
  user.save();
  res.json(req.body);
});

module.exports = router;
