const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const User = require("../models/User"); // Assuming you have a User model defined

// Route for handling forgot password request
router.post("/forgotpassword", async (req, res) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(404)
        .json({ error: "User with this email does not exist" });
    }

    // Generate a random password reset token
    const token = Math.random().toString(36).substr(2, 8);

    // Update user's resetPasswordToken and resetPasswordExpires fields
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "yourEmailAddress@gmail.com", // Enter your email address
        pass: "yourEmailPassword", // Enter your email password or app-specific password
      },
    });

    // Email content
    const mailOptions = {
      from: "yourEmailAddress@gmail.com",
      to: user.email,
      subject: "Password Reset Request",
      text:
        `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
        `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
        `http://${req.headers.host}/resetpassword/${token}\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .json({ error: "Failed to send email. Please try again later." });
      }
      console.log("Email sent: " + info.response);
      res.status(200).json({ message: "Password reset email has been sent." });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
