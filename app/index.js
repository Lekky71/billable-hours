const dotenv = require('dotenv');

dotenv.config();
const restify = require('restify');
const plugins = restify.plugins;

const config = require('../app/config/settings');
const routes = require('../app/route/route');

// service locator via dependency injection
const serviceLocator = require('./config/di');
const logger = serviceLocator.get('logger');
const server = restify.createServer({
  name: config.appName,
  versions: ['1.0.0']
});

// set API version and allow trailing slashes
server.pre(restify.pre.sanitizePath());

// set request handling and parsing
server.use(plugins.acceptParser(server.acceptable));
server.use(plugins.queryParser());
server.use(plugins.bodyParser());
// server.use(plugins.multipartBodyParser());  // Enabling multipart

// setup Routing and Error Event Handling
routes(server, serviceLocator);

server.get('/output/*', restify.plugins.serveStatic({
  directory: __dirname.replace('app', '')
}));

server.get('/*', restify.plugins.serveStatic({
  directory: __dirname + '/public',
  default: 'index.html'
}));

server.listen(config.port, () => {
  logger.info(`${server.name} is listening at ${server.url}`);
});

module.exports = server;
