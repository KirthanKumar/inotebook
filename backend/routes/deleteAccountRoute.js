// Import necessary modules
const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchUser");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const DeviceModel = require("../models/DeviceModel");

// Route for deleting user account
router.delete("/deleteAccount", fetchuser, async (req, res) => {
  let success = false;
  try {
    // Extract user ID from request
    const userId = req.user.id;

    // Find user by ID
    const user = await User.findById(userId);
    console.log(user);
    const userDevice = await DeviceModel.find({ user:userId });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: "User not found", success });
    }

    // Check if the provided password matches the user's password
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: "Password is required", success });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password", success });
    }

    // If password matches, delete the user account
    await User.deleteOne({_id: userId });
    await DeviceModel.deleteOne({ user: userId })

    success = true;
    res.status(200).json({ message: "Account deleted successfully", success });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error", success });
  }
});

module.exports = router;
