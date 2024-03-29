const { default: mongoose } = require("mongoose");

import mongoose from "mongoose";
const { Schema } = mongoose;

const notesSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true},
  tag: { type: String, default: "General"},
  date: { type: Date, default: Date.now }, // should not do Date.now() instead should only specify function which should run when a document will get inserted to mongo. So do Date.now
});

module.exports = mongoose.model("notes", notesSchema);
