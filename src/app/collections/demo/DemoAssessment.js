const UISchemas = require("../../../avaframework/extras/schemas/UISchemas");
const textInput  = UISchemas.textInput;
const Validation = require("../../../avaframework/Validation");
const Element    = require("../../../avaframework/Element");


const getUserData = () => {
    return {
        name: "Vivek"
    }
}


const DemoElements = [
    {
        id: "introduction",
        async prelogic(ctx) {
            ctx.userData = getUserData()
            if (ctx.age > 27) ctx.element = Element.next(ctx.collection.elements, this.id)
        },
        element(ctx) {
            return {
                id: "introduction",
                type: "textField",
                title: undefined,
                subtitle: `Hello ${ctx.userData.name}! How old are you?`,
                required: true,
                options: [
                    textInput("1", DemoAssessment.findingDefinitions.age, "years old"),
                ],
                findings: {},
                transport: {}
            }
        },
        async answerLogic(ctx) {
            if(ctx.findings.age > 27)
                ctx.element = Element.to(ctx.collection.elements, "geezerCompleted")
        },
        inputContext: [],
        outputContext: []
    },

    {
        id: "completed",
        async prelogic(ctx) {
        },
        element(ctx) {
            return { message: `No assessment for ${ctx.findings.age} year olds. Spend your youth outside!` }
        },
        async preAnswerLogic(ctx) {
        },
        async answerLogic(ctx) {
        },
        inputContext: [],
        outputContext: []
    },

    {
        id: "geezerCompleted",
        async prelogic(ctx) {
        },
        element(ctx) {
            return { message: `Ha! Tricked by a computer again! I now have all your geezer daterz!! Don't believe me? You are ${ctx.findings.age}!` }
        },
        async answerLogic(ctx) {
        },
        inputContext: [],
        outputContext: []
    }
]

const DemoAssessment = {

    id: "Acc4e6b9-e66a-49aa-bd82-2cc5234089cf",
    name: "DemoAssessment",

    async onFirst(ctx) {
        // Executes upon first interaction (submission does not contain an element reference)
    },

    async validateRequirements(ctx) {
        // Ensure the interaction is valid and contains all necessary components
    },

    async prelogic(ctx) {
        // Common Assessment Logic: Executes prior to element prelogic
    },

    async answerlogic(ctx) {
        // Suitable for actions code that is common to all
    },

    elements: DemoElements,

    findingDefinitions: {
        "age": {
            id: "age",
            name: "age",
            desc: "age",
            type: "INTEGER",
            units: "",
            expiresAfterDuration: 0,
            range: {
                min: 13,
                max: 160
            },
            get validation(){ return Validation.range(this.name, this.range.min, this.range.max, this.units) },
            clearFindings: undefined
        },
    }
}

module.exports = DemoAssessment


