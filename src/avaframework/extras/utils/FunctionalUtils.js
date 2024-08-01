const logger = require('../../../factories/logger-factory')
const Errors = require("../../../avaframework/Errors")


class FunctionalUtils {

    pipeline(value, ...functions) {
        async function execute(value, func) {
            value = await value
            if (value.success !== undefined) return value.success
            if (value.error   !== undefined) return value
            if (func.length   <=          0) return value
            return execute(func[0](value), func.slice(1))
        }
        return execute(value, functions.map(f => FunctionalUtils.wrap(f)))
    }

    static wrap(f) {
        return async(ctx) => {
            try {
                return await f(ctx)
            } catch (error) {
                logger.log(error.error ? error.error : error.msg ? error.msg : error.stack)
                return error.error ? error : Errors.errorResponse(error.message, 500)
            }
        }
    }
}

module.exports = new FunctionalUtils()
