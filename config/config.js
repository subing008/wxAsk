var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'wxask'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/wxask-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'wxask'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/wxask-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'wxask'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/wxask-production'
  }
};

module.exports = config[env];
