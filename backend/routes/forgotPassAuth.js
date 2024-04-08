const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const User = require("../models/User"); // Assuming you have a User model defined
const PasswordResetModel = require("../models/PasswordResetModel");

require("dotenv").config();

// Route for handling forgot password request
router.post("/forgotpassword", async (req, res) => {
  const success = false;

  try {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email });
    console.log(user);

    if (!user) {
      return res
        .status(404)
        .json({ error: "User with this email does not exist" });
    }

    // Generate a random password reset token
    const token = Math.random().toString(36).substring(2, 8);

    // Update user's resetPasswordToken and resetPasswordExpires fields
    await PasswordResetModel.create({ email: req.body.email, token: token });

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      tls: {
        rejectUnauthorized: false, // Disables SSL certificate verification
      },
      auth: {
        user: "testingmernapp@gmail.com", // Enter your email address
        pass: "enfz hdqk kvwk janp", // Enter your email password or app-specific password
      },
    });

    // Email content
    const mailOptions = {
      from: "iNotebook",
      to: user.email,
      subject: "Password Reset Request",
      text:
        `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
        `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
        `https://kirthankumar.github.io/inotebook/#/resetpassword/${token}\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          success,
          error: "Failed to send email. Please try again later.",
        });
      }
      console.log("Email sent: " + info.response);
      success = true;
      res.status(200).json({
        success,
        message: "Password reset email has been sent.",
        token: token,
        email: req.body.email,
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success, error: "Server error" });
  }
});

const bcrypt = require("bcryptjs");

// Route for handling reset password request
router.post("/resetpassword/:token", async (req, res) => {
  let success = false;
  try {
    const { token } = req.params;
    console.log(token);

    // Find the password reset token
    const passwordResetToken = await PasswordResetModel.findOne({ token });
    console.log(passwordResetToken);
    console.log(passwordResetToken.expires < Date.now());
    console.log(passwordResetToken.expires);
    console.log(Date.now());

    if (!passwordResetToken || passwordResetToken.expires < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired token. " });
    }

    // Find the user by email
    const user = await User.findOne({ email: passwordResetToken.email });
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    // Update user's password
    user.password = secPass;
    await user.save();

    // Delete the password reset token
    await PasswordResetModel.deleteOne({ token });

    success = true;

    res
      .status(200)
      .json({ success, message: "Password has been reset successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
