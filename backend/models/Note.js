const { default: mongoose } = require("mongoose");

const { Schema } = mongoose;

const notesSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, // this is like foreign key in mysql. This is done to associate notes with the user
  title: { type: String, required: true },
  description: { type: String, required: true },
  tag: { type: String, default: "General" },
  date: { type: Date, default: Date.now }, // should not do Date.now() instead should only specify function which should run when a document will get inserted to mongo. So do Date.now
});

module.exports = mongoose.model("notes", notesSchema);
