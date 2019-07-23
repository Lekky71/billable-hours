/**
 * Created by Oluwaleke Fakorede on 23/07/2019.
 */
const config = require('../config/settings');

const routes = function routes(server, serviceLocator) {
  const emailController = serviceLocator.get('billController');

  const uploadEndpoint = '/upload';

  server.get({
    path: '/',
    name: 'home',
    version: '1.0.0'
  }, (req, res) => res.send(`Welcome to ${config.appName} API`));

  server.post({
    path: uploadEndpoint,
    name: 'Generate bill for clients',
    version: '1.0.0'
  }, (req, res, next) => emailController.receiveFile(req, res, next));

};

module.exports = routes;
