'use strict';

module.exports = {
  env: 'development',
  aws_config: {
    region: 'local',
    endpoint: 'http://localhost:8000',
  },
};

console.log('LOADED DEVELOPMENT');