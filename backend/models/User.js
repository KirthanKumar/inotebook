const { default: mongoose } = require("mongoose");

import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique:true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now }, // should not do Date.now() instead should only specify function which should run when a document will get inserted to mongo. So do Date.now
});

module.exports = mongoose.model("user", userSchema);