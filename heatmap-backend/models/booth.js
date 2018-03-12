const mongoose = require("mongoose");

// eslint-disable-next-line
let boothSchema = mongoose.Schema({
  boothId: {type: String, unique: true},
  unit: String,
  description: String,
  measurementUnit: String,
  shape: {type: Object, required: true},
  contact: String,
});

module.exports = mongoose.model("Booth", boothSchema);
