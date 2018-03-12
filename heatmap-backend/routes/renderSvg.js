const express = require("express");
const router = express.Router();

const svgRoute = require("./svg");

const Events = require("../models/event");

router.get("/:eventId", function(req, res) {
  Events.findOne({"eventId": req.params.eventId.split(".")[0]}, function(err, event) {
    if (err) {
      res.send(err);
    } else if (event) {

      // Get SVG Content
      let SVGContent = svgRoute.functions.svgContent(event.map,1);
      let svg = svgRoute.functions.svgTemplate(event.x,event.y,SVGContent,1);
      
      // Send SVG
      res.render('main', {svg: svg, name: event.eventName, list: []});

    } else {
      res.send("Event not found...");
    }
  });
});

router.get("/", function(req, res) {
  Events.find(function(err, events) {
    if (err) {
      res.send(err);
    } else {
      res.render('main', { list: events, name: "Stored Events", svg: ""});
    }
  });
});

module.exports = router;
