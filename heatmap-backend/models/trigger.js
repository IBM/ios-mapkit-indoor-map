const mongoose = require("mongoose");

// eslint-disable-next-line
let triggerSchema = mongoose.Schema({
  zone: Number,
  event: String,
  timestamp: String
});

module.exports = mongoose.model("Trigger", triggerSchema);
