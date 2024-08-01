const config     = require('config');
const npmPackage = require('../../package.json');

const swaggerJSDoc = require('swagger-jsdoc');

const swaggerSpec = swaggerJSDoc({
                                   swaggerDefinition : {
                                     info     : {
                                       title       : 'Orchestration API',
                                       version     : npmPackage.version,
                                       description : npmPackage.description
                                     },
                                     schemes  : [ config.get('route.scheme') ],
                                     host     : config.get('route.host'),
                                     basePath : config.get('route.path')
                                   },
                                   apis              : [ `${__dirname}/../app/*.js` ]
                                 });

module.exports = swaggerSpec;