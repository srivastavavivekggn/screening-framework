const logger = require('../factories/logger-factory')


class Errors {

    static errorResponse(msg, status, list) {
        logger.log(msg)
        return {
            "error" : msg,
            "status": status,
            "errors": list
        }
    }

    static error(type, msg) {
        return {
            type: type,
            error : msg
        }
    }

    static toErrorResponse(e) {
        logger.log("toErrorResponse = " + JSON.stringify(e))
        return {
            "error" : e.error ? e.error : "Internal Collection Logic Or Server Error",
            "status": e.status ? e.status : 500,
            "errors": e.list ? e.list : e.errors ? e.errors : undefined
        }
    }

    static get badRequestNoCollectionError() {
        return Errors.badRequestError("Assessment")
    }

    static get badRequestNoSecureIdError() {
        return Errors.badRequestError("Secure Id")
    }

    static badRequestError(msg) {
        return Errors.errorResponse(`Bad Request: ${msg} Not Defined`, 400, undefined)
    }

    static validationError(validationErrors) {
        return Errors.errorResponse("Validation Errors", 400, validationErrors)
    }
}

module.exports = Errors
