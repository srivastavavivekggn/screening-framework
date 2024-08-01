const UISchemas           = require("../../../avaframework/extras/schemas/UISchemas");
const FindingDefinitions  = require("./FindingDefinitions");
const textInput           = UISchemas.textInput;
const checkBoxOption      = UISchemas.checkBoxOption;


module.exports = function() {

    const define = UISchemas.define(FindingDefinitions)

    const ElementPool = {

        "userAttestation": define({
            id: "userAttestation",
            type: "picker",
            title: undefined,
            subtitle: "I understand by reporting my screening results, I hereby certify that the information I am providing is true and accurate to the best of my personal knowledge and understand that any material misrepresentation(s) will disqualify me from receiving any wellness incentives.",
            required: true,
            options: [
                checkBoxOption("1", FindingDefinitions.userAttestation, "Proceed", true),
                checkBoxOption("2", FindingDefinitions.userAttestation, "Quit", false)
            ],
            findings: {},
            transport: {}
        }),

        "screeningDate": (findings, dateConstraints) => { return {
            id: "screeningDate",
            type: "dateSelector",
            title: "Screening Date",
            subtitle: "When was your health screening?",
            required: true,
            findingId: "screeningDate",
            notes: "",
            constrain: dateConstraints,
            findings: findings ? findings : {},
            transport: {}
        }},

        "screeningType": options => {
            return define({
                id: "screeningType",
                type: "picker",
                title: "Screening Information",
                subtitle: "What type of location did your screening take place at?",
                required: true,
                options: options,
                findings: {},
                transport: {}
            })
        },

        "bloodPressure": define({
            id: "bloodPressure",
            type: "textField",
            title: "Blood Pressure",
            subtitle: "What are your Systolic and Diastolic blood pressure measurements?",
            required: true,
            options: [
                textInput("1", FindingDefinitions.systolicBloodPressure, "Systolic (mmHG)"),
                textInput("2", FindingDefinitions.diastolicBloodPressure, "Diastolic (mmHG)")
            ],
            findings: {},
            transport: {}
        }),

        "heightMetric": define({
            id: "heightMetric",
            type: "textField",
            title: "Height",
            subtitle: "How tall are you?",
            required: true,
            options: [
                textInput("1", FindingDefinitions.heightMetric, FindingDefinitions.heightMetric.units)
            ],
            findings: {},
            transport: {}
        }),

        "heightImperial": define({
            id: "heightImperial",
            type: "textField",
            title: "Height",
            subtitle: "How tall are you?",
            required: true,
            options: [
                textInput("1", FindingDefinitions.heightImperialFt, FindingDefinitions.heightImperialFt.units),
                textInput("2", FindingDefinitions.heightImperialIn, FindingDefinitions.heightImperialIn.units)
            ],
            findings: {},
            transport: {}
        }),

        "weightMetric": define({
            id: "weightMetric",
            type: "textField",
            title: "Weight",
            subtitle: "How much do you weigh?",
            required: true,
            options: [
                textInput("1", FindingDefinitions.weightMetric, FindingDefinitions.weightMetric.units)
            ],
            findings: {},
            transport: {}
        }),

        "weightImperial": define({
            id: "weightImperial",
            type: "textField",
            title: "Weight",
            subtitle: "How much do you weigh?",
            required: true,
            options: [
                textInput("1", FindingDefinitions.weightImperial, FindingDefinitions.weightImperial.units)
            ],
            findings: {},
            transport: {}
        }),

        "bmi": (defaultValue = "") => define({
            id: "bmi",
            type: "textField",
            title: "Body Mass Index",
            subtitle: "Your BMI is automatically calculated based on your weight and height?",
            required: true,
            options: [
                textInput("1", FindingDefinitions.bmi, FindingDefinitions.bmi.units, defaultValue)
            ],
            findings: {},
            transport: {}
        }),

        "waistCircumferenceImperial": define({
            id: "waistCircumferenceImperial",
            type: "textField",
            title: "Waist Size",
            subtitle: "What is your waist circumference?",
            required: true,
            options: [
                textInput("1", FindingDefinitions.waistCircumferenceImperial, FindingDefinitions.waistCircumferenceImperial.units)
            ],
            findings: {},
            transport: {}
        }),

        "waistCircumferenceMetric": define({
            id: "waistCircumferenceMetric",
            type: "textField",
            title: "Waist Size",
            subtitle: "What is your waist circumference?",
            required: true,
            options: [
                textInput("1", FindingDefinitions.waistCircumferenceMetric, FindingDefinitions.waistCircumferenceMetric.units)
            ],
            transport: {}
        }),

        "totalCholesterol": define({
            id: "totalCholesterol",
            type: "textField",
            title: "Total Cholesterol",
            subtitle: "What is your total cholesterol level?",
            required: true,
            options: [
                textInput("1", FindingDefinitions.totalCholesterol, FindingDefinitions.totalCholesterol.units)
            ],
            findings: {},
            transport: {}
        }),

        "hdlCholesterol": define({
            id: "hdlCholesterol",
            type: "textField",
            title: "HDL Cholesterol",
            subtitle: "What is your HDL cholesterol level?",
            required: true,
            options: [
                textInput("1", FindingDefinitions.hdlCholesterol, FindingDefinitions.hdlCholesterol.units)
            ],
            findings: {},
            transport: {}
        }),

        "ldlCholesterol": define({
            id: "ldlCholesterol",
            type: "textField",
            title: "LDL Cholesterol",
            subtitle: "What is your LDL cholesterol level?",
            required: true,
            options: [
                textInput("1", FindingDefinitions.ldlCholesterol, FindingDefinitions.ldlCholesterol.units)
            ],
            findings: {},
            transport: {}
        }),

        "vldlCholesterol": define({
            id: "vldlCholesterol",
            type: "textField",
            title: "VLDL Cholesterol",
            subtitle: "What is your VLDL cholesterol level?",
            required: true,
            options: [
                textInput("1", FindingDefinitions.vldlCholesterol, FindingDefinitions.vldlCholesterol.units)
            ],
            findings: {},
            transport: {}
        }),

        "triglycerides": define({
            id: "triglycerides",
            type: "textField",
            title: "Triglycerides",
            subtitle: "What is your Triglyceride level?",
            required: true,
            options: [
                textInput("1", FindingDefinitions.triglycerides, FindingDefinitions.triglycerides.units)
            ],
            findings: {},
            transport: {}
        }),

        "totalHDLCholesterol": (defaultValue = "") => define({
            id: "totalHDLCholesterol",
            type: "textField",
            title: "Total / HDL Ratio",
            subtitle: "What is your Total / HDL Ratio?",
            required: true,
            options: [
                textInput("1", FindingDefinitions.totalHDLCholesterol, FindingDefinitions.totalHDLCholesterol.units, defaultValue)
            ],
            findings: {},
            transport: {}
        }),

        "fasted": define({
            id: "fasted",
            type: "singleSelect",
            title: "Glucose",
            subtitle: "Did you fast before your Glucose measurement?",
            required: true,
            options: [
                checkBoxOption("1", FindingDefinitions.fasted, "Yes", true),
                checkBoxOption("2", FindingDefinitions.fasted, "No", false)
            ],
            findings: {},
            transport: {}
        }),

        "glucoseFasting": define({
            id: "glucoseFasting",
            type: "textField",
            title: "Glucose",
            subtitle: "What is your Fasting Glucose level?",
            required: true,
            options: [
                textInput("1", FindingDefinitions.glucoseFasting, `Fasting (${FindingDefinitions.glucoseFasting.units})`),
            ],
            findings: {},
            transport: {}
        }),

        "glucoseNonFasting": define({
            id: "glucoseNonFasting",
            type: "textField",
            title: "Glucose",
            subtitle: "What is your Non-Fasting Glucose level?",
            required: true,
            options: [
                textInput("1", FindingDefinitions.glucoseNonFasting, `Non-Fasting (${FindingDefinitions.glucoseNonFasting.units})`)
            ],
            findings: {},
            transport: {}
        }),

        "a1c": define({
            id: "a1c",
            type: "textField",
            title: "A1C",
            subtitle: "What is your A1C level?",
            required: true,
            options: [
                textInput("1", FindingDefinitions.a1c, FindingDefinitions.a1c.units)
            ],
            findings: {},
            transport: {}
        }),

        "tobaccoUse": define({
            id: "tobaccoUse",
            type: "singleSelect",
            title: "Tobacco Use",
            subtitle: "Do you currently use tobacco products?",
            required: true,
            options: [
                checkBoxOption("1", FindingDefinitions.tobaccoUse, "Yes", "Tobacco User"),
                checkBoxOption("2", FindingDefinitions.tobaccoUse, "No", "Ex-Tobacco User"),
                checkBoxOption("3", FindingDefinitions.tobaccoUse, "Never Used", "Never Used Tobacco")
            ],
            findings: {},
            transport: {}
        }),

        "fluVaccine": define({
            id: "fluVaccine",
            type: "singleSelect",
            title: "Flu Vaccination",
            subtitle: "Have you received a flu vaccine within the last 12 months?",
            required: true,
            options: [
                checkBoxOption("1", FindingDefinitions.fluVaccine, "Yes", true),
                checkBoxOption("2", FindingDefinitions.fluVaccine, "No", false)
            ],
            findings: {},
            transport: {}
        }),

        "fluVaccineDate": (findings, dateConstraints) => { return {
            id: "fluVaccineDate",
            type: "dateSelector",
            title: "Flu Vaccination Date",
            subtitle: "When was your flu vaccination?",
            required: true,
            findingId: "screeningDate",
            notes: "Month is 0-11 (Jan-Dec)",
            constrain: dateConstraints,
            findings: findings ? findings : {},
            transport: {}
        }}

    }

    return ElementPool
}()

