process.env.UNIT_TEST = "test";

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();

const Page = require('../models/page');

chai.use(chaiHttp);

describe('Pages', () => {
  beforeEach((done) => {
    //Before each test we empty database
    Page.remove({}, (err) => {
      done();
    });
  });

  describe('GET /pages', () => {
    it('it should GET all the Pages', (done) => {
      chai.request(server)
        .get('/pages')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('POST /pages/add', () => {
    it('it should POST a booklet page', (done) => {
      let _page = {
        page: 1,
        title: "think",
        subtitle: "2018",
        image: "boy pirate",
        subtext: "secret map",
        description: "an IBM Code experiment",
        imageEncoded: ""
      };
      chai.request(server)
        .post('/pages/add')
        .send(_page)
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.be.a('String');
          res.text.should.be.eql('Saved booklet page.');
          done();
        });
    });
    it('it should not POST a booklet page when page is not a number', (done) => {
      let _page = {
        page: "1A",
        title: "think",
        subtitle: "2018",
        image: "boy pirate",
        subtext: "secret map",
        description: "an IBM Code experiment",
        imageEncoded: ""
      };
      chai.request(server)
        .post('/pages/add')
        .send(_page)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.a.property('errors');
          res.body.errors.should.have.property('page');
          res.body.errors.page.should.have.property('message').include('Cast to Number failed');
          res.body.errors.page.should.have.property('kind').eql('Number');
          done();
        });
    });
  });
});