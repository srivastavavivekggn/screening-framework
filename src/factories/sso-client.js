const sso = require('config').get('sso');

const request = require('./request');

const SSOClient = require('@srivastavavivekggn/sso-client');
const Config    = SSOClient.Config;

const ssoConfig       = new Config();
ssoConfig.credentials = {id : sso.id, secret : sso.secret};

module.exports = new SSOClient(request, sso.host, ssoConfig);