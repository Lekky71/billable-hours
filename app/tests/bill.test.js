const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiAsPromised = require('chai-as-promised');
const app = require('../index');

const expect = chai.expect;

chai.use(chaiHttp);
chai.use(chaiAsPromised);
const sampleFilePath = __dirname.replace('app/lib', 'sample/sample_projects_file.csv');
const invalidFilePath = __dirname.replace('app/lib', 'sample/backblue.gif');

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
          .have
          .equal(400);
        expect(res.body)
          .to
          .have
          .property('message');
        expect(res.body.message)
          .to
          .have
          .equal('timetable file is required');
        done();
      });

  });

  it('should return bad request server code 400 as file is not a csv file', (done) => {
    chai.request(app)
      .post('/upload')
      .type('form')
      .attach('timetable_file', fs.readFileSync(invalidFilePath))
      .end((err, res) => {
        if (err) {
          console.log(err);
        }
        expect(res.body.code)
          .to
          .have
          .equal(400);
        expect(res.body)
          .to
          .have
          .property('message');
        expect(res.body.message)
          .to
          .have
          .equal('file is not a csv file');
        done();
      });

  });

  it('should return error because file is not sent', (done) => {
    chai.request(app)
      .post('/upload')
      .type('form')
      .attach('imageField', fs.readFileSync('avatar.png'), 'avatar.png')
      .end((err, res) => {
        if (err) {
          console.log(err);
        }
        expect(res.body.code)
          .to
          .have
          .equal(200);
        expect(res.body)
          .to
          .have
          .property('message');
        expect(res.body.data.type)
          .to
          .equal('Isosceles');
        done();
      });

  });

});
