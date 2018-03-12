const express = require("express");
const router = express.Router();

const Triggers = require("../models/trigger");

// endpoints for beacon
router.post("/add", function(req, res) {
  // JSON in req.body
  // Insert input validation
  let addTrigger = new Triggers(req.body);
  addTrigger.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.send("Saved trigger.");
    }
  });
});

router.get("/", function(req, res) {
  Triggers.find(function(err, triggers) {
    if (err) {
      res.send(err);
    } else {
      res.send(triggers);
    }
  });
});

router.get("/delete", function(req, res) {
  Triggers.remove({}, function(err) {
    if (err) {
      res.send(err);
    } else {
      res.send("Removed all trigger events");
    }
  });
});

router.get("/total", function(req, res) {
  Triggers.find(function(err, triggers) {
    if (err) {
      res.send(err);
    } else {
      let jsonData = {
        zone_one: 0,
        zone_two: 0,
        zone_three: 0,
        zone_four: 0,
        zone_five: 0,
        zone_six: 0,
        zone_seven: 0,
        zone_eight: 0,
        zone_nine: 0,
        zone_ten: 0,
        zone_eleven: 0,
        zone_twelve: 0,
        zone_thirteen: 0,
        zone_fourteen: 0,
        zone_fifteen: 0
      };
      triggers.forEach(function(trigger) {
        if (trigger.zone == 1 && trigger.event == "enter") {
          jsonData.zone_one += 1;
        }
        if (trigger.zone == 2 && trigger.event == "enter") {
          jsonData.zone_two += 1;
        }
        if (trigger.zone == 3 && trigger.event == "enter") {
          jsonData.zone_three += 1;
        }
        if (trigger.zone == 4 && trigger.event == "enter") {
          jsonData.zone_four += 1;
        }
        if (trigger.zone == 5 && trigger.event == "enter") {
          jsonData.zone_five += 1;
        }
        if (trigger.zone == 6 && trigger.event == "enter") {
          jsonData.zone_six += 1;
        }
        if (trigger.zone == 7 && trigger.event == "enter") {
          jsonData.zone_seven += 1;
        }
        if (trigger.zone == 8 && trigger.event == "enter") {
          jsonData.zone_eight += 1;
        }
        if (trigger.zone == 9 && trigger.event == "enter") {
          jsonData.zone_nine += 1;
        }
        if (trigger.zone == 10 && trigger.event == "enter") {
          jsonData.zone_ten += 1;
        }
        if (trigger.zone == 11 && trigger.event == "enter") {
          jsonData.zone_eleven += 1;
        }
        if (trigger.zone == 12 && trigger.event == "enter") {
          jsonData.zone_twelve += 1;
        }
        if (trigger.zone == 13 && trigger.event == "enter") {
          jsonData.zone_thirteen += 1;
        }
        if (trigger.zone == 14 && trigger.event == "enter") {
          jsonData.zone_fourteen += 1;
        }
        if (trigger.zone == 15 && trigger.event == "enter") {
          jsonData.zone_fifteen += 1;
        }
      });
      res.send(jsonData);
    }
  });
});

module.exports = router;
