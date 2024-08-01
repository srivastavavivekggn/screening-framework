const Errors    = require('../../../avaframework/Errors')
const logger    = require('../../../factories/logger-factory')

const wrap = (promise) => {
    return promise
        .then(value => {
            return [null, value]
        }).catch(err =>
            [err]
        )
}

// param connnection example:
// somefunction((credentials = '', params = '') => `mongodb://${credentials}${mongoConf.shards}:${mongoConf.port}/ava${params}`)

const execute = (dbName, connection) => async (f, errorMsg) => {

    let err, client, result

    try {
        [err, client] = await wrap(connection())
        if (err) {
            logger.log(err.stack)
            result = Errors.errorResponse(`${err.message}:\n${err.stack}`, 500, undefined)
        } else {
            const db = client.db(dbName)
            result = await f(db)
        }
    } catch (err) {
        logger.log(err.stack)
        result = Errors.errorResponse(`${errorMsg}:\n${err.stack}`, 500, undefined)
    }

    if (client) {
        client.close()
    }

    return result
}

module.exports = execute