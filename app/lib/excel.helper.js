const excel = require('excel4node');
const AdmZip = require('adm-zip');
const util = require('util');
const fs = require('fs');

class ExcelHelper {
  constructor(logger) {
    this.logger = logger;
    this.outputFolderPath = __dirname.replace('app/lib', 'output');
  }

  generateExcelFiles(projects) {
    return new Promise((resolve, reject) => {
      const allExcelFilePaths = [];
      const allExcelPromises = [];

      for (const projectName in projects) {
        if (projects.hasOwnProperty(projectName)) {
          const date = new Date();

          const filePath = `${this.outputFolderPath}/${projectName}_${date.getMinutes()}_${date.getHours()}_${date.getDate()}_${date.getMonth() + 1}.xlsx`;
          allExcelFilePaths.push(filePath);

          const project = projects[projectName];

          const workbook = new excel.Workbook();
          // Add Worksheets to the workbook
          const worksheet = workbook.addWorksheet('Sheet 1');

          this.logger.info('writing to worksheet');

          worksheet.cell(2, 2).string(`Company: ${projectName}`);

          // write headers

          let currentRow = 4;
          const headers = ["Employee ID", "Number of\nHours", "Unit Price", "Cost"];
          for (let i = 0; i < headers.length; i++) {
            worksheet.cell(currentRow, i + 2).string(headers[i]);
          }
          // move to the next row
          currentRow++;
          project.bills.forEach(bill => {
            worksheet.cell(currentRow, 2).string(bill.employeeId.toString());
            worksheet.cell(currentRow, 3).number(bill.hours);
            worksheet.cell(currentRow, 4).number(bill.rate);
            worksheet.cell(currentRow, 5).number(bill.cost);

            // move to the next row
            currentRow++;
          });
          worksheet.cell(currentRow, 4).string("Total");
          worksheet.cell(currentRow, 5).number(project.total);
          // workbook.write is used to write to a file
          // I promisified the function so as to handle race condition with the compressing function
          workbook.writeP = util.promisify(workbook.write);

          allExcelPromises.push(workbook.writeP(filePath));
        }
      }

      // make sure all excel files are generated before starting compression
      Promise.all(allExcelPromises)
        .then(responses => {
          // compress file
          this.compressFiles(allExcelFilePaths)
            .then(zipPath => resolve(zipPath))
            .catch(err1 => reject(err1));
        })
        .catch(errors => reject(errors));

    });

  }

  compressFiles(filePaths) {
    return new Promise((resolve, reject) => {
      // TODO compress files and send the zip file as return or promise resolve
      const zip = new AdmZip();

      filePaths.forEach(path => {
        zip.addLocalFile(path);
      });

      const date = new Date();
      const zipFilePath = `${this.outputFolderPath}/${date.getMinutes()}_${date.getHours()}_${date.getDate()}_${date.getMonth() + 1}.zip`;

      zip.writeZip(zipFilePath, (err) => {
        this.deleteFiles(filePaths, () => {});
        if (err) {
          this.logger.info(err);
          return reject(err);
        }
        return resolve(zipFilePath);
      });

    });
  }

  deleteFiles(files, callback) {
    if (files.length === 0) callback();
    else {
      let f = files.pop();
      return fs.unlink(f, (err) => {
        if (err) {
          this.logger.info(err);
          callback(err);
        }
        else {
          this.deleteFiles(files, callback);
        }
      });
    }
  }
}

module.exports = ExcelHelper;
