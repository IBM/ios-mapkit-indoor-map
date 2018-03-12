const mongoose = require("mongoose");

// eslint-disable-next-line
let beaconSchema = mongoose.Schema({
  beaconId: {type: String, unique: true},
  key: String,
  value: String,
  zone: Number,
  beaconid: String,
  color: String,
  x: Number,
  y: Number,
  width: Number,
  height: Number,
});

module.exports = mongoose.model("Beacon", beaconSchema);
