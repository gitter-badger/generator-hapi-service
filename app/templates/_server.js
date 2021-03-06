/**
 * Config Location
 */
process.env.GETCONFIG_ROOT = './config';

/**
 * Set default node environment
 * @type {string|*}
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var Hapi = require('hapi');
var server = new Hapi.Server();
var good = require('good');
var goodConsole = require('good-console');
var goodFile = require('good-file');
var goodHttp = require('good-http');
var fs = require('fs');
var path = require('path');

/**
 * Config
  */
var config = require('getconfig');

<% if (includeDatabase) { %>/**
 * Database
 */
var Database = require('./config/database');
<% } %>

/**
 * Config for Good
 * @type {{opsInterval: number, reporters: *[]}}
 */
var goodConfig = {
    opsInterval: 1000,
    reporters: [{
        reporter: goodConsole,
        args:[{ log: '*', response: '*' }]
    }, {
        reporter: goodFile,
        args: ['./test/awesome_log', { ops: '*' }]
    }, {
        reporter: goodHttp,
        args: [{ error: '*' }, 'http://prod.logs:3000', {
            threshold: 20,
            wreck: {
                headers: { 'x-api-key' : 12345 }
            }
        }]
    }]
};

/**
 * Creating Server connection with our configuration
 */
server.connection({
  port: process.env.PORT || config.server.port || 8000
});

/**
 * Adding routes
 * TODO: limit these to *Controller files
 */
var normalizedPath = path.join(__dirname, "controllers");
fs.readdirSync(normalizedPath).forEach(function(file) {
  server.route(
    require("./controllers/" + file)
  );
});

/**
 * Adding plugins
 */
server.register([
  {
    register: require('lout'),
    options: {}
  },{
    register: good,
    options: goodConfig
  }
], function (err) {
  if (err) {
    console.log('Failed to load a plugin:', err);
  }

  else {
    /**
     * Starting server
     */
    if (!module.parent) {
      server.start(function () {
        console.info('Server started at ' + server.info.uri);
      });
    }
  }
});

module.exports = server;