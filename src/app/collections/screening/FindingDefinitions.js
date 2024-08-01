/* :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
Notable:
Findings if not expired could be used in pre-logic to skip answered questions
Validations are associated with the findings
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: */



const Validation = require("../../../avaframework/Validation")

const FindingDefinitions = {

    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // Documentation:
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    //
    // { ..., isList: true, ...} If a finding accepts multiple values
    //
    // Consider defining encrypt / decrypt options for PII findings that could exist near secure id or PHI
    //
    // clearFindings: [id, id, id] to clear findings prior to writing
    //
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    "userAttestation": {
        id: "userAttestation",
        name: "userAttestation",
        desc: "User Attestation",
        type: "BOOLEAN",
        units: "",
        expiresAfterDuration: 0,
        get validation(){ return Validation.boolean(this.name) },
        clearFindings: undefined
    },

    "screeningType": {
        id: "screeningType",
        name: "screeningType",
        type: "STRING",
        units: "",
        expiresAfterDuration: 0,
        options: new Set([
            "CVS",
            "Home Kit",
            "Onsite",
            "PCP"
        ]),
        get validation(){ return Validation.option(this.name, this.options) },
        clearFindings: undefined
    },

    "screeningDate": {
        id: "screeningDate",
        name: "screeningDate",
        desc: "Screening Date",
        type: "DATE",
        units: "DATE",
        expiresAfterDuration: 0,
        get validation(){ return () => null }, 
        clearFindings: undefined
    },

    "phoneNumber": {
        id: "phoneNumber",
        name: "phoneNumber",
        desc: "Phone Number",
        type: "STRING",
        units: "",
        expiresAfterDuration: 0,
        get validation(){ return Validation.inputLength(this.name, 10) },
        clearFindings: undefined
    },

    "providerName": {
        id: "providerName",
        name: "providerName",
        desc: "Provider Name",
        type: "STRING",
        units: "",
        expiresAfterDuration: 0,
        get validation(){ return Validation.inputLength(this.name, 3) },
        clearFindings: undefined
    },

    "systolicBloodPressure": {
        id: "systolicBloodPressure",
        name: "systolicBloodPressure",
        desc: "Systolic Blood Pressure",
        type: "INTEGER",
        units: "mmHG",
        expiresAfterDuration: 0,
        range: {
            min: 70,
            max: 300
        },
        get validation(){ return Validation.range(this.name, this.range.min, this.range.max, this.units) },
        clearFindings: undefined
    },

    "diastolicBloodPressure": {
        id: "diastolicBloodPressure",
        name: "diastolicBloodPressure",
        desc: "Diastolic Blood Pressure",
        type: "INTEGER",
        units: "mmHG",
        expiresAfterDuration: 0,
        range: {
            min: 40,
            max: 200
        },
        get validation(){ return Validation.range(this.name, this.range.min, this.range.max, this.units) },
        clearFindings: undefined
    },

    "weightMetric": {
        id: "weightMetric",
        name: "weightMetric",
        desc: "Weight",
        type: "FLOAT",
        units: "kg",
        expiresAfterDuration: 0,
        range: {
            min: 30,
            max: 320,
            inc: 0.1
        },
        get validation(){ return Validation.range(this.name, this.range.min, this.range.max, this.units) },
        clearFindings: undefined
    },

    "weightImperial": {
        id: "weightImperial",
        name: "weightImperial",
        desc: "Weight",
        type: "FLOAT",
        units: "lbs",
        expiresAfterDuration: 0,
        range: {
            min: 70,
            max: 700,
            inc: 0.1
        },
        get validation(){ return Validation.range(this.name, this.range.min, this.range.max, this.units) },
        clearFindings: undefined
    },

    "heightMetric": {
        id: "heightMetric",
        name: "heightMetric",
        desc: "Height",
        type: "FLOAT",
        units: "cm",
        expiresAfterDuration: 0,
        range: {
            min: 60,
            max: 240,
            inc: 0.25
        },
        get validation(){ return Validation.range(this.name, this.range.min, this.range.max, this.units) },
        clearFindings: undefined
    },

    "heightImperialIn": {
        id: "heightImperialIn",
        name: "heightImperialIn",
        desc: "Height Inches",
        type: "INTEGER",
        units: "in",
        expiresAfterDuration: 0,
        range: {
            min: 0,
            max: 11,
            inc: 0.25
        },
        get validation(){ return Validation.range(this.name, this.range.min, this.range.max, this.units) },
        clearFindings: undefined
    },

    "heightImperialFt": {
        id: "heightImperialFt",
        name: "heightImperialFt",
        desc: "Height Ft",
        type: "INTEGER",
        units: "ft",
        expiresAfterDuration: 0,
        range: {
            min: 0,
            max: 8,
            inc: 0.25
        },
        get validation(){ return Validation.range(this.name, this.range.min, this.range.max, this.units) },
        clearFindings: undefined
    },

    "heightImperial": {
        id: "heightImperial",
        name: "heightImperial",
        desc: "Height",
        type: "FLOAT",
        units: "in",
        expiresAfterDuration: 0,
        range: {
            min: 24,
            max: 96,
            inc: 0.25
        },
        get validation(){ return Validation.range(this.name, this.range.min, this.range.max, this.units) },
        clearFindings: undefined
    },

    "bmi": {
        id: "bmi",
        name: "bmi",
        desc: "Body Mass Index (BMI)",
        type: "FLOAT",
        units: "kg/m2",
        expiresAfterDuration: 0,
        range: {
            min: 10,
            max: 80,
            inc: 0.1
        },
        get validation(){ return Validation.range(this.name, this.range.min, this.range.max, this.units) },
        clearFindings: undefined
    },

    "waistCircumferenceImperial": {
        id: "waistCircumferenceImperial",
        name: "waistCircumferenceImperial",
        desc: "Waist circumference (Imperial)",
        type: "INTEGER",
        units: "in",
        expiresAfterDuration: 0,
        range: {
            min: 10,
            max: 80
        },
        get validation(){ return Validation.range(this.name, this.range.min, this.range.max, this.units) },
        clearFindings: undefined
    },

    "waistCircumferenceMetric": {
        id: "waistCircumferenceMetric",
        name: "waistCircumferenceMetric",
        desc: "Waist circumference (metric)",
        type: "INTEGER",
        units: "cm",
        expiresAfterDuration: 0,
        range: {
            min: 25,
            max: 200
        },
        get validation(){ return Validation.range(this.name, this.range.min, this.range.max, this.units) },
        clearFindings: undefined
    },

    "totalCholesterol": {
        id: "totalCholesterol",
        name: "totalCholesterol",
        desc: "Total Cholesterol",
        type: "INTEGER",
        units: "mg/dL",
        expiresAfterDuration: 0,
        range: {
            min: 50,
            max: 300
        },
        get validation(){ return Validation.range(this.name, this.range.min, this.range.max, this.units) },
        clearFindings: undefined
    },

    "hdlCholesterol": {
        id: "hdlCholesterol",
        name: "hdlCholesterol",
        desc: "HDL Cholesterol",
        type: "INTEGER",
        units: "mg/dL",
        expiresAfterDuration: 0,
        range: {
            min: 5,
            max: 120
        },
        get validation(){ return Validation.range(this.name, this.range.min, this.range.max, this.units) },
        clearFindings: undefined
    },

    "ldlCholesterol": {
        id: "ldlCholesterol",
        name: "ldlCholesterol",
        desc: "LDL Cholesterol",
        type: "INTEGER",
        units: "mg/dL",
        expiresAfterDuration: 0,
        range: {
            min: 0,
            max: 220
        },
        get validation(){ return Validation.range(this.name, this.range.min, this.range.max, this.units) },
        clearFindings: undefined
    },

    "vldlCholesterol": {
        id: "vldlCholesterol",
        name: "vldlCholesterol",
        desc: "VLDL Cholesterol",
        type: "INTEGER",
        units: "mg/dL",
        expiresAfterDuration: 0,
        range: {
            min: 0,
            max: 60
        },
        get validation(){ return Validation.range(this.name, this.range.min, this.range.max, this.units) },
        clearFindings: undefined
    },

    "triglycerides": {
        id: "triglycerides",
        name: "triglycerides",
        desc: "Triglycerides",
        type: "INTEGER",
        units: "mg/dL",
        expiresAfterDuration: 0,
        range: {
            min: 10,
            max: 300
        },
        get validation(){ return Validation.range(this.name, this.range.min, this.range.max, this.units) },
        clearFindings: undefined
    },

    "totalHDLCholesterol": {
        id: "totalHDLCholesterol",
        name: "totalHDLCholesterol",
        desc: "Total / HDL Cholesterol",
        type: "FLOAT",
        units: "",
        expiresAfterDuration: 0,
        range: {
            min: 1,
            max: 38,
            inc: 0.1 
        },
        get validation(){ return Validation.range(this.name, this.range.min, this.range.max, this.units) },
        clearFindings: undefined
    },

    "fasted": {
        id: "fasted",
        name: "fasted",
        desc: "Fasted",
        type: "BOOLEAN",
        units: "",
        expiresAfterDuration: 0,
        range: undefined,
        get validation(){ return Validation.boolean(this.name) },
        clearFindings: undefined
    },

    "glucoseFasting": {
        id: "glucoseFasting",
        name: "glucoseFasting",
        desc: "Glucose, Fasting",
        type: "INTEGER",
        units: "mg/dL",
        expiresAfterDuration: 0,
        range: {
            min: 50,
            max: 200
        },
        get validation(){ return Validation.range(this.name, this.range.min, this.range.max, this.units) },
        clearFindings: undefined
    },

    "glucoseNonFasting": {
        id: "glucoseNonFasting",
        name: "glucoseNonFasting",
        desc: "Glucose, Non-Fasting",
        type: "INTEGER",
        units: "mg/dL",
        expiresAfterDuration: 0,
        range: {
            min: 50,
            max: 350
        },
        get validation(){ return Validation.range(this.name, this.range.min, this.range.max, this.units) },
        clearFindings: undefined
    },

    "a1c": {
        id: "a1c",
        name: "a1c",
        desc: "A1C",
        type: "FLOAT",
        units: "%",
        expiresAfterDuration: 0,
        range: {
            min: 0,
            max: 12
        },
        get validation(){ return Validation.range(this.name, this.range.min, this.range.max, this.units) },
        clearFindings: undefined
    },

    "tobaccoUse": {
        id: "tobaccoUse",
        name: "tobaccoUse",
        desc: "Tobacco Use",
        type: "STRING",
        units: "",
        expiresAfterDuration: 0,
        options: new Set([
            "Tobacco User",
            "Ex-Tobacco User",
            "Never Used Tobacco"
        ]),
        get validation(){ return Validation.option(this.name, this.options) },
        clearFindings: undefined
    },

    "fluVaccine": {
        id: "fluVaccine",
        name: "fluVaccine",
        desc: "Flu Vaccine",
        type: "BOOLEAN",
        units: "",
        expiresAfterDuration: 0,
        get validation(){ return Validation.boolean(this.name) },
        clearFindings: undefined
    },

    "fluVaccineDate": {
        id: "fluVaccineDate",
        name: "fluVaccineDate",
        desc: "Flu Vaccine Date",
        type: "DATE",
        units: "DATE",
        expiresAfterDuration: 0,
        get validation(){ return () => null }, 
        clearFindings: undefined
    }
}

module.exports = FindingDefinitions



