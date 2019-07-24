const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiAsPromised = require('chai-as-promised');
const app = require('../index');
const fs = require('fs');
const expect = chai.expect;

chai.use(chaiHttp);
chai.use(chaiAsPromised);
const sampleFilePath = __dirname.replace('app/tests', 'sample/sample_projects_file.csv');
const invalidFilePath = __dirname.replace('app/tests', 'sample/backblue.gif');

describe('Billable Hours Suite', () => {

  it('should return bad request server code 400 as file is not in request', (done) => {
    chai.request(app)
      .post('/upload')
      .type('form')
      .end((err, res) => {
        if (err) {
          console.log(err);
        }
        expect(res.body.code)
          .to
          .be
          .equal(400);
        expect(res.body)
          .to
          .have
          .property('message');
        expect(res.body.message)
          .to
          .be
          .equal('timetable file is required');
        done();
      });

  });

  it('should return bad request server code 400 as file is not a csv file', (done) => {
    chai.request(app)
      .post('/upload')
      .type('form')
      .attach('timetable_file', fs.readFileSync(invalidFilePath), 'backblue.gif')
      .end((err, res) => {
        if (err) {
          console.log(err);
        }
        expect(res.body.code)
          .to
          .be
          .equal(400);
        expect(res.body)
          .to
          .have
          .property('message');
        expect(res.body.message)
          .to
          .be
          .equal('file is not a csv file');
        done();
      });

  });

  it('should return zip file with status 202', (done) => {
    chai.request(app)
      .post('/upload')
      .type('form')
      .attach('timetable_file', fs.readFileSync(sampleFilePath), 'timetable_file.csv')
      .end((err, res) => {
        console.log(res.body);
        if (err) {
          console.log(err);
        }
        expect(res)
          .to
          .have
          .status(202);
        expect(res.body)
          .to
          .have
          .property('message');
        done();
      });

  });

});
