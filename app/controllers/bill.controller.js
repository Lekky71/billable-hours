const Response = require('../lib/responseManager');
const HttpStatus = require('../constants/httpStatus');

class BillController {
  constructor(logger, service) {
    this.logger = logger;
    this.emailService = service;
  }

  static validateFile(filename) {
    return filename.endsWith('.csv');
  }

  receiveFile(req, res, next) {

    const {timetable_file} = req.files;

    if (!timetable_file) {
      return Response.failure(res, {message: 'timetable file is required'}, HttpStatus.BAD_REQUEST);
    }
    if (!BillController.validateFile(timetable_file.path)) {
      return Response.failure(res, {message: 'file is not a csv file'}, HttpStatus.BAD_REQUEST);
    }
    //todo handle with service
    this.emailService.handleEmailSub({email})
      .then(savedEmailSub => {
        if (savedEmailSub.error === 'already subscribed') {
          return Response.failure(res, {message: savedEmailSub}, HttpStatus.BAD_REQUEST);
        }
        return Response.success(res, {message: savedEmailSub}, HttpStatus.ACCEPTED);
      })
      .catch(err => {
        return Response.failure(err, {message: "An error occurred, please try again later"}, HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }

}

module.exports = BillController;
