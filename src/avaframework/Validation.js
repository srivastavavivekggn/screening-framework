const Errors = require("./Errors")


const Validation = {

    range: (findingName, min, max, unit) => value => {
        return value > max || value < min ? Errors.error(
            "validation error",
            `${findingName} must be between ${min} and ${max} ${unit ? `${unit}` : ""}`
        ) : null
    },

    boolean: findingName => value => {
        return typeof(value) === "boolean" ? null : Errors.error(
            "validation error",
            `${findingName} must be boolean 'true' or 'false'`
        )
    },

    option: (findingName, options) => input => {
        return !options.has(input) ? Errors.error(
            "valid input error",
            `${findingName} must be one of the following: ${[...options].join(", ")}`
        ) : null
    },

    inputLength: (findingName, length) => input => {
        return input.length < length ? Errors.error(
            "valid input error",
            `Input for ${findingName} must be at least ${length} characters`
        ) : null
    },

    validate(findings, findingDefinitions) {
        return Object.entries(findings).map(([key, value]) => {
            const  definition = findingDefinitions[key]
            return definition ? definition.validation(value) : null
        }).filter(elem => elem != null)
    }
}

module.exports = Validation