const config = require('config');

const ExpressRest = require('express-rest');

const expressConfig     = new ExpressRest.Config(config.get('bind.port'), config.get('route.path'));

const requestLocalContext = require('./request-local-context');

const healthCheck       = require('./health-check');
const healthCheckFilter = router => healthCheck.build(router);

const swaggerUi     = require('swagger-ui-express');
const swaggerSpec   = require('./swagger-spec');
const swaggerFilter = router => router.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const prometheus = require('prometheus-client');
const prometheusFilter = () => prometheus.middleware();

module.exports = ExpressRest(expressConfig, requestLocalContext, [
  healthCheckFilter,
  swaggerFilter,
  prometheusFilter
]);
