

class UISchemas {

    static option(id, finding, label, findingValue, findings, clear, defaultValue) {
        if (label == undefined) throw new Exception("'label' must be defined for UI Element 'option'")
        return {
            id: id,
            findingId: finding.id,
            label: label,
            finding: findingValue,
            findings: findings,
            clear: clear || [],
            defaultValue: defaultValue
        }
    }

    static textInput(id, finding, label, defaultValue) {
        return UISchemas.option(id, finding, label, undefined, undefined, undefined, defaultValue)
    }
    
    static checkBoxOption(id, finding, label, value, clear) {
        return UISchemas.option(id, finding, label, value, undefined, clear, undefined)
    }

    static fromOptions(findingDefinitions, options) {
        return options.reduce((definitions, option) => {
            const finding = findingDefinitions[option.findingId]
            definitions[option.findingId] = {
                id: finding.id,
                type: finding.type,
                range: finding.range
            }
            return definitions
        }, {})
    }

    static define(findingDefinitions) {
        return function (element) {
            element.findingDefinitions = UISchemas.fromOptions(findingDefinitions, element.options)
            return element
        }
    }
   
}

module.exports = UISchemas






































/*
"questionText": "Should display for all as a textbox, validation rules accept values 70-700.<br />How much do you weigh?",
    "rules": [],
    "answers": [
    {
        "value": null,
        "text": "Pounds:",
        "factId": "619",
        "answerId": "5",
        "answersToClear": [],
        "answerImage": null
    }
]
*/


/*
return {
    id: "0",
    text: `How old are you? (Our db indicates you are ${ctx.findings.age.value})`,
    voice:`How old are you? (Our db indicates you are ${ctx.findings.age.value})`,
    answers: [
        {
            type: "Input",
            prefixLabel: "",
            value: ctx.findings.age.value,
            postfixLabel: FindingDefinitions.age.units,
            finding: FindingDefinitions.age
        }
    ]
}
*/



/*

return {
    id: "0",
    text: `How old are you? (Our db indicates you are ${ctx.findings.age.value})`,
    voice:`How old are you? (Our db indicates you are ${ctx.findings.age.value})`,
    answers: [
        {
            type: "Input",
            prefixLabel: "",
            value: ctx.findings.age.value,
            postfixLabel: FindingDefinitions.age.units,
            finding: FindingDefinitions.age
        }
    ]
}

============

TEXT

{
    "result": "SUCCESS",
    "data": {
    "moduleId": "1",
        "questionGroupId": "4",
        "pageNumber": "1.4",
        "maxPageNumber": 10,
        "questions": [
        {
            "id": "996561",
            "questionId": "996561",
            "displayLabel": [],
            "factDataType": {
                "619": "INTEGER"
            },
            "questionText": "Should display for all as a textbox, validation rules accept values 70-700.<br />How much do you weigh?",
            "rules": [],
            "answers": [
                {
                    "value": null,
                    "text": "Pounds:",
                    "factId": "619",
                    "answerId": "5",
                    "answersToClear": [],
                    "answerImage": null
                }
            ],
            "required": true,
            "type": "text",
            "previousValues": {}
        }
    ]
},
    "errors": null
}




========================================================================================================================

*/


