process.env.UNIT_TEST = "test";

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();

const Beacon = require('../models/beacon');

chai.use(chaiHttp);
//Our parent block
describe('Beacons', () => {
  beforeEach((done) => { //Before each test we empty the database
    Beacon.remove({}, (err) => {
      done();
    });
  });
  /*
  * Test the /GET route
  */
  describe('GET /beacons', () => {
    it('it should GET all the beacons', (done) => {
      chai.request(server)
        .get('/beacons')
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
  describe('POST /beacons/add', () => {
    it('it should POST a beacon', (done) => {
      let beacon = {
        beaconId: "B01",
        x: 1,
        y: 1,
        minCount: 1,
        maxCount: 100
      };
      chai.request(server)
        .post('/beacons/add')
        .send(beacon)
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.be.a('String');
          res.text.should.be.eql('Saved beacon.');
          done();
        });
    });
    it('it should not POST a beacon when x coordinate is not a number', (done) => {
      let beacon = {
        beaconId: "B01",
        x: "1a",
        y: 1,
        minCount: 1,
        maxCount: 100
      };
      chai.request(server)
        .post('/beacons/add')
        .send(beacon)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.a.property('errors');
          res.body.errors.should.have.property('x');
          res.body.errors.x.should.have.property('message').include('Cast to Number failed');
          res.body.errors.x.should.have.property('kind').eql('Number');
          done();
        });
    });
  });

  /*
  * Test the /GET route
  */
  describe('GET /beacons/:beaconId', () => {
    it('it should GET the beacon with the given beacon id ', (done) => {
      let addBeacon = new Beacon({
        beaconId: "B01",
        x: 1,
        y: 1,
        minCount: 1,
        maxCount: 100
      });
      addBeacon.save((err) => {
        chai.request(server)
          .get('/beacons/B01')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('beaconId');
            res.body.should.have.property('beaconId').eql('B01');
            res.body.should.have.property('x');
            res.body.should.have.property('y');
            // res.body.should.have.property('minCount');
            // res.body.should.have.property('maxCount');
            done();
          });
      });
    });
  });
});