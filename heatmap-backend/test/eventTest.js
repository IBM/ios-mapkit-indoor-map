process.env.UNIT_TEST = "test";

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();

const Beacon = require('../models/beacon');
const Booth = require('../models/booth');
const Event = require('../models/event');

chai.use(chaiHttp);
//Our parent block
describe('Events', () => {
  beforeEach((done) => { //Before each test we empty the database
    Beacon.remove({}, (err) => {
      Booth.remove({}, (err) => {
        Event.remove({}, (err) => {
          done();
        });
      });
    });
  });
  /*
  * Test the /GET route
  */
  describe('GET /events', () => {
    it('it should GET all the events', (done) => {
      chai.request(server)
        .get('/events')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });
  /*
  * Test the /POST route
  */
  describe('POST /events/add', () => {
    it('it should POST an event', (done) => {
      let event = {
        eventId : "index",
        eventName : "Index",
        location : "San Francisco",
        startDate : "2018-02-20T00:00:00Z",
        endDate : "2018-02-24T00:00:00Z",
        beacons : [],
        map : []
      };
      chai.request(server)
        .post('/events/add')
        .send(event)
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.be.a('String');
          res.text.should.be.eql('Saved event.');
          done();
        });
    });
    it('it should not POST an event when startDate is not a date', (done) => {
      let event = {
        eventId : "index",
        eventName : "Index",
        location : "San Francisco",
        startDate : "Tomorrow",
        endDate : "2018-02-24T00:00:00Z",
        beacons : [],
        map : []
      };
      chai.request(server)
        .post('/events/add')
        .send(event)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.a.property('errors');
          res.body.errors.should.have.a.property('startDate');
          res.body.errors.startDate.should.have.property('message').include('Cast to Date failed');
          res.body.errors.startDate.should.have.property('kind').eql('Date');
          done();
        });
    });
  });

  /*
  * Test the /GET route
  */
  describe('GET /events/:eventId', () => {
    it('it should GET the event with the given event id ', (done) => {
      let addEvent = new Event({
        eventId : "index",
        eventName : "Index",
        location : "San Francisco",
        startDate : "2018-02-20T00:00:00Z",
        endDate : "2018-02-24T00:00:00Z",
        beacons : [],
        map : []
      });
      addEvent.save((err) => {
        chai.request(server)
          .get('/events/index')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('eventId');
            res.body.should.have.property('eventName');
            res.body.should.have.property('location');
            res.body.should.have.property('startDate');
            res.body.should.have.property('endDate');
            res.body.should.have.property('beacons');
            res.body.should.have.property('map');
            res.body.beacons.should.be.a('array');
            res.body.beacons.length.should.be.eql(0);
            res.body.map.should.be.a('array');
            res.body.map.length.should.be.eql(0);
            done();
          });
      });
    });
  });
});