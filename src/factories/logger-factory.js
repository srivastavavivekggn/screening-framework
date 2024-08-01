const bunyan     = require('bunyan');

const npmPackage = require('../../package.json');

const logger = bunyan.createLogger({name : npmPackage.name});

module.exports = {
  log : (method, details) => {
    logger.info(Object.assign({time : Math.floor(new Date().getTime() / 1000), method}, details));
  }
};