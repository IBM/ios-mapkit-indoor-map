const request = require('request')
const prompt = require('prompt');

const schema = {
  properties: {
    zone: {
      pattern: /[123456789]/,
      message: 'Zone must be from 1 - 9',
      maxLength: 1,
      required: true
    },
    numberOfTriggers: {
      pattern: /^([0-9]|([1-9][0-9])|100)$/,
      message: 'Triggers sent at this zone must be from 1 - 100',
      required: true
    }
  }
};

prompt.start();
function askUser() {

  console.log("==========")
  console.log("Enter zone number to populate and number of trigger eventsto be sent at that zone")
  console.log("Zones are from 1 - 9. Trigger events are from 0 - 99")
  console.log("Ctrl + D to exit.")
  prompt.get(schema, function (err, result) {
    //
    // Log the results.
    //
    console.log('Command-line input received:');
    console.log('  zone: ' + result.zone);
    generateData(result.zone, result.numberOfTriggers)
    askUser();
  });
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateData(userInput, numberOfTriggers) {
  let zoneNumber = 0
  if (userInput == 0) {
    zoneNumber = getRandomInt(1,9)
  } else {
    zoneNumber = userInput
  }
  
  let input = {
    zone: zoneNumber,
    event: "enter"
  }
  
  let options = {
    url: process.env.CF_APP_URL + "/triggers/add",
    method: "POST",
    body: JSON.stringify(input),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  
  console.log(zoneNumber)
  var requestsSent = 0

  while (requestsSent < numberOfTriggers) {
    request(options, function (err, _res, body) {
      if (err) _res.send(err);
      // console.log(body)
    });
    requestsSent++;
  }
}

if (process.env.CF_APP_URL) {
  askUser()
} else {
  console.log("-------------------------")
  console.log("Please set environment varialbe CF_APP_URL to the heatmap-backend you just deployed");
  console.log("example:\nexport CF_APP_URL=https://heatmap-backend.mybluemix.net")
  console.log("-------------------------")
}