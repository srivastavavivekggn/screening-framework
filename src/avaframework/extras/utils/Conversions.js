const convert = require('convert-units')


class Conversions {

    lbToKg(lbs) {
        return [convert(lbs).from('lb').to('kg'), "kg"]
    }

    inToCm(inches) {
        return [convert(inches).from('in').to('cm'), "cm"]
    }

    inToM(inches) {
        return [convert(inches).from('in').to('m'), "m"]
    }

    cmToM(inches) {
        return [convert(inches).from('cm').to('m'), "m"]
    }
}

module.exports = new Conversions()

