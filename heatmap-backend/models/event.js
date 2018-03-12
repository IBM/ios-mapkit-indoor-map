const mongoose = require("mongoose");

let Booths = require("../models/booth");
let Beacons = require("../models/beacon");

// eslint-disable-next-line
let eventSchema = mongoose.Schema({
  eventId: {type: String, unique: true},
  eventName: String,
  location: String,
  x: Number,
  y: Number,
  startDate: Date,
  endDate: Date,
  fromAnchorLatitude: Number,
  fromAnchorLongitude: Number,
  fromAnchorSVGPointX: Number,
  fromAnchorSVGPointY: Number,
  toAnchorLatitude: Number,
  toAnchorLongitude: Number,
  toAnchorSVGPointX: Number,
  toAnchorSVGPointY: Number,
  map: [Booths.schema],
  beacons: [Beacons.schema],
});

module.exports = mongoose.model("Event", eventSchema);
