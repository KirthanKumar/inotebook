// passwordResetModel.js
const mongoose = require("mongoose");

const PasswordResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expires: {
    type: Date,
    required: true,
    default: () => Date.now() + 600 * 1000, // Token expires in 10 minutes
  },
});

const PasswordResetModel = mongoose.model(
  "passwordresetmodel",
  PasswordResetSchema
);

module.exports = PasswordResetModel;
