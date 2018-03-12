process.env.UNIT_TEST = "test";

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();

const Beacon = require('../models/beacon');
const Booth = require('../models/booth');
const Event = require('../models/event');

chai.use(chaiHttp);

describe('SVGs', () => {
  beforeEach((done) => {
    //Before each test we empty database AND add beacon, booth, and event.
    let addBeacon = new Beacon({
      beaconId: "B01",
      x: 1,
      y: 1,
      minCount: 1,
      maxCount: 100
    });
    let addBooth = new Booth({
      boothId: "A01",
      unit: "Node",
      description: "Node booth description here",
      measurementUnit: "metre",
      shape: {type: "rectangle", width : 3, height : 3, x : 0, y : 0},
      contact: "John Doe"
    });
    let event = {
      eventId : "index",
      eventName : "Index",
      x : 5,
      y : 5,
      location : "San Francisco",
      startDate : "2018-02-20T00:00:00Z",
      endDate : "2018-02-24T00:00:00Z",
      beacons : [],
      map : []
    };
    Beacon.remove({}, (err) => {
      Booth.remove({}, (err) => {
        Event.remove({}, (err) => {
          addBeacon.save((err) => {
            addBooth.save((err) => {
              Beacon.find({}, (err,beacons) => {
                event.beacons = beacons;
                Booth.find({}, (err,booths) => {
                  event.map = booths;
                  let addEvent = new Event(event);
                  addEvent.save((err) => {
                    done();
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  describe('GET /svg/:eventId', () => {
    it('it should GET an svg', (done) => {
      chai.request(server)
        .get('/svg/index')
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.be.a('String');
          res.text.should.be.eql("<svg width='5' height='5'><rect x='0' y='0' width='3' height='3' fill='#CCB3B3' /><text x='1.5' y='1.5' transform='rotate(-45 1.5,1.5)' alignment-baseline='middle' text-anchor='middle'    fill='blue' font-size='0.75vw' font-family='sans-serif'>Node</text></svg>");
          done();
        });
    });
  });

  describe('GET /svg/<:eventId>.pdf', () => {
    it('it should GET a pdf version of the svg', (done) => {
      chai.request(server)
        .get('/svg/index.pdf')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.have.property('type');
          res.type.should.be.eql('application/pdf');
          done();
        });
    });
  });
});