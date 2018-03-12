const express = require("express");
const router = express.Router();

const Beacons = require("../models/beacon");

// endpoints for beacon
router.post("/add", function(req, res) {
  // JSON in req.body
  // Insert input validation
  let addBeacon = new Beacons(req.body);
  addBeacon.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.send("Saved beacon.");
    }
  });
});

router.get("/", function(req, res) {
  Beacons.find(function(err, beacons) {
    if (err) {
      res.send(err);
    } else {
      res.send(beacons);
    }
  });
});

router.get("/:beaconId", function(req, res) {
  Beacons.findOne(req.params, function(err, beacon) {
    if (err) {
      res.send(err);
    } else if (beacon) {
      res.send(beacon);
    } else {
      res.send("Beacon not found...");
    }
  });
});

module.exports = router;
