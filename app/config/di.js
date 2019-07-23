/**
 * Created by Oluwaleke Fakorede on 15/12/2018.
 */
const winston = require('winston');

const config = require('./settings');
const serviceLocator = require('../lib/serviceLocator');
const BillController = require('../controllers/bill.controller');
const BillService = require('../service/bill.service');

/**
 * Returns an instance of logger
 */
/**
 * Returns an instance of logger for the App
 */
serviceLocator.register('logger', () => {
  const consoleTransport = new (winston.transports.Console)({
    datePattern: 'yyyy-MM-dd.',
    prepend: true,
    json: false,
    colorize: true,
    level: process.env.ENV === 'development' ? 'debug' : 'info',
  });
  const transports = [consoleTransport];
  return winston.createLogger({
    transports,
  });
});

// SERVICE INSTANCES

/**
 * Creates instances of services
 */
serviceLocator.register('billService', (serviceLocator) => {
  const logger = serviceLocator.get('logger');
  return new BillService(logger);
});

// CONTROLLER INSTANCES

/**
 * Creates instances of controllers
 */
serviceLocator.register('billController', (serviceLocator) => {
  const logger = serviceLocator.get('logger');
  const service = serviceLocator.get('billService');
  return new BillController(logger, service);
});

module.exports = serviceLocator;
