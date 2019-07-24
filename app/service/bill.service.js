const fs = require('fs');
const readline = require("readline");
const ExcelHelper = require('../lib/excel.helper');
const config = require("../config/settings");


class BillService {
  constructor(logger) {
    this.logger = logger;
    this.excelHelper = new ExcelHelper(logger);
  }

  static findHourDifference(time1, time2) {
    const HOUR_IN_MILLIS = 60 * 60 * 1000;
    const dateString = "July 23, 2019 ";
    const dateOne = new Date(dateString + time1);
    const dateTwo = new Date(dateString + time2);

    return (dateTwo - dateOne) / HOUR_IN_MILLIS;
  }

  handleFileData(filePath) {
    return new Promise((resolve, reject) => {
      const allProjects = {};
      const rl = readline.createInterface({
        input: fs.createReadStream(filePath)
      });

      // used count variable to track first line and ignore it
      let count = 0;

      rl.on('line', (input) => {
        this.logger.info('reading line');
        if (input !== '' && count !== 0) {
          const data = input.toString().split(',');
          const project = data[2];
          const start_time = data[4],
            end_time = data[5],
            rate = parseInt(data[1]);

          const hours = BillService.findHourDifference(start_time, end_time);

          const bill = {
            employeeId: data[0],
            hours,
            rate: parseInt(data[1]),
            cost: rate * hours,
          };

          if (!allProjects[project]) {
            allProjects[project] = {
              bills: [],
              total: 0
            };
          }
          allProjects[project].bills.push(bill);
          allProjects[project].total += bill.cost;
        }

        // increment count
        count++;
      });

      rl.on('close', () => {
        this.logger.info('closed file');
        this.excelHelper.generateExcelFiles(allProjects)
          .then(result => resolve(result))
          .catch(error => reject(error));
      });
    });
  }


}

module.exports = BillService;
