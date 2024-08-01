const cacheManager        = require('./cache-manager');
const requestLocalContext = require('./request-local-context');
const request = require('request');

const requestConfig    = new request.Config();
requestConfig.cacheDNS = true;

module.exports = new request(cacheManager, requestLocalContext, requestConfig);