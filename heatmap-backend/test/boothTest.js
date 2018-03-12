process.env.UNIT_TEST = "test";

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();

const Booth = require('../models/booth');

chai.use(chaiHttp);
//Our parent block
describe('Booths', () => {
  beforeEach((done) => { //Before each test we empty the database
    Booth.remove({}, (err) => {
      done();
    });
  });
  /*
  * Test the /GET route
  */
  describe('GET /booths', () => {
    it('it should GET all the booths', (done) => {
      chai.request(server)
        .get('/booths')
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
  describe('POST /booths/add', () => {
    it('it should POST a booth', (done) => {
      let booth = {
        boothId: "A01",
        unit: "Node",
        description: "Node booth description here",
        measurementUnit: "metre",
        shape: {type: "rectangle", width : 3, height : 3, x : 0, y : 0},
        contact: "John Doe"
      };
      chai.request(server)
        .post('/booths/add')
        .send(booth)
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.be.a('String');
          res.text.should.be.eql('Saved booth.');
          done();
        });
    });
    it('it should not POST a booth when shape is not defined', (done) => {
      let booth = {
        boothId: "A01",
        unit: "Node",
        description: "Node booth description here",
        measurementUnit: "metre",
        contact: "John Doe"
      };
      chai.request(server)
        .post('/booths/add')
        .send(booth)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.a.property('errors');
          res.body.errors.should.have.a.property('shape');
          res.body.errors.shape.should.have.property('message').eql('Path `shape` is required.');
          res.body.errors.shape.should.have.property('kind').eql('required');
          done();
        });
    });
  });

  /*
  * Test the /GET route
  */
  describe('GET /booths/:beaconId', () => {
    it('it should GET the booth with the given booth id ', (done) => {
      let addBooth = new Booth({
        boothId: "A01",
        unit: "Node",
        description: "Node booth description here",
        measurementUnit: "metre",
        shape: {type: "rectangle", width : 3, height : 3, x : 0, y : 0},
        contact: "John Doe"
      });
      addBooth.save((err) => {
        chai.request(server)
          .get('/booths/A01')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('boothId');
            res.body.should.have.property('boothId').eql('A01');
            res.body.should.have.property('unit');
            res.body.should.have.property('description');
            res.body.should.have.property('measurementUnit');
            res.body.should.have.property('contact');
            res.body.should.have.property('shape');
            res.body.shape.should.be.a('object');
            res.body.shape.should.have.property('type');
            res.body.shape.should.have.property('width');
            res.body.shape.should.have.property('height');
            res.body.shape.should.have.property('x');
            res.body.shape.should.have.property('y');
            done();
          });
      });
    });
  });
});