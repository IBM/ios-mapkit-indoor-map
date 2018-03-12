const express = require("express");
const router = express.Router();

const Beacons = require("../models/beacon");
const Booths = require("../models/booth");
const Events = require("../models/event");

// endpoints for event
router.post("/add", function(req, res) {
  // JSON in req.body
  // Insert input validation
  let boothIds = req.body.map;
  let beaconIds = req.body.beacons;

  let queryBooth = Booths.find({"boothId": {$in: boothIds}},
    function(err, booths) {
      if (err) {
        res.send(err);
      } else {
        req.body.map = booths;
      }
    });

  let queryBeacon = Beacons.find({"beaconId": {$in: beaconIds}},
    function(err, beacons) {
      if (err) {
        res.send(err);
      } else {
        req.body.beacons = beacons;
      }
    });

  queryBooth.then(queryBeacon)
    .then(function() {
      let addEvent = new Events(req.body);
      addEvent.save(function(err) {
        if (err) {
          res.send(err);
        } else {
          res.send("Saved event.");
        }
      });
    });
});

router.get("/", function(req, res) {
  Events.find(function(err, events) {
    if (err) {
      res.send(err);
    } else {
      res.send(events);
    }
  });
});

router.get("/:eventId", function(req, res) {
  Events.findOne(req.params, function(err, event) {
    if (err) {
      res.send(err);
    } else if (event) {
      res.send(event);
    } else {
      res.send("Event not found...");
    }
  });
});

module.exports = router;
