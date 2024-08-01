const config = require('config');
const MongoDBConnectionService = require('mongo');
const MONGO_URL = config.get('mongoUrl')
const dbName = 'health-screening'

const service = MongoDBConnectionService();
module.exports = {
    service, dbName, connStr: MONGO_URL, connect: function () {
        return service.connect(dbName, MONGO_URL)
    }
}
