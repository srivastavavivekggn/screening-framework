const UISchemas      = require("../schemas/UISchemas");
const option         = UISchemas.option;
const textInput      = UISchemas.textInput;
const checkBoxOption = UISchemas.checkBoxOption;



const fd = {
    "interests": {
        id: "interests",
            name: "interests",
            desc: "interests",
            type: "STRING",
            units: "",
            expiresAfterDuration: 0,
            get validation(){ return null },
        clearFindings: undefined
    },
}


const QuestionTypeElements = [

    {
        id: "interests",
        async prelogic(ctx) {
        },
        element(ctx) {
            return {
                id: "interests",
                type: "multiSelect",
                label: "<h1>Interests</h1>What are your interests?",
                required: true,
                options: [
                    checkBoxOption("1", fd.interests, "Skateboarding", "Skateboarding"),
                    checkBoxOption("2", fd.interests, "BMX", "BMX"),
                    checkBoxOption("3", fd.interests, "Surfing", "Surfing"),
                    checkBoxOption("4", fd.interests, "All of the above", "All of the above", ["1", "2", "3"])
                ],
                findings: {},
                findingDefinitions: {
                    interests: {
                        id: "interests",
                        type: "STRING"
                    }
                },
                transport: {}
            }
        },
        async answerLogic(ctx) {
        },
        inputContext: ["interests"],
        outputContext: ["interests"]
    },


    {
        id: "complete",
        async prelogic(ctx) {
        },
        element(ctx) {
            return {
                id: "Complete",
                type: "Complete"
            }
        },
        async answerLogic(ctx) {
        },
        inputContext: ["complete"],
        outputContext: ["complete"]
    }
    
]


const QuestionTypeAssessment = {

    id: "58c4e6b9-e66a-49aa-bd82-2cc5234089cf", // Determine necessity
    name: "QuestionTypeAssessment",

    async onFirst(ctx) {
    },

    async validateAssessmentRequirements(ctx) {
    },

    async prelogic(ctx) {
    },

    async answerlogic(ctx) {
    },

    elements: QuestionTypeElements,
    findingDefinitions: {}
}

module.exports = QuestionTypeAssessment