/*

###############################################################################
# RADIO Question
###############################################################################
{
    "id": "995065",
    "displayLabel": {},
    "displayLabelOrder": [],
    "factDataType": {
    "18514": "NONE"
},
    "questionText": "Should display for all users as radio buttons<br />Do you know your blood pressure?",
    "rules": [],
    "answers": [
    {
        "value": "T",
        "text": "Yes",
        "factId": "18514",
        "answerId": "1a",
        "answersToClear": [],
        "answerImage": null
    },
    {
        "value": "F",
        "text": "No",
        "factId": "18514",
        "answerId": "1b",
        "answersToClear": [],
        "answerImage": null
    }
],
    "required": true,
    "type": "radio",
    "previousValues": {}
}

###############################################################################
# TEXT Question
###############################################################################
{
    "id": "996561",
    "displayLabel": {},
    "displayLabelOrder": [],
    "factDataType": {
    "619": "INTEGER"
},
    "questionText": "Should display for all as a textbox, validation rules accept values 70-700.<br />How much do you weigh?",
    "rules": [],
    "answers": [
    {
        "value": null,
        "text": "Pounds:",
        "factId": "619",
        "answerId": "5",
        "answersToClear": [],
        "answerImage": null
    }
],
    "required": true,
    "type": "text",
    "previousValues": {}
}

###############################################################################
# SELECT Question
###############################################################################
{
    "id": "995955",
    "displayLabel": {},
    "displayLabelOrder": [],
    "factDataType": {
    "10775": "NONE"
},
    "questionText": "Should display for all users, dropdown menu.<br />How long have you smoked cigarettes?",
    "rules": [],
    "answers": [
    {
        "value": "1month",
        "text": "1 Month",
        "factId": "10775",
        "answerId": "6a",
        "answersToClear": [],
        "answerImage": null
    },
    {
        "value": "2months",
        "text": "2 months",
        "factId": "10775",
        "answerId": "6b",
        "answersToClear": [],
        "answerImage": null
    },
    {
        "value": "3months",
        "text": "3 months",
        "factId": "10775",
        "answerId": "6c",
        "answersToClear": [],
        "answerImage": null
    },
    {
        "value": "4months",
        "text": "4 months",
        "factId": "10775",
        "answerId": "6d",
        "answersToClear": [],
        "answerImage": null
    },
    {
        "value": "5months",
        "text": "5 months",
        "factId": "10775",
        "answerId": "6e",
        "answersToClear": [],
        "answerImage": null
    },
    {
        "value": "6months",
        "text": "6 months",
        "factId": "10775",
        "answerId": "6f",
        "answersToClear": [],
        "answerImage": null
    },
    {
        "value": "1year",
        "text": "1 year",
        "factId": "10775",
        "answerId": "6l",
        "answersToClear": [],
        "answerImage": null
    },
    {
        "value": "2years",
        "text": "2 Years",
        "factId": "10775",
        "answerId": "6m",
        "answersToClear": [],
        "answerImage": null
    }
],
    "required": true,
    "type": "select",
    "previousValues": {}
}

###############################################################################
# RADIO CHART Question
###############################################################################
{
    "id": "996585",
    "displayLabel": {
    "10094": "I'm quick tempered.",
        "10095": "I have a fiery temper.",
        "10096": "I'm a hotheaded person.",
        "10097": "I fly off the handle."
},
    "displayLabelOrder": [
    "10094",
    "10096",
    "10095",
    "10097"
],
    "factDataType": {
    "10094": "NONE",
        "10095": "NONE",
        "10096": "NONE",
        "10097": "NONE"
},
    "questionText": "Should display for all as a radio chart<br />Answer the following honestly, according to your own feelings.",
    "rules": [],
    "answers": [
    {
        "value": null,
        "text": "I'm quick tempered.",
        "factId": "10094",
        "answerId": "7a",
        "answersToClear": [],
        "answerImage": null
    },
    {
        "value": null,
        "text": "I'm a hotheaded person.",
        "factId": "10096",
        "answerId": "7b",
        "answersToClear": [],
        "answerImage": null
    },
    {
        "value": null,
        "text": "I have a fiery temper.",
        "factId": "10095",
        "answerId": "7c",
        "answersToClear": [],
        "answerImage": null
    },
    {
        "value": null,
        "text": "I fly off the handle.",
        "factId": "10097",
        "answerId": "7d",
        "answersToClear": [],
        "answerImage": null
    }
],
    "required": true,
    "type": "radio_chart",
    "chartOption": [
    "never",
    "sometimes",
    "usually",
    "always"
],
    "chartLabel": [
    "Almost Never",
    "Sometimes",
    "Often",
    "Almost Always"
],
    "previousValues": {}
}

###############################################################################
# CHECKBOX Question
###############################################################################
{
    "id": "995901",
    "displayLabel": {},
    "displayLabelOrder": [],
    "factDataType": {
    "5067": "NONE",
        "5071": "NONE",
        "5073": "NONE"
},
    "questionText": "This should display with checkbox options, and \"none\" should uncheck all others.<br />Which tobacco products do you currently use?",
    "rules": [],
    "answers": [
    {
        "value": "T",
        "text": "Cigarettes",
        "factId": "5071",
        "answerId": "4a",
        "answersToClear": [
            "4c"
        ],
        "answerImage": null
    },
    {
        "value": "T",
        "text": "Cigars",
        "factId": "5073",
        "answerId": "4b",
        "answersToClear": [
            "4c"
        ],
        "answerImage": null
    },
    {
        "value": "T",
        "text": "None",
        "factId": "5067",
        "answerId": "4c",
        "answersToClear": [
            "4a",
            "4b"
        ],
        "answerImage": null
    }
],
    "required": false,
    "type": "checkbox",
    "previousValues": {}
}

*/
