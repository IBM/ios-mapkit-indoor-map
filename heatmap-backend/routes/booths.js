const express = require("express");
const router = express.Router();

const Booths = require("../models/booth");

// endpoints for booth
router.post("/add", function(req, res) {
  // JSON in req.body
  // Insert input validation
  let addBooth = new Booths(req.body);
  addBooth.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.send("Saved booth.");
    }
  });
});

router.get("/", function(req, res) {
  Booths.find(function(err, booths) {
    if (err) {
      res.send(err);
    } else {
      res.send(booths);
    }
  });
});

router.get("/:boothId", function(req, res) {
  Booths.findOne(req.params, function(err, booth) {
    if (err) {
      res.send(err);
    } else if (booth) {
      res.send(booth);
    } else {
      res.send("Booth not found...");
    }
  });
});

module.exports = router;
