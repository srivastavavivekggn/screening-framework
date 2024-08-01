
const UIElementCandidates = {

    "picker": {
        "id": "Element Id",
        "type": "Picker",
        "label": "Top Level UI Picker Label",
        "findingDefinitions": {
            "ldlCholesterol": {
                "name": "ldlCholesterol",
                "desc": "LDL Cholesterol",
                "type": "INTEGER",
                "units": "mg/dL",
                "expiresAfterDuration": 0,
                "range": {
                    "min": 0,
                    "max": 220
                }
            }
        },
        "options": [
            {
                "id": "Option Id",
                "findingId": "ldlCholesterol",
                "label": "Optional Individual Picker Label",
                "values": [
                    {"label": "120", "value": "120"},
                    {"label": "119", "value": "119"},
                    {"label": "118", "value": "118"}
                ]
            }
        ],
        "values":{
            "ldlCholesterol":"119"
        },
        "required": true,
        "contexts": [ {"name": "SomeContext"} ]
    },

    "multiSelect": {
        "id": "Element Id",
        "type": "Multi-Select",
        "label": "Some Multi Select Label",
        "findingDefinitions": {
            "ldlCholesterol": {
                "name": "ldlCholesterol",
                "desc": "LDL Cholesterol",
                "type": "INTEGER",
                "units": "mg/dL",
                "expiresAfterDuration": 0,
                "range": {
                    "min": 0,
                    "max": 220
                }
            }
        },
        "options": [
            {
                "id": "1",
                "label": "LDL Cholesterol",
                "value": "120",
                "findingId": "ldlCholesterol",
                "clear": []
            },
            {
                "id": "2",
                "label": "LDL Cholesterol",
                "value": "119",
                "findingId": "ldlCholesterol",
                "clear": []
            },
            {
                "id": "3",
                "label": "LDL Cholesterol",
                "value": "118",
                "findingId": "ldlCholesterol",
                "clear": []
            },
            {
                "id": "4",
                "label": "I don't know my LDL Cholesterol",
                "value": "",
                "findingId": "ldlCholesterol",
                "clear": ["1", "2", "3"]
            }
        ],
        "values":{
            "ldlCholesterol":"119"
        },
        "required": true,
        "contexts": [ {"name": "SomeContext"} ]
    },

    "singleSelectRadio": {
        "id": "Element Id",
        "type": "Single-Select",
        "label": "Some Single Select Label",
        "findingDefinitions": {
            "ldlCholesterol": {
                "name": "ldlCholesterol",
                "desc": "LDL Cholesterol",
                "type": "INTEGER",
                "units": "mg/dL",
                "expiresAfterDuration": 0,
                "range": {
                    "min": 0,
                    "max": 220
                }
            }
        },
        "options": [
            {
                "id": "1",
                "label": "LDL Cholesterol",
                "value": "120",
                "findingId": "ldlCholesterol"
            },
            {
                "id": "2",
                "label": "LDL Cholesterol",
                "value": "119",
                "findingId": "ldlCholesterol"
            },
            {
                "id": "3",
                "label": "LDL Cholesterol",
                "value": "118",
                "findingId": "ldlCholesterol"
            }
        ],
        "values":{
            "ldlCholesterol":"119"
        },
        "required": true,
        "contexts": [ {"name": "SomeContext"} ]
    },

    "textField": {
        "id": "Element Id",
        "type": "Text-Input",
        "label": "Some Optional Text Field Label",
        "findingDefinitions": {
            "Finding Id": {
                "name": "ldlCholesterol",
                "desc": "LDL Cholesterol",
                "type": "INTEGER",
                "units": "mg/dL",
                "expiresAfterDuration": 0,
                "range": {
                    "min": 0,
                    "max": 220
                }
            }
        },
        "options": [
            {
                "id": "Option Id",
                "label": "LDL Cholesterol",
                "findingId": "ldlCholesterol",
                "defaultValue": "Please Provide Value (Default Text)"
            }
        ],
        "values":{
            "ldlCholesterol":"119"
        },
        "required": true,
        "contexts": [ {"name": "SomeContext"} ]
    },

    "submissionObject": {
        "type": "interaction-standard-1",
        "action": "value",
        "reference": {
            "collection": "String",
            "id": "Option[String]"
        },
        "parameters": {
            "unitPreferences": "metric",
            "secureId": "secureId",
            "name": ["Vivek", "Srivastava"],
            "languageCode": "en",
            "limit": 10,
            "reading": 3.14,
            "active": true
        },
        "findings": {
            "name": ["Vivek", "Srivastava"],
            "bloodPressure": "90"
        },
        "contexts": [
            {"name": "Name", "value": "Some value" }
        ]
    }

}