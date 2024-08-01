const Validation              = require("../../../avaframework/Validation");
const Errors                  = require("../../../avaframework/Errors");
const Element                 = require("../../../avaframework/Element");
const FindingDefinitions      = require("./FindingDefinitions");
const ElementPool             = require("./ElementPool");
const ScreeningConfigurations = require("./ScreeningConfigurations");
const Conversions             = require("../../../avaframework/extras/utils/Conversions");
const Event                   = require("./eventing/Event");
const UISchemas               = require("../../../avaframework/extras/schemas/UISchemas");
const option                  = UISchemas.option;


module.exports = function() {

    const unitPref = (ctx, units) => ctx.query.parameters.unitPreference.toLowerCase() === units

    const requireUnit = (ctx, units, id) =>
        ctx.element = !unitPref(ctx, units) ? Element.next(ctx.collection.elements, id) : undefined

    function configure(ctx, id) {
        const conf = ScreeningConfigurations.getScreeningConfiguration(ctx)
        if (conf.hide.includes(id)) ctx.element = Element.next(ctx.collection.elements, id)
    }

    function setRequired(ctx, id, element) {
        element.required = isRequiredElement(ctx, id)
        return element
    }

    function isRequiredElement(ctx, id) {
        const conf = ScreeningConfigurations.getScreeningConfiguration(ctx)
        return !conf.optional.includes(id)
    }

    function requireInputFor(ctx, id, ...findingIds) {
        if (!isRequiredElement(ctx, id)) return
        const missingFindings = findingIds.filter(findingId => ctx.findings[findingId] === undefined)
        const feedback = missingFindings.map(findingId => Errors.error("validation error", `Must provide required input for ${FindingDefinitions[findingId].desc}`))
        if (feedback.length > 0) throw Errors.errorResponse("Validation Errors", 400, feedback)
    }

    function requireAtleastOne(ctx, id, ...findingIds) {
        if (!isRequiredElement(ctx, id)) return
        const suppliedFindings = findingIds.filter(findingId => ctx.findings[findingId] !== undefined)
        if (suppliedFindings.length < 1) throw Errors.errorResponse("Must provide at least one input", 400)
    }

    function calcBMI(ctx) {
        if (unitPref(ctx, "metric") && ctx.transport.heightMetric !== undefined && ctx.transport.weightMetric !== undefined) {
            const [heightMetric,] = Conversions.cmToM(ctx.transport.heightMetric)
            return (ctx.transport.weightMetric / Math.pow(heightMetric, 2)).toFixed(2)
        }
        if (unitPref(ctx, "imperial") && ctx.transport.heightImperial !== undefined && ctx.transport.weightImperial !== undefined) {
            const [weightMetric,] = Conversions.lbToKg(ctx.transport.weightImperial)
            const [heightMetric,] = Conversions.inToM(ctx.transport.heightImperial)
            return (weightMetric / Math.pow(heightMetric, 2)).toFixed(2)
        }
        return ""
    }

    function calcTotalHDLCholesterol(ctx) {
        return !ctx.transport.totalCholesterol || !ctx.transport.hdlCholesterol ? "" : (ctx.transport.totalCholesterol / ctx.transport.hdlCholesterol).toFixed(2)
    }

    function toInches(ctx) {
        const ft = ctx.findings.heightImperialFt
        const inches = ctx.findings.heightImperialIn
        ctx.findings.heightImperial = (ft !== undefined && inches !== undefined) ? ft * 12 + inches :
            (ft === undefined && inches !== undefined) ? inches :
                (ft != undefined && inches === undefined) ? ft : undefined
        if (ctx.findings.heightImperial === undefined) throw Errors.errorResponse("Must provide values for ft and/or inches", 400)
    }

    function validateSubmission(ctx) {
        const validationErrors = Validation.validate(ctx.findings, ctx.collection.findingDefinitions)
        if (validationErrors.length > 0) throw Errors.validationError(validationErrors)
        return ctx
    }

    function toNoonGMT(day, month, year) {
        return new Date(Date.UTC(year, month, day, 12, 0, 0)).getTime();
    }

    function getDateConstraint(allowFutureDates, allowPastDates, min, max) {
        return {
            allowFutureDates: allowFutureDates,
            allowPastDates: allowPastDates
        }
    }

    const ScreeningElements = [

        {
            id: "userAttestation",
            async prelogic(ctx) {
                configure(ctx, this.id)
            },
            element(ctx) {
                return setRequired(ctx, this.id, ElementPool.userAttestation)
            },
            async answerLogic(ctx) {
                requireInputFor(ctx, this.id, "userAttestation")
                if (ctx.findings.userAttestation !== true) ctx.element = Element.to(ctx.collection.elements, "screeningFormAborted")
            },
            inputContext: ["userAttestation"],
            outputContext: ["userAttestation"]
        },

        {
            id: "screeningType",
            async prelogic(ctx) {
                configure(ctx, this.id)
                if (ctx.query.parameters.screeningType !== undefined) {
                    ctx.transport.screeningType = ctx.query.parameters.screeningType
                    ctx.found[FindingDefinitions.screeningType.id] = ctx.query.parameters.screeningType
                }
            },
            element(ctx) {
                const conf = ScreeningConfigurations.getScreeningConfiguration(ctx)
                if (conf.sources === undefined || conf.sources.length === 0) throw Errors.errorResponse(`Source options have not been defined in for this health screening configuration '${ctx.query.parameters.screeningConf}'. Please contact configuration administrator to resolve.`, 404)
                const options = [...conf.sources.entries()].map(([index, value]) => option(index, FindingDefinitions.screeningType, value))
                return setRequired(ctx, this.id, ElementPool.screeningType(options))
            },
            async answerLogic(ctx) {
                requireInputFor(ctx, this.id, "screeningType") 
                ctx.transport.screeningType = ctx.findings.screeningType || ctx.query.parameters.screeningType
            },
            inputContext: ["screeningType"],
            outputContext: ["screeningType"]
        },

        {
            id: "screeningDate",
            async prelogic(ctx) {
                configure(ctx, this.id)
            },
            element(ctx) {
                return setRequired(ctx, this.id, ElementPool.screeningDate(undefined, getDateConstraint(false, true)))
            },
            async preAnswerLogic(ctx) { 
                if (ctx.findings.day !== undefined && ctx.findings.month !== undefined && ctx.findings.year !== undefined)
                    ctx.transport.screeningDate = toNoonGMT(ctx.findings.day, ctx.findings.month, ctx.findings.year)
                else throw Errors.errorResponse("Must provide value for day, month, and year", 400)
            },
            async answerLogic(ctx) {
            },
            inputContext: ["screeningDate"],
            outputContext: ["screeningDate"]
        },

        {
            id: "bloodPressure",
            async prelogic(ctx) {
                configure(ctx, this.id)
            },
            element(ctx) {
                return setRequired(ctx, this.id, ElementPool.bloodPressure)
            },
            async answerLogic(ctx) {
                if (isRequiredElement(ctx, this.id))
                    requireInputFor(ctx, this.id, "systolicBloodPressure", "diastolicBloodPressure")
            },
            inputContext: ["bloodPressure"],
            outputContext: ["bloodPressure"]
        },
        {
            id: "heightMetric",
            async prelogic(ctx) {
                configure(ctx, this.id)
                requireUnit(ctx, "metric", this.id)
            },
            element(ctx) {
                return setRequired(ctx, this.id, ElementPool.heightMetric)
            },
            async answerLogic(ctx) {
                if (isRequiredElement(ctx, this.id))
                    requireInputFor(ctx, this.id, "heightMetric")
                ctx.transport.heightMetric = ctx.findings.heightMetric
            },
            inputContext: ["heightMetric"],
            outputContext: ["heightMetric"]
        },

        {
            id: "heightImperial",
            async prelogic(ctx) {
                configure(ctx, this.id)
                requireUnit(ctx, "imperial", this.id)
            },
            element(ctx) {
                return setRequired(ctx, this.id, ElementPool.heightImperial)
            },
            async preAnswerLogic(ctx) {
                if (ctx.findings.heightImperialFt !== undefined && ctx.findings.heightImperialIn !== undefined) {
                    toInches(ctx)
                    validateSubmission(ctx)
                    ctx.transport.heightImperial = ctx.findings.heightImperial
                }
                if (isRequiredElement(ctx, this.id))
                    requireInputFor(ctx, this.id, "heightImperial")
            },
            async answerLogic(ctx) {
            },
            inputContext: ["heightImperial"],
            outputContext: ["heightImperial"]
        },

        {
            id: "weightMetric",
            async prelogic(ctx) {
                configure(ctx, this.id)
                requireUnit(ctx, "metric", this.id)
            },
            element(ctx) {
                return setRequired(ctx, this.id, ElementPool.weightMetric)
            },
            async answerLogic(ctx) {
                if (isRequiredElement(ctx, this.id))
                    requireInputFor(ctx, this.id, "weightMetric")
                ctx.transport.weightMetric = ctx.findings.weightMetric
            },
            inputContext: ["weightMetric"],
            outputContext: ["weightMetric"]
        },

        {
            id: "weightImperial",
            async prelogic(ctx) {
                configure(ctx, this.id)
                requireUnit(ctx, "imperial", this.id)
            },
            element(ctx) {
                return setRequired(ctx, this.id, ElementPool.weightImperial)
            },
            async answerLogic(ctx) {
                if (isRequiredElement(ctx, this.id))
                    requireInputFor(ctx, this.id, "weightImperial")
                ctx.transport.weightImperial = ctx.findings.weightImperial
            },
            inputContext: ["weightImperial"],
            outputContext: ["weightImperial"]
        },

        {
            id: "bmi",
            async prelogic(ctx) {
                configure(ctx, this.id)
                ctx.findings.bmi = calcBMI(ctx)
            },
            element(ctx) {
                return setRequired(ctx, this.id, ElementPool.bmi(ctx.findings.bmi))
            },
            async answerLogic(ctx) {
                if (isRequiredElement(ctx, this.id))
                    requireInputFor(ctx, this.id, "bmi")
            },
            inputContext: ["bmi"],
            outputContext: ["bmi"]
        },

        {
            id: "waistCircumferenceMetric",
            async prelogic(ctx) {
                configure(ctx, this.id)
                requireUnit(ctx, "metric", this.id)
            },
            element(ctx) {
                return setRequired(ctx, this.id, ElementPool.waistCircumferenceMetric)
            },
            async answerLogic(ctx) {
                if (isRequiredElement(ctx, this.id))
                    requireInputFor(ctx, this.id, "waistCircumferenceMetric")
            },
            inputContext: ["waistCircumferenceMetric"],
            outputContext: ["waistCircumferenceMetric"]
        },

        {
            id: "waistCircumferenceImperial",
            async prelogic(ctx) {
                configure(ctx, this.id)
                requireUnit(ctx, "imperial", this.id)
            },
            element(ctx) {
                return setRequired(ctx, this.id, ElementPool.waistCircumferenceImperial)
            },
            async answerLogic(ctx) {
                if (isRequiredElement(ctx, this.id))
                    requireInputFor(ctx, this.id, "waistCircumferenceImperial")
            },
            inputContext: ["waistCircumferenceImperial"],
            outputContext: ["waistCircumferenceImperial"]
        },

        {
            id: "totalCholesterol",
            async prelogic(ctx) {
                configure(ctx, this.id)
            },
            element(ctx) {
                return setRequired(ctx, this.id, ElementPool.totalCholesterol)
            },
            async answerLogic(ctx) {
                if (isRequiredElement(ctx, this.id))
                    requireInputFor(ctx, this.id, "totalCholesterol")
                ctx.transport.totalCholesterol = ctx.findings.totalCholesterol
            },
            inputContext: ["totalCholesterol"],
            outputContext: ["totalCholesterol"]
        },

        {
            id: "hdlCholesterol",
            async prelogic(ctx) {
                configure(ctx, this.id)
            },
            element(ctx) {
                return setRequired(ctx, this.id, ElementPool.hdlCholesterol)
            },
            async answerLogic(ctx) {
                if (isRequiredElement(ctx, this.id))
                    requireInputFor(ctx, this.id, "hdlCholesterol")
                ctx.transport.hdlCholesterol = ctx.findings.hdlCholesterol
            },
            inputContext: ["hdlCholesterol"],
            outputContext: ["hdlCholesterol"]
        },

        {
            id: "ldlCholesterol",
            async prelogic(ctx) {
                configure(ctx, this.id)
            },
            element(ctx) {
                return setRequired(ctx, this.id, ElementPool.ldlCholesterol)
            },
            async answerLogic(ctx) {
                if (isRequiredElement(ctx, this.id))
                    requireInputFor(ctx, this.id, "ldlCholesterol")
            },
            inputContext: ["ldlCholesterol"],
            outputContext: ["ldlCholesterol"]
        },

        {
            id: "vldlCholesterol",
            async prelogic(ctx) {
                configure(ctx, this.id)
            },
            element(ctx) {
                return setRequired(ctx, this.id, ElementPool.vldlCholesterol)
            },
            async answerLogic(ctx) {
                if (isRequiredElement(ctx, this.id))
                    requireInputFor(ctx, this.id, "vldlCholesterol")
            },
            inputContext: ["vldlCholesterol"],
            outputContext: ["vldlCholesterol"]
        },

        {
            id: "triglycerides",
            async prelogic(ctx) {
                configure(ctx, this.id)
            },
            element(ctx) {
                return setRequired(ctx, this.id, ElementPool.triglycerides)
            },
            async answerLogic(ctx) {
                if (isRequiredElement(ctx, this.id))
                    requireInputFor(ctx, this.id, "triglycerides")
            },
            inputContext: ["triglycerides"],
            outputContext: ["triglycerides"]
        },

        {
            id: "totalHDLCholesterol",
            async prelogic(ctx) {
                configure(ctx, this.id)
                ctx.findings.totalHDLCholesterol = calcTotalHDLCholesterol(ctx)
            },
            element(ctx) {
                return setRequired(ctx, this.id, ElementPool.totalHDLCholesterol(ctx.findings.totalHDLCholesterol))
            },
            async answerLogic(ctx) {
                if (isRequiredElement(ctx, this.id))
                    requireInputFor(ctx, this.id, "totalHDLCholesterol")
            },
            inputContext: ["totalHDLCholesterol"],
            outputContext: ["totalHDLCholesterol"]
        },

        {
            id: "fasted",
            async prelogic(ctx) {
                configure(ctx, this.id)
            },
            element(ctx) {
                return setRequired(ctx, this.id, ElementPool.fasted)
            },
            async answerLogic(ctx) {
                if (isRequiredElement(ctx, this.id))
                    requireInputFor(ctx, this.id, "fasted")
            },
            inputContext: ["fasted"],
            outputContext: ["fasted"]
        },

        {
            id: "glucoseFasting",
            async prelogic(ctx) {
                configure(ctx, this.id)
                if (ctx.findings.fasted !== true) ctx.element = Element.next(ctx.collection.elements, this.id)
            },
            element(ctx) {
                return setRequired(ctx, this.id, ElementPool.glucoseFasting)
            },
            async answerLogic(ctx) {
                if (isRequiredElement(ctx, this.id))
                    requireInputFor(ctx, this.id, "glucoseFasting")
            },
            inputContext: ["glucoseFasting"],
            outputContext: ["glucoseFasting"]
        },

        {
            id: "glucoseNonFasting",
            async prelogic(ctx) {
                configure(ctx, this.id)
                if (ctx.findings.fasted !== false) ctx.element = Element.next(ctx.collection.elements, this.id)
            },
            element(ctx) {
                return setRequired(ctx, this.id, ElementPool.glucoseNonFasting)
            },
            async answerLogic(ctx) {
                if (isRequiredElement(ctx, this.id))
                    requireInputFor(ctx, this.id, "glucoseNonFasting")
            },
            inputContext: ["glucoseNonFasting"],
            outputContext: ["glucoseNonFasting"]
        },

        {
            id: "a1c",
            async prelogic(ctx) {
                configure(ctx, this.id)
            },
            element(ctx) {
                return setRequired(ctx, this.id, ElementPool.a1c)
            },
            async answerLogic(ctx) {
                if (isRequiredElement(ctx, this.id))
                    requireInputFor(ctx, this.id, "a1c")
            },
            inputContext: ["a1c"],
            outputContext: ["a1c"]
        },

        {
            id: "tobaccoUse",
            async prelogic(ctx) {
                configure(ctx, this.id)
            },
            element(ctx) {
                return setRequired(ctx, this.id, ElementPool.tobaccoUse)
            },
            async answerLogic(ctx) {
                if (isRequiredElement(ctx, this.id))
                    requireInputFor(ctx, this.id, "tobaccoUse")
            },
            inputContext: ["tobaccoUse"],
            outputContext: ["tobaccoUse"]
        },

        {
            id: "fluVaccine",
            async prelogic(ctx) {
                configure(ctx, this.id)
            },
            element(ctx) {
                return setRequired(ctx, this.id, ElementPool.fluVaccine)
            },
            async answerLogic(ctx) {
                if (isRequiredElement(ctx, this.id))
                    requireInputFor(ctx, this.id, "fluVaccine")
                ctx.transport.fluVaccine = ctx.findings.fluVaccine
            },
            inputContext: ["fluVaccine"],
            outputContext: ["fluVaccine"]
        },

        {
            id: "fluVaccineDate",
            async prelogic(ctx) {
                configure(ctx, this.id)
                if (ctx.transport.fluVaccine !== true) ctx.element = Element.next(ctx.collection.elements, this.id)
            },
            element(ctx) {
                return setRequired(ctx, this.id, ElementPool.fluVaccineDate(undefined, getDateConstraint(false, true)))
            },
            async preAnswerLogic(ctx) {
                if (ctx.findings.day !== undefined && ctx.findings.month !== undefined && ctx.findings.year !== undefined)
                    ctx.findings.fluVaccineDate = toNoonGMT(ctx.findings.day, ctx.findings.month, ctx.findings.year)
                else throw Errors.errorResponse("Must provide value for day, month, and year", 400)
            },
            async answerLogic(ctx) {
                if (isRequiredElement(ctx, this.id))
                    requireInputFor(ctx, this.id, "fluVaccineDate")
            },
            inputContext: ["fluVaccineDate"],
            outputContext: ["fluVaccineDate"]
        },

        {
            id: "screeningFormComplete",
            async prelogic(ctx) {
                await Event.healthScreeningComplete(ctx)
            },
            element(ctx) {
                return {
                    id: "Complete",
                    type: "Complete"
                }
            },
            async answerLogic(ctx) {
            },
            inputContext: ["userAttestation"],
            outputContext: ["userAttestation"]
        },

        {
            id: "screeningFormAborted",
            async prelogic(ctx) {
            },
            element(ctx) {
                return {
                    id: "Abort",
                    type: "Abort"
                }
            },
            async answerLogic(ctx) {
            },
            inputContext: ["userAttestation"],
            outputContext: ["userAttestation"]
        }

    ]

    const ScreeningAssessment = {

        id: "58c4e6b9-e66a-49aa-bd82-2cc5234089cf", // Determine necessity
        name: "SelfReportScreeningAssessment",

        async onFirst(ctx) {
        },

        async validateRequirements(ctx) {
            if (!ctx.query.parameters.id) throw Errors.errorResponse(`Bad Request: Must supply id in parameters for completion identification`, 400, undefined)
            if (!ctx.query.parameters.entity && !ctx.query.parameters.secureId) throw Errors.errorResponse(`Bad Request: Must supply a valid user in body parameters object (entity or secureId)`, 400, undefined)
            if (!ctx.query.parameters.unitPreference) throw  Errors.errorResponse(`Bad Request: Must specify unit preference in body parameters object (metric or imperial)`, 400, undefined)
            if (ctx.query.parameters.unitPreference !== "metric" && ctx.query.parameters.unitPreference !== "imperial") throw Errors.errorResponse(`Bad Request: Unit preference in body parameters object must contain value 'metric' or 'imperial')`, 400, undefined)
        },

        async prelogic(ctx) {
        },

        async answerlogic(ctx) {
        },

        elements: ScreeningElements,
        findingDefinitions: FindingDefinitions
    }

    return ScreeningAssessment
}()


