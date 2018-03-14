const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const SVGtoPDF = require("svg-to-pdfkit");
const stream = require("stream");

const Events = require("../models/event");


router.get("/:eventId", function(req, res) {
  Events.findOne({"eventId": req.params.eventId.split(".")[0]}, function(err, event) {
    if (err) {
      res.send(err);
    } else if (event) {

      // Get SVG Content
      let SVGContent = svgContent(event.map,1);
      let svg = svgTemplate(event.x,event.y,SVGContent,1);

      // If .pdf is present, send a pdf version of the svg
      if (req.params.eventId.split(".").pop() == "pdf") {

        // scale up for 1:1 svg point to pdf point
        SVGContent = svgContent(event.map,(4/3));
        svg = svgTemplate(event.x,event.y,SVGContent,(4/3));

        // we already scaled up svg points so no need to scale pdf points
        const pdfPointRatio = 1;
        let pdfX = pdfPointRatio * event.x * 1;
        let pdfY = pdfPointRatio * event.y * 1;

        // Start making PDF
        let doc = new PDFDocument({ size: [pdfX,pdfY]});
        let echoStream = new stream.Writable();
        let pdfBuffer = new Buffer("");

        // Write to Buffer
        echoStream._write = function (chunk, encoding, done) {
          pdfBuffer = Buffer.concat([pdfBuffer, chunk]);
          done();
        };

        // Use svg-to-pdfkit
        SVGtoPDF(doc, svg, 0, 0, { fontCallback: () => 'Helvetica' });
        doc.pipe(echoStream);
        doc.end();

        // Set content type to pdf
        res.contentType("application/pdf");

        // When stream is done, send pdf
        echoStream.on("finish", function () {
          // Make Buffer readable stream
          let bufferStream = new stream.PassThrough();
          bufferStream.end(pdfBuffer);
          bufferStream.pipe(res);
        });
      } else {

        // Send SVG
        res.send(svg);
      }
    } else {
      res.send("Event not found...");
    }
  });
});

/**
 * Forms an SVG
 * @param {String} width is the width of SVG.
 * @param {String} height is the height of SVG.
 * @param {String} content contains the SVG elements.
 * @param {String} scale is used to scale the values: [width, height]
 * @return {String} an SVG in xml format
 */
function svgTemplate(width, height, content, scale) {
  let border = "<rect fill='none' x='0' y ='0' width='" + width*scale + "' height= '" + height*scale + "' stroke='#999999' />";
  let svg = "<svg width='" + width*scale + "' height='" + height*scale + "'>" + border +
    content + "</svg>";
  return svg;
}

function svgContent(arrayOfElements,scale) {
  let svg = "";
  for (let i = 0; i < arrayOfElements.length; i++) {
    let booth = arrayOfElements[i];
    if(booth.shape.type == "rectangle") {
      svg +=
        rectangleTemplate(booth,scale);
    }
    if(booth.shape.type == "circle") {
      svg +=
        circleTemplate(booth,scale);
    }
    if(booth.shape.type == "ellipse") {
      svg +=
        ellipseTemplate(booth,scale);
    }
    if(booth.shape.type == "polygon") {
      svg +=
        polygonTemplate(booth,scale);
    }
  }
  return svg;
}

/**
 * Forms an SVG element of rectangle
 * @param {String} x is the x location of the rectangle.
 * @param {String} y is the y location of the rectangle.
 * @param {String} width is the width of the rectangle.
 * @param {String} height is the height of the rectangle.
 * @param {String} scale is used to scale the values above.
 * @return {String} an SVG element of rectangle in xml format
 */
function rectangleTemplate(booth, scale) {
  let elem = booth.shape;
  elem.x *= scale;
  elem.y *= scale;
  elem.width *= scale;
  elem.height *= scale;
  const xCentroid = (elem.width/2)+elem.x;
  const yCentroid = (elem.height/2)+elem.y;
  let boothTextLines = booth.unit.split(' ');

  let svg = "<rect x='" + elem.x + "' y='" + elem.y + "' width='" +
    elem.width + "' height='" + elem.height + "' fill='#DEDEDE' stroke='#999999' />";
  let tspans = "";
  boothTextLines.forEach(function(value, index) {
    let dy = '1.2em';
    if (index == 0 && boothTextLines.length == 3) {
      dy = '-1.2em';
    } else if (index == 0 && boothTextLines.length == 2) {
      dy = '-0.6em';
    } else if (index == 0 && boothTextLines.length == 1) {
      dy = '0';
    }
    tspans += "<tspan dy='" + dy + "' x='" + xCentroid + "' alignment-baseline='middle' text-anchor='middle'>" + value + "</tspan>";
  });

  svg += "<text x='" + xCentroid + "' y='" +
    yCentroid + "'\
    fill='black' font-size='20pt' font-family='sans-serif'>" +
    tspans + "</text>";
  return svg;
}

/**
 * Forms an SVG element of circle
 * @param {String} cx is the x location of the center of the circle.
 * @param {String} cy is the y location of the center of the circle.
 * @param {String} radius is the radius of the circle.
 * @param {String} scale is used to scale the values above.
 * @return {String} an SVG element of circle in xml format
 */
function circleTemplate(booth, scale) {
  let elem = booth.shape;
  elem.cx *= scale;
  elem.cy *= scale;
  elem.radius *= scale;

  let svg = "<circle cx='" + elem.cx + "' cy='" + elem.cy + "' r='" +
    elem.radius + "' fill='#DEDEDE' stroke='#999999' />";
  svg += "<text x='" + elem.cx + "' y='" +
    elem.cy + "' alignment-baseline='middle' text-anchor='middle'\
    fill='black' font-size='0.75vw' font-family='sans-serif'>" +
    booth.unit + "</text>";
  return svg;
}

/**
 * Forms an SVG element of ellipse
 * @param {String} cx is the x location of the center of the ellipse.
 * @param {String} cy is the y location of the center of the ellipse.
 * @param {String} rx is the x radius of the ellipse.
 * @param {String} ry is the y radius of the ellipse.
 * @param {String} scale is used to scale the values above.
 * @return {String} an SVG element of rectangle in xml format
 */
function ellipseTemplate(booth, scale) {
  let elem = booth.shape;
  elem.cx *= scale;
  elem.cy *= scale;
  elem.rx *= scale;
  elem.ry *= scale;

  let svg = "<ellipse cx='" + elem.cx + "' cy='" + elem.cy + "' rx='" +
    elem.rx + "' ry='" + elem.ry + "' fill='#DEDEDE' stroke='#999999' />";
  svg += "<text x='" + elem.cx + "' y='" +
    elem.cy + "' alignment-baseline='middle' text-anchor='middle'\
    fill='black' font-size='0.75vw' font-family='sans-serif'>" +
    booth.unit + "</text>";
  return svg;
}

/**
 * Forms an SVG element of polygon
 * @param {String} points contains the points of the polygon.
 * @param {String} scale is used to scale the values above.
 * @return {String} an SVG element of rectangle in xml format
 */
function polygonTemplate(booth, scale) {
  let elem = booth.shape;
  let integers = elem.points.split(/[\s,]+/);
  let scaledInt = "";
  let xPoints = [];
  let yPoints = [];

  for (let i in integers) {
    if (i % 2 == 0) {
      scaledInt += integers[i]*scale + ",";
      xPoints.push(integers[i]*scale);
    }
    else {
      scaledInt += integers[i]*scale + " ";
      yPoints.push(integers[i]*scale);
    }
  }

  const xCentroid = xPoints.reduce((a,b) => (a+b)) / xPoints.length;
  const yCentroid = yPoints.reduce((a,b) => (a+b)) / yPoints.length;
  let svg = "<polygon points='" + scaledInt + "' fill='#DEDEDE' stroke='#999999' />";
  svg += "<text x='" + xCentroid + "' y='" +
    yCentroid + "' alignment-baseline='middle' text-anchor='middle'\
    fill='black' font-size='0.75vw' font-family='sans-serif'>" +
    booth.unit + "</text>";
  return svg;
}

module.exports = {
  main: router,
  functions: { svgTemplate, svgContent, rectangleTemplate, circleTemplate, ellipseTemplate, polygonTemplate }
};
