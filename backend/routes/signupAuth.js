const otpGenerator = require("otp-generator");

const express = require("express");
const User = require("../models/User");
const router = express.Router();
const nodemailer = require("nodemailer");

const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchUser");

const JWT_SECRET = "whatsoever";
const OTPModel = require("../models/OTPModel"); // Assuming you have a model for OTPs

require("dotenv").config();

// router - 1
router.post(
  "/createUser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters long").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;

    // if there are errors return bad request and the errors
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
      }

      // Check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          success,
          error: "Sorry, a user with this email already exists",
        });
      }

      // if otp is already present in database delete it and generate new one
      let otpAlreadyAvailable = await OTPModel.findOne({
        email: req.body.email,
      });
      otpAlreadyAvailable &&
        (await otpAlreadyAvailable.deleteOne({ email: req.body.email }));

      // Generate OTP
      const otp = otpGenerator.generate(6, {
        upperCase: false,
        specialChars: false,
        alphabets: false,
      });

      // Save OTP with user email in database (you should have a separate OTP collection for this)
      await OTPModel.create({
        email: req.body.email,
        otp: otp,
        createdAt: new Date(),
      });

      // Send OTP via email
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

      const mailOptions = {
        from: "iNotebook",
        to: req.body.email,
        subject: "Email Verification OTP",
        text: `Your OTP for email verification is: ${otp}. This OTP is valid for 10 minutes.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            success,
            error: "Failed to send email. Please try again later." + error,
          });
        }
        console.log("Email sent: " + info.response);
        success = true;
        res.status(200).json({
          success,
          message: "OTP has been sent to your email for verification.",
        });
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Some Error Occurred" + error);
    }
  }
);

// const express = require("express");
// const router = express.Router();
const DeviceModel = require("../models/DeviceModel");
const useragent = require("useragent");

// router - 2
router.post("/verifyOTP", async (req, res) => {
  let success = false;
  try {
    // Extract browser information from the request headers
    const userAgentString = req.headers["user-agent"];
    const agent = useragent.parse(userAgentString);
    console.log(agent);
    // Extracting OS, version, browser and ipAddress
    const os = agent.os.toString();
    const browser = agent.toAgent();
    const version = agent.toVersion();
    const ipAddress = req.ip;

    console.log(os);
    console.log(browser);
    console.log(version);
    console.log(ipAddress);

    // Create a new Device document with the extracted information
    const newDevice = new DeviceModel({
      os,
      browser,
      version: version,
      ipAddress: ipAddress,
      // user: req.user.id,
    });

    console.log(newDevice);
    await newDevice.save();

    // ----------------

    const { email, otp } = req.body;

    // Find the OTP from the database based on the email
    const otpRecord = await OTPModel.findOne({ email });
    console.log(otpRecord);

    if (!otpRecord) {
      return res
        .status(404)
        .json({ error: "No OTP record found for this email" });
    }

    // Check if the entered OTP matches the one in the database
    if (otp === otpRecord.otp) {
      // Check if the OTP is still valid (within 10 minutes window)
      console.log(true);
      const currentTime = new Date();
      const otpExpirationTime = new Date(otpRecord.createdAt);
      otpExpirationTime.setMinutes(otpExpirationTime.getMinutes() + 10);

      if (currentTime < otpExpirationTime) {
        console.log(true);
        // Creating user
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt); // we do await as it returns promise

        const user = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: secPass,
        });

        const data = {
          user: {
            id: user.id,
          },
        };
        const authToken = jwt.sign(data, JWT_SECRET);
        //   console.log(authToken);

        newDevice.user = user._id;
        await newDevice.save();

        await OTPModel.deleteOne({ otp });
        success = true;

        return res.status(200).json({
          success,
          message:
            "OTP has been been verified successfully. And user created with auth token " +
            authToken,
          authToken: authToken,
          email: req.body.email,
          name: req.body.name,
        });
      } else {
        return res.status(400).json({
          error: "OTP has expired. Please request a new one.",
          success,
        });
      }
    } else {
      return res
        .status(400) // bad request
        .json({ error: "Invalid OTP. Please try again. " + otp });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error" + error);
  }
});

module.exports = router;
