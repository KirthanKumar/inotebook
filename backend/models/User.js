const { default: mongoose } = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now }, // should not do Date.now() instead should only specify function which should run when a document will get inserted to mongo. So do Date.now
});

const User = mongoose.model("user", userSchema);
// User.createIndexes();

module.exports = User;
