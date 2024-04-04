const mongoose = require("mongoose");
const { Schema } = mongoose;

const deviceSchema = new Schema({
  os: { type: String, required: true },
  browser: { type: String, required: true },
  version: { type: String, required: true },
  ipAddress: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  createdAt: { type: Date, default: Date.now },
});

const DeviceModel = mongoose.model("Device", deviceSchema);

module.exports = DeviceModel;