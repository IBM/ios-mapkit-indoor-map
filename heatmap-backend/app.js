const express = require("express");
const app = express();
const mongoose = require("mongoose");
const assert = require("assert");
const fs = require("fs");
const cors = require("cors");

const beaconRoute = require("./routes/beacons");
const boothRoute = require("./routes/booths");
const eventRoute = require("./routes/events");
const svgRoute = require("./routes/svg");
const pageRoute = require("./routes/pages");
const renderRoute = require("./routes/renderSvg");
const triggerRoute = require("./routes/trigger");

const cfenv = require('cfenv');
const util = require('util')

// load local VCAP configuration  and service credentials
var vcapLocal;
try {
  vcapLocal = require('./vcap-local.json');
  console.log("Loaded local VCAP", vcapLocal);
} catch (e) { 
  console.log(e)
}

const appEnvOpts = vcapLocal ? { vcap: vcapLocal} : {}

const appEnv = cfenv.getAppEnv(appEnvOpts);

// Within the application environment (appenv) there's a services object
var services = appEnv.services;

// The services object is a map named by service so we extract the one for MongoDB
var mongodb_services = services["compose-for-mongodb"];

// This check ensures there is a services for MongoDB databases
assert(!util.isUndefined(mongodb_services), "Must be bound to compose-for-mongodb services");

// We now take the first bound MongoDB service and extract it's credentials object
var credentials = mongodb_services[0].credentials;

// Within the credentials, an entry ca_certificate_base64 contains the SSL pinning key
// We convert that from a string into a Buffer entry in an array which we use when
// connecting.
var ca = [new Buffer(credentials.ca_certificate_base64, 'base64')];

let mongoDbOptions = {
  mongos: {
    useMongoClient: true,
    ssl: true,
    sslValidate: true,
    sslCA: ca,
  },
};

mongoose.connection.on("error", function(err) {
  console.log("Mongoose default connection error: " + err);
});

mongoose.connection.on("open", function(err) {
  console.log("CONNECTED...");
  assert.equal(null, err);
});

if (process.env.UNIT_TEST == "test") {
  mongoose.connect("mongodb://localhost/myapp");
}
else {
  mongoose.connect(credentials.uri, mongoDbOptions);
}

app.use(require("body-parser").json());
app.use(cors());

app.set('view engine', 'ejs');

app.use(express.static(__dirname + "/public"));

app.use("/main", renderRoute);
app.use("/beacons", beaconRoute);
app.use("/booths", boothRoute);
app.use("/events", eventRoute);
app.use("/svg", svgRoute.main);
app.use("/pages", pageRoute);
app.use("/triggers", triggerRoute);

let port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("To view your app, open this link in your browser: http://localhost:" + port);
});

module.exports = app;