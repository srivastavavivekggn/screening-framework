const HealthCheckController = require('healthcheck');

const MongoDBConnectionService = require('mongo');
const connectionService        = require('./mongo-connection-service');

const healthCheckController = new HealthCheckController();

const ScreeningConfigurations = require('../app/collections/screening/ScreeningConfigurations');

class ConfigurationLoadedHealthCheck extends HealthCheckController.HealthCheck {

    constructor() {

        async function test() {
            return ScreeningConfigurations.confs != undefined ? Promise.resolve(true) : Promise.reject(false)
        }

        async function details() {

            const healthy = await test()

            if(healthy) {
                return Promise.resolve(
                    new HealthCheckController.HealthCheckResult(
                        'Configuration Loaded Health Check',
                        {message: 'Configuration Loaded Health Check Success Message'}
                    )
                )
            } else {
                return Promise.resolve(
                    new HealthCheckController.HealthCheckResult(
                        'Configuration Loaded Health Check',
                        { err:'Configuration Loaded Health Check Failure Message' }
                    )
                )
            }
        }

        super('Configuration Loaded Health Check', test, details)
    }
}

healthCheckController.registerHealthCheck(new MongoDBConnectionService.MongoDBHealthCheck(connectionService.service));
healthCheckController.registerHealthCheck(new ConfigurationLoadedHealthCheck());


module.exports = healthCheckController;