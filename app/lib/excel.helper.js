const excel = require('excel4node');

class ExcelHelper {
  constructor(logger) {
    this.logger = logger;
    this.outputFolderPath = __dirname.replace('app/lib', 'output');
  }

  generateExcelFiles(projects) {
    return new Promise((resolve, reject) => {
      const allExcelFilePaths = [];

      for (const projectName in projects) {
        if (projects.hasOwnProperty(projectName)) {
          const date = new Date();

          const filePath = `${this.outputFolderPath}/${projectName}_${date.getMinutes()}_${date.getDate()}_${date.getMonth() + 1}`;
          allExcelFilePaths.push(filePath);

          const project = projects[projectName];

          const workbook = new excel.Workbook();
          // Add Worksheets to the workbook
          const worksheet = workbook.addWorksheet('Sheet 1');

          // Create a reusable style
          const style = workbook.createStyle({
            font: {
              color: '#000',
              size: 12
            },
            numberFormat: '$#,##0.00; ($#,##0.00); -'
          });

          worksheet.cell(2, 2).string(`Company: ${projectName}`);

          // TODO: write data into excel file
          // write the file
          workbook.write(filePath);
          resolve(true)
        }
      }
    });

  }

  compressFiles(filePaths) {
    // TODO compress files and send the zip file as return or promise resolve

  }

}

module.exports = ExcelHelper;
