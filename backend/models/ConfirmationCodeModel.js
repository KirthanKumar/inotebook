const mongoose = require("mongoose");

const confirmationCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  confirmationCode: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // TTL (Time-To-Live) for 10 minutes
  },
});

const confirmationCodeModel = mongoose.model("Code", confirmationCodeSchema);

module.exports = confirmationCodeModel;
