'use strict';

var env = process.env.NODE_ENV || 'development';
//console.log('CONFIG: ' + env);
var config = require(`./${env}`);

module.exports = config;