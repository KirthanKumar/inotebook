// Import necessary modules
const express = require("express");
const router = express.Router();
const ConfirmationCodeModel = require("../models/ConfirmationCodeModel");
const useragent = require("useragent");
const DeviceModel = require("../models/DeviceModel");
const User = require("../models/User")


router.post("/confirm-login", async (req, res) => {
  let success = false;
  try {
    const { confirmationCode } = req.body;

    // Find the confirmation code in the database
    const codeEntry = await ConfirmationCodeModel.findOne({
      confirmationCode: confirmationCode,
    });

    console.log(codeEntry);

    if (!codeEntry) {
      return res
        .status(400)
        .json({ error: "Invalid confirmation code.", success });
    }

    // Check if the confirmation code has expired
    const currentTime = new Date();
    const otpExpirationTime = new Date(codeEntry.createdAt);
    otpExpirationTime.setMinutes(otpExpirationTime.getMinutes() + 10);

    console.log(otpExpirationTime < currentTime);

    if (otpExpirationTime < currentTime) {
      // If the code has expired, return an error
      return res
        .status(400)
        .json({ error: "Confirmation code has expired.", success });
    }

    // Perform any additional actions (e.g., updating device details)
    // Here you may update the device details with the new information

    // Extract browser information from the request headers
    const userAgentString = req.headers["user-agent"];
    const agent = useragent.parse(userAgentString);

    console.log(codeEntry.email);

    const user = await User.findOne({ email: codeEntry.email });
    console.log(user);

    const newDevice = await DeviceModel.findOne({ user: user._id });

    newDevice.os = agent.os.toString();
    newDevice.browser = agent.toAgent();
    newDevice.version = agent.toVersion();
    newDevice.ipAddress = req.ip;
    console.log(newDevice.os, newDevice.browser, newDevice.version, newDevice.ipAddress);

    // Save the updated confirmation code entry
    await newDevice.save();

    success = true;
    res.status(200).json({ message: "Login confirmed successfully.", success });
  } catch (error) {
    console.error("Error confirming login:", error);
    res.status(500).json({ error: "Internal server error.", success });
  }
});

module.exports = router;
