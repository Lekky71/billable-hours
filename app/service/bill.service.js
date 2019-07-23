const fs = require('fs');
const readline = require("readline");
const MailHelper = require('../lib/mail.helper');
const config = require("../config/settings");


class BillService {
  constructor(logger) {
    this.logger = logger;
    this.mailHelper = new MailHelper(logger);
  }

  static findHourDifference(time1, time2){
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

      rl.on('line', (input) => {
        if (input !== '' || !(input.toString().toLowerCase().includes('start time'))) {
          const data = line.toString().split(',');
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

      });

      rl.on('close', () => {

      });
    });
  }

  handleEmailSub(body) {
    return new Promise(((resolve, reject) => {
      this.mongoDBHelper.getEmailSub(body)
        .then(data => {
          if (data) {
            return resolve({error: 'already subscribed'});
          }
          this.mongoDBHelper.saveEmailSub(body)
            .then(savedData => {
              // completed send 'thanks for subscribing' mail
              this.mailHelper.subscribeEmail(body);
              resolve(savedData);
            })
            .catch(error => {
              return reject(error);
            });
        })
        .catch(error1 => {
          return reject(error1);
        });

    }));

  }

  handleNewContact(body) {
    return new Promise(((resolve, reject) => {
      this.mongoDBHelper.saveContact(body)
        .then(savedData => {
          // todo send 'thanks for reaching out' mail
          const thankYouBody = {
            from: `"Hacktive Devs" <${config.mail.address}>`,
            to: [body.email],
            subject: 'Your Hacktive Devs Inquiry',
            text: "Thank you for sending us a message, a representative of our team will get across to you as soon as possible."
          };
          const sendToAdminBody = {
            from: `"Hacktive Devs" <${config.mail.address}>`,
            to: ["hashilekky@gmail.com", "dowolebolu@gmail.com"],
            subject: 'Hacktive Devs Inquiry',
            text: `${body.name} with mail: ${body.email} sent Hacktive Devs a message.\n` +
              `Message: ${body.message}`
          };
          this.mailHelper.sendPersonalMail(sendToAdminBody)
            .then(res1 => {
              this.mailHelper.sendPersonalMail(thankYouBody)
                .then(res2 => {

                })
                .catch(err2 => {
                  this.logger.error(err2);
                });
            })
            .catch(err1 => {
              this.logger.error(err1);
            });
          resolve(savedData);
        })
        .catch(error => {
          return reject(error);
        });
    }));
  }

}

module.exports = BillService;
