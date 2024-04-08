const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchUser");

const JWT_SECRET = "whatsoever";

require("dotenv").config();

// Route 1 : Creating a user using : POST "/api/auth/createUser". No login required
// router.post(
//   "/createUser",
//   [
//     body("name", "Enter a valid name").isLength({ min: 3 }),
//     body("email", "Enter a valid email").isEmail(),
//     body("password", "Password must be atleast 5 characters long").isLength({
//       min: 5,
//     }),
//   ],
//   async (req, res) => {
//     let success = false;
//     //   if there are errors return bad request and the errors
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({success, errors: errors.array() });
//       }

//       // check whether the user with this email exists already
//       let user = await User.findOne({ email: req.body.email });
//       if (user) {
//         return res
//           .status(400)
//           .json({success, error: "Sorry a user with this email already exists" });
//       }

// const salt = await bcrypt.genSalt(10);
// const secPass = await bcrypt.hash(req.body.password, salt); // we do await as it returns promise

// user = await User.create({
//   name: req.body.name,
//   email: req.body.email,
//   password: secPass,
// });

// const data = {
//   user: {
//     id: user.id,
//   },
// };
// const authToken = jwt.sign(data, JWT_SECRET);
// //   console.log(authToken);
// success = true;
//       res.json({success, authToken });
//     } catch (error) {
//       console.log(error.message);
//       res.status(500).send("Some Error Occured");
//     }
//   }
// );

// Route 2 : Authenticate a user using : POST "/api/auth/login". No login required
const DeviceModel = require("../models/DeviceModel");
// const { useNavigate } = require("react-router-dom");
const confirmationCodeModel = require("../models/ConfirmationCodeModel");
const useragent = require("useragent");
const nodemailer = require("nodemailer");

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters long").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;

    //   if there are errors return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }
      console.log(user);

      const passwordCompare = await bcrypt.compare(password, user.password);

      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }

      const data = { user: { id: user.id } };
      const authtoken = jwt.sign(data, JWT_SECRET);
      console.log(authtoken);

      // =================================
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

      // const navigate = useNavigate();

      console.log(user);

      const device = await DeviceModel.findOne({
        os,
        browser,
        version: version,
        user: user._id,
      });

      console.log(device);

      if (!device) {
        // res.json({
        //   success,
        //   authtoken,
        //   email: req.body.email,
        //   name: user.name,
        // });

        // navigate("/confirmLogin");
        // res.send("Login from unrecognized device.");

        // Generate a random password reset token
        const confirmationCode = Math.random().toString(36).substring(2, 8);

        // Update user's resetPasswordToken and resetPasswordExpires fields
        await confirmationCodeModel.create({
          email: req.body.email,
          confirmationCode: confirmationCode,
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
          text: `Your confirmation code for login verification is: ${confirmationCode}. This confirmation code is valid for 10 minutes. Visit https://kirthankumar.github.io/inotebook/#/confirmlogin and enter the code.`,
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
          return res.status(200).json({
            success,
            message:
              "Confirmation code has been sent to your email for verification.",
          });
        });
      }

      // -------------------------------------
      if (device) {
        success = true;

        res.json({
          success,
          authtoken,
          email: req.body.email,
          name: user.name,
        });
      }

    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 3 : Get logged in user details : POST "api/auth/getUser". Login required
router.post("/getUser", fetchuser, async (req, res) => {
  // first the middleware function in second argument is run after that the function in third argument is run
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
