const request = require('request')

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateData() {
  let zoneNumber = getRandomInt(1,9)
  let numberOfTriggers = getRandomInt(1,10)
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
  
  console.log("Sending " + numberOfTriggers + " number of events to zone: " +zoneNumber)
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
  setInterval(generateData, 1000)
}
else {
  console.log("-------------------------")
  console.log("Please set environment varialbe CF_APP_URL to the heatmap-backend you just deployed");
  console.log("example:\nexport CF_APP_URL=https://heatmap-backend.mybluemix.net")
  console.log("-------------------------")
}
