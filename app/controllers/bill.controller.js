const Response = require('../lib/responseManager');
const HttpStatus = require('../constants/httpStatus');

class BillController {
  constructor(logger, service) {
    this.logger = logger;
    this.billService = service;
  }

  static validateFile(filename) {
    return filename.endsWith('.csv');
  }

  receiveFile(req, res) {
    this.logger.info('file');
    const {timetable_file} = req.files;

    if (!timetable_file) {
      return Response.failure(res, {message: 'timetable file is required'}, HttpStatus.BAD_REQUEST);
    }
    if (!BillController.validateFile(timetable_file.path)) {
      return Response.failure(res, {message: 'file is not a csv file'}, HttpStatus.BAD_REQUEST);
    }

    this.billService.handleFileData(timetable_file)
      .then(result => {
        if (!result) {
          return Response.failure(res, {message: result}, HttpStatus.BAD_REQUEST);
        }
        return Response.success(res, {message: result}, HttpStatus.ACCEPTED);
      })
      .catch(err => {
        return Response.failure(err, {message: "An error occurred, please try again later"}, HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }

}

module.exports = BillController;
