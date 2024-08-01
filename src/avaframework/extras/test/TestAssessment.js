const Element    = require("../../../avaframework/Element");
const Errors     = require("../../../avaframework/Errors");
const Validation = require("../../../avaframework/Validation");
const axios      = require("axios");
const https      = require('https')


const FindingDefinitions = {

    "rangeFinding": {
        id: "rangeFinding",
        name: "rangeFinding",
        desc: "Range Finding",
        type: "INTEGER",
        units: "mmHG",
        expiresAfterDuration: 0,
        range: {
            min: 0,
            max: 100
        },
        get validation(){ return Validation.range(this.name, this.range.min, this.range.max, this.units) },
        clearFindings: undefined
    },

    "rangeFinding2": {
        id: "rangeFinding2",
        name: "rangeFinding2",
        desc: "Range Finding 2",
        type: "INTEGER",
        units: "mmHG",
        expiresAfterDuration: 0,
        range: {
            min: 100,
            max: 200
        },
        get validation(){ return Validation.range(this.name, this.range.min, this.range.max, this.units) },
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
}



const TestElements = [

    // ::::::::::::::::::::::
    // NAVIGATIONAL TESTS
    // ::::::::::::::::::::::

    {
        id: "a",
        async prelogic(ctx) {
        },
        element(ctx) {
            return {id:"a"}
        },
        async preAnswerLogic(ctx) {
        },
        async answerLogic(ctx) {
        },
        inputContext: ["a"],
        outputContext: ["a"]
    },

    {
        id: "b",
        async prelogic(ctx) {
            ctx.element = Element.to(ctx.collection, "c")
        },
        element(ctx) {
            return {id:"b"}
        },
        async preAnswerLogic(ctx) {  
        },
        async answerLogic(ctx) {
        },
        inputContext: ["b"],
        outputContext: ["b"]
    },

    {
        id: "c",
        async prelogic(ctx) {
        },
        element(ctx) {
            return {id:"c"}
        },
        async preAnswerLogic(ctx) {  
        },
        async answerLogic(ctx) {
        },
        inputContext: ["c"],
        outputContext: ["c"]
    },

    {
        id: "d",
        async prelogic(ctx) {
            ctx.element = Element.next(TestElements, this.id)
        },
        element(ctx) {
            return {id:"d"}
        },
        async preAnswerLogic(ctx) {  
        },
        async answerLogic(ctx) {
        },
        inputContext: ["d"],
        outputContext: ["d"]
    },

    {
        id: "e",
        async prelogic(ctx) {
        },
        element(ctx) {
            return {id:"e"}
        },
        async preAnswerLogic(ctx) {
            ctx.transport.collectionOfValues = add(ctx.transport.collectionOfValues, "element.preAnswerLogic")
            ctx.found.someValue = "Some Value"
        },
        async answerLogic(ctx) {
            ctx.transport.collectionOfValues = add(ctx.transport.collectionOfValues, "element.answerLogic")
        },
        inputContext: ["e"],
        outputContext: ["e"]
    },

    {
        id: "f",
        async prelogic(ctx) {
            ctx.transport.collectionOfValues = add(ctx.transport.collectionOfValues, "element.prelogic")
        },
        element(ctx) {
            return {id:"f"}
        },
        async preAnswerLogic(ctx) {
        },
        async answerLogic(ctx) {
        },
        inputContext: ["f"],
        outputContext: ["f"]
    },

    // ::::::::::::::::::::::
    // END NAVIGATIONAL TESTS
    // ::::::::::::::::::::::

    {
        id: "g",
        async prelogic(ctx) {
        },
        element(ctx) {
            return {id:"g"}
        },
        async preAnswerLogic(ctx) {
            if (ctx.findings.location == "Atl") throw Errors.errorResponse(`Location cannot be Atl`, 400, undefined)
        },
        async answerLogic(ctx) {
        },
        inputContext: ["g"],
        outputContext: ["g"]
    },

    {
        id: "h",
        async prelogic(ctx) {
        },
        element(ctx) {
            return {id:"h"}
        },
        async preAnswerLogic(ctx) {  
        },
        async answerLogic(ctx) {
        },
        inputContext: ["h"],
        outputContext: ["h"]
    },

    {
        id: "i",
        async prelogic(ctx) {
        },
        element(ctx) {
            return {id:"i"}
        },
        async preAnswerLogic(ctx) {  
        },
        async answerLogic(ctx) {
        },
        inputContext: ["i"],
        outputContext: ["i"]
    },

    {
        id: "j",
        async prelogic(ctx) {
        },
        element(ctx) {
            return {id:"j"}
        },
        async preAnswerLogic(ctx) {  
        },
        async answerLogic(ctx) {
        },
        inputContext: ["j"],
        outputContext: ["j"]
    },

    {
        id: "k",
        async prelogic(ctx) {
            try {
                const r = await axios({
                    headers: {
                        "authorization": "",
                        "content-type": ""
                    },
                    json: true,
                    method: 'get',
                    url: "http://dummyUrl/nothing",
                    httpsAgent: new https.Agent({
                        rejectUnauthorized: false
                    })
                })
            } catch (e) {
                throw Errors.error("", `Some specific error`)
            }
        },
        element(ctx) {
            return {id:"k"}
        },
        async preAnswerLogic(ctx) {
        },
        async answerLogic(ctx) {
        },
        inputContext: ["k"],
        outputContext: ["k"]
    },

    {
        id: "l",
        async prelogic(ctx) {
            try {
                const r = await axios({
                    json: true,
                    method: 'get',
                    url: "https://dummyUrl/health-profile/biometrics?",
                    httpsAgent: new https.Agent({
                        rejectUnauthorized: false
                    })
                })
            } catch (e) {
                const msg = e.response.data.error ? e.response.data.error : e.message
                throw Errors.errorResponse(`Error saving to the health profile: ${msg}`, e.response.status, undefined)
            }
        },
        element(ctx) {
            return {id:"l"}
        },
        async preAnswerLogic(ctx) {
        },
        async answerLogic(ctx) {
        },
        inputContext: ["l"],
        outputContext: ["l"]
    }
]

const TestAssessment = {

    id: "58c4e6b9-e66a-49aa-bd82-2cc5234089cf",
    name: "SelfReportScreeningAssessment",

    async onFirst(ctx) {
        if (ctx.findings.color == "blue") throw Errors.errorResponse(`Color cannot be blue`, 400, undefined)
    },

    async validateRequirements(ctx) {
        if (ctx.findings.age > 200) throw Errors.errorResponse(`Age out of range`, 400, undefined)
        ctx.transport.collectionOfValues = add(ctx.transport.collectionOfValues, "collection.validateAssessmentRequirements")
    },

    async prelogic(ctx) {
        if (ctx.findings.name == "Jerry") throw Errors.badRequestError("Name cannot be Jerry")
        ctx.transport.collectionOfValues = add(ctx.transport.collectionOfValues, "collection.prelogic")
    },

    async answerlogic(ctx) {
        if (ctx.findings.answer == "Maybe") throw Errors.errorResponse(`Answer cannot be Maybe`, 400, undefined)
        ctx.transport.collectionOfValues = add(ctx.transport.collectionOfValues, "collection.answerlogic")
    },

    elements: TestElements,
    findingDefinitions: FindingDefinitions
}

function add(c, v) {
    return Array.isArray(c) ? [...c, v] : [v]
}

function fromOptions(options) {
    return options.reduce((definitions, option) => {
        const finding = FindingDefinitions[option.findingId]
        definitions[option.findingId] = {
            id: finding.id,
            type: finding.type,
            range: finding.range
        }
        return definitions
    }, {})
}

function define(element) {
    element.findingDefinitions = fromOptions(element.options)
    return element
}


module.exports = TestAssessment
