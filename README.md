# Screening Framework Documentation

## Goals

**Framework goals:**

 - Simple yet powerful framework
 - Comprehensive logical pipeline suitable for a wide range of problem domains
 - Small codebase easy to comprehend in hours

**Business Goals:**

 - Where applicable, migrate complex domains to Screening implementations (RA)
 - Simplify the creation of rich assessments
 -- API or DB Interactions:
 -- Any amount of arbitrary Ecmascript logic (*currently Node 8*)
 -- Eventing
 -- Assessment composition
 
## Description

The Screening framework at its core is an element sequencer. 

An element sequencer is a system that manages the targeting and execution of logical elements within a collection. The rules of which are governed by business logic defined by the domain. 

Screening provides a flexible, but ordered logical pipeline passing a mutable context through various logical blocks and gates. The context exposes findings and properties to subsequent functions within the pipeline. 


## Installation  
  
### Requires:  
  
 - Node > 8.7   
 - MongoDB
 - Amazon SNS

## API

### Initiate

**POST:** /screening/initiate

Request Body: Example Initiate 
```json  
{
    "reference": {
        "collection":"Screening",
    	"id":"bloodPressure"
    },    
    "parameters": {
    	"entity": "XXX-XXXX-XXXXX",
    	"unitPreference": "metric",
    	"screeningConf": "test",
    	"id":"Screening"
	},
    "findings": {
    	"systolicBloodPressure": 120,
    	"diastolicBloodPressure": 120
    },
    "transport": {}
}  
```
*For details on above see: [Interaction Object](#interaction-object) under Screening Schemas below*

### Completion Events

The screening the API will emit the following event upon the completion of a screening:

```json  
{
  "source": "screening/complete",
  "timestamp": 1534344839920,
  "event": "screening/complete",
  "description": "screening complete",
  "data": {
    "entity": "XXX-XXXX-XXXXX",
    "url": "",
    "id": "Screening"
  }
}  
```

### Administrative: PATCH Single Configuration:

**PATCH:** /screening/admin/configurations/< configuration id >

Request Body: Example Configuration
```json  
{
    "id": "test",
    "sources": [
        "CVS",
        "Home Kit",
        "Onsite",
        "PCP"
    ],
    "hide": [],
    "optional": [
        "hdlCholesterol",
        "ldlCholesterol"
    ]
}  
```

### Administrative: PATCH All Configurations:

**PATCH:** /screening/admin/configurations

Request Body: Example Configuration
```json  
[
    {
        "id": "test",
        "sources": [
            "CVS",
            "Home Kit",
            "Onsite",
            "PCP"
        ],
        "hide": [],
        "optional": [
            "hdlCholesterol",
            "ldlCholesterol"
        ]
    },
    {
        "id": "HMSA:1",
        "sources": [
            "CVS",
            "Home Kit",
            "Onsite",
            "PCP"
        ],
        "hide": [
            "bmi"
        ],
        "optional": [
            "hdlCholesterol"
        ]
    }
] 
```

### Administrative: GET Configuration:

**GET:** /screening/admin/configurations/< configuration id >

Response: Example Configuration
```json  
{
    "id": "test",
    "sources": [
        "CVS",
        "Home Kit",
        "Onsite",
        "PCP"
    ],
    "hide": [],
    "optional": [
        "hdlCholesterol",
        "ldlCholesterol"
    ]
}  
```

### Administrative: GET All Configurations:

**GET:** /screening/admin/configurations

Response: Example All Configurations
```json  
[
    {
        "id": "test",
        "sources": [
            "CVS",
            "Home Kit",
            "Onsite",
            "PCP"
        ],
        "hide": [],
        "optional": [
            "hdlCholesterol",
            "ldlCholesterol"
        ]
    },
    {
        "id": "test2",
        "sources": [
            "CVS",
            "Home Kit",
            "Onsite",
            "PCP"
        ],
        "hide": [
            "bmi"
        ],
        "optional": [
            "hdlCholesterol"
        ]
    }
] 
```

### Administrative: GET Assessment Question Ids:

**GET:** /screening/admin/collection/< collection id >

Response: Example Assessment Questions Ids
```json  
[
    {
        "id": "screeningType"
    },
    {
        "id": "screeningDate"
    },
    {
        "id": "bloodPressure"
    },
    ...
]
```


## Source Structure

src
└─app *
└─core *
└─domain

**app:** Screening framework classes
**core:** Classes provided for common implementations
**domain:** All Implementation code/Business logic for the specific domain

*Directories marked with an* * *indicates reserved Screening framework directories and the files are NOT typically altered when implementing a domain. Future versions may be updated to merge app and core into a directory "framework" to better communicate these boundaries*


## Collections

A collection of elements. Screening **Collections** have the following fields/methods:

### Fields:

- **id:** Unique identifier for the collection

- **name:** Name of the collection

- **elements:** Collection of elements

- **findingDefinitions:** Finding definitions

### Methods:

- **onFirst:** Executed when the first element of the collection is targeted *(Prior to element logic)*.

- **validateCollectionRequirements:** Validates that all requirements are met to interact with the collection 

- **prelogic:** Collection pre-logic is executed prior to the execution of element pre-logic and can be used for common concerns.

- **answerlogic:** Collection answer logic is executed prior to the execution of element answer logic and can be used for common concerns. Answer logic is triggered when submitting a response to a target element.

### Collection Example:
```javascript  
const ScreeningAssessment = {  
  
    id: "SelfReportScreeningAssessment", 
    name: "SelfReportScreeningAssessment",  
  
  async onFirst(ctx) {  
  },  
  
  async validateCollectionRequirements(ctx) {  
        if (!ctx.query.parameters.id) throw Errors.errorResponse(`Bad Request: Must supply id in parameters for completion identification`, 400, undefined)  
        if (!ctx.query.parameters.entity && !ctx.query.parameters.secureId) throw Errors.errorResponse(`Bad Request: Must supply a valid user in body parameters object (entity or secureId)`, 400, undefined)  
        if (!ctx.query.parameters.unitPreference) throw Errors.errorResponse(`Bad Request: Must specify unit preference in body parameters object (metric or imperial)`, 400, undefined)   
  },  
  
  async prelogic(ctx) {  
  },  
  
  async answerlogic(ctx) {  
        if (ctx.transport.screeningDate != undefined && ctx.transport.screeningType != undefined)  
            await save(ctx)  
    },  
  
  elements: ScreeningElements, // Array of elements [{...}, {...}, ...]
  findingDefinitions: FindingDefinitions // {...}
}
```

## Elements

Screening **elements** have the following methods

**prelogic:**

The first logical gate/block when an element is being evaluated. 

Common uses:

 - Determine if the element should continue to evaluate or progress/route to another element
 - Load and evaluate data
 - Append data to the context

**element:**

The element block produces the response object. The element block may make use of data on the context to craft the response.

*Note: The domain defines response schemas. In the case of an Screening based assessment, the element block might return a question with pre-populated values obtained in the pre-logic block.* 

**preAnswerLogic:**

Pre-answer logic is triggered when submitting a response/intent to a target element. Often used to transform data and append to the context object prior to passing to the answer logic block.

**answerLogic:**

Answer logic is triggered when submitting a response to a target element.

Common uses:

- validate that provided data meets requirements
- save data
- route to specific elements 

### Collection Elements Example
```javascript  
[  
    {  
        id: "age",  
        async prelogic(ctx) { 
		// get user data 
            const userData = await getUserDataFromAPI(ctx.query.parameters.entity)
            // place onto context
            ctx.userData = userData
        },  
	    element(ctx) { 
			return {
			  "id": "age",
			  "type": "Single-Select",
			  // Present data obtained in the pre-logic block
			  "label": `Hello ${ctx.userData.name} are you content at age ${ctx.userData.age}?`
			  "findingDefinitions": {
			    "ageContent": {
			      "id": "ageContent",
			      "type": "BOOLEAN"
			    }
			  },
			  "options": [
			    {
			      "id": "0",
			      "label": "Yes",
			      "value": true,
			      "findingId": "ageContent"
			    },
			    {
			      "id": "1",
			      "label": "No",
			      "value": false,
			      "findingId": "ageContent"
			    }
			  ],
			  "findings": {
			    "ageHappy": "Yes"
			  },
			  "required": true
			}  
        },  
		async answerLogic(ctx) { 
            save(ctx.findings.ageContent)  
        } 
    },
    {  
        id: "isAgeHappy",  
		async prelogic(ctx) { 
		    // evaluate this element or skip based on "ageHappy" value
		    if(ctx.findings.ageContent != true) ctx.element = Element.to(ctx.collection.elements, "unhappyWithAge") 
        },  
	    element(ctx) { 
			...
		},
		async answerLogic(ctx) {
			...
		}
	},
	...
]
```

## Screening Practical Implementations

Think about some of the requirements of an advanced assessment.

- Ability to define a collection of questions
- Execute a sequence of questions
- Branching logic based on user answers or discovered data
- Execute any arbitrary logic 
- Validate data inputs
- Read/Write data to external APIs and internal Databases
- API integrations
- Eventing
- ...*And so on*

## Screening Schemas

### Interaction Object:

**reference** *Object (Required)*:

-   **collection** *String (Required):* The target collection identifier

-   **id** OR **goto** *String (Optional):*  The target element identifier *(Within above collection)*. If neither id or goto are provided, Screening will target the first element.

**parameters** *Map[String, Any] (Optional) :* Analogous to body or query parameters.

**findings** *Map[String, Any] (Optional):* Finding key value pairs to submit information. Often derived from user actions like selections or other inputs.

**transport** *Map[String, Any] (Optional):* Session key value pairs. The server typically defines the values in the transport. The client must *at least* maintain the values in the transport object to submit back to Screening at each interaction. 

### Interaction JSON example:

```json  
{  
	"reference": {  
		"collection":"ScreeningAssessment",  
		"id":"screeningType"  
	},  
	"parameters": {  
		"entity": "XXX-XXXX-XXXXX",  
		"unitPreference": "metric",  
		"screeningConf": "test",  
		"id":"Customer:ABC123"  
	},  
	"findings": {  
		"screeningType":"PCP"  
	},  
	"transport": {
		"datetime": "1534361696"
	}  
}  
```

The request body is appended to the context object and accessible via ctx.query

# Screening Assessments Core

## Description

It will be common to build assessments on top of the Screening framework. For this reason the core library will provide several common question schemas.

## Common Question Schema Fields

### Question Schema

**id** *String (Required)*: Element Identifier

**type** *String (Required)*: The question type. *For example: Picker, Multi-Select, ...*

**label** *String (Required)*: The display label. 

**required** *Boolean (Required)*: Optional or required question *(Can a user skip?)*. 

**options** *Set[Options] (Required)*: Options/Inputs. *(See Option schema below for common option fields)*

**findings** *Map[String, Any] (Optional)*: In the context of a question, the findings object should be used to pre-populate/select options. 

**findingDefinitions** *Map[String, FindingInfo] (Required)*: Defines basic finding information and constraints.

### Option Schema

**id** *String (Required)*: Option identifier.

**findingId** *String (Required)*: Associated finding definition identifier

**label** *String (Required)*: Display label

**clear** *Seq[String] (Required)*: Element identifiers to clear when selected if options is chosen by the user. 

*For example: Present the user with multiple checkbox options with the last being "all of the above". Selecting "all of the above" would need to clear all previous selections. This is also true for the findings object. If we are to clear selections in the UI we would also want to ensure we clear any previously related findings placed into the findings object.*

### Finding Definition Schema

**id** *String (Required)*: Finding identifier.

**type** *String (Required)*: Data type. 

**range** *Range (Optional)*: Define range values for validation or client side rendering

### Range Schema

**min** *Double (Optional)*: Minimum allowable value

**max** *Double (Optional)*: Maximum allowable value

**inc** *Double (Optional)*: Value to increment between min and max (If the UI were to dynamically build the options)

## Question Types

### Picker

```json  
{
  "id": "ldlCholesterol",
  "type": "Picker",
  "label": "What is your LDL Cholesterol?",
  "findingDefinitions": {
    "ldlCholesterol": {
      "id": "ldlCholesterol",
      "type": "INTEGER",
      "range": {
        "min": 0,
        "max": 220
      }
    }
  },
  "options": [
    {
      "id": "0",
      "findingId": "ldlCholesterol",
      "label": "",
      "values": [
        {
          "label": "120",
          "value": "120"
        },
        {
          "label": "119",
          "value": "119"
        },
        {
          "label": "118",
          "value": "118"
        }
      ]
    }
  ],
  "findings": {
    "ldlCholesterol": "119"
  },
  "required": true
}  
```

### Multi-Select

```json  
{
  "id": "GreatestSourceOfHappiness",
  "type": "Multi-Select",
  "label": "What is your greatest source of happiness?",
  "findingDefinitions": {
    "greatestSourceOfHappiness": {
      "id": "greatestSourceOfHappiness",
      "type": "String"
    }
  },
  "options": [
    {
      "id": "1",
      "label": "Family",
      "value": "family",
      "findingId": "greatestSourceOfHappiness",
      "clear": []
    },
    {
      "id": "2",
      "label": "Hobbies",
      "value": "hobbies",
      "findingId": "greatestSourceOfHappiness",
      "clear": []
    },
    {
      "id": "3",
      "label": "Sports",
      "value": "sports",
      "findingId": "greatestSourceOfHappiness",
      "clear": []
    },
    {
      "id": "3",
      "label": "All of the above",
      "value": "allOfTheAbove",
      "findingId": "greatestSourceOfHappiness",
      "clear": ["1", "2", "3"]
    }
  ],
  "findings": {
    "greatestSourceOfHappiness": "sports"
  },
  "required": true
}  
```

### Single-Select

```json  
{
  "id": "GreatestSourceOfHappiness",
  "type": "Single-Select",
  "label": "What is your greatest source of happiness?",
  "findingDefinitions": {
    "greatestSourceOfHappiness": {
      "id": "greatestSourceOfHappiness",
      "type": "String"
    }
  },
  "options": [
    {
      "id": "1",
      "label": "Family",
      "value": "family",
      "findingId": "greatestSourceOfHappiness"
    },
    {
      "id": "2",
      "label": "Hobbies",
      "value": "hobbies",
      "findingId": "greatestSourceOfHappiness"
    },
    {
      "id": "3",
      "label": "Sports",
      "value": "sports",
      "findingId": "greatestSourceOfHappiness"
    },
    {
      "id": "3",
      "label": "All of the above",
      "value": "allOfTheAbove",
      "findingId": "greatestSourceOfHappiness"
    }
  ],
  "findings": {
    "greatestSourceOfHappiness": "sports"
  },
  "required": true
} 
```

### Text Input

```json  
{
  "id": "ldlCholesterol",
  "type": "Text-Input",
  "label": "What is your LDL Cholesterol?",
  "findingDefinitions": {
    "Finding Id": {
      "id": "ldlCholesterol",
      "type": "INTEGER",
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
      "defaultValue": ""
    }
  ],
  "findings": {
    "ldlCholesterol": "119"
  },
  "required": true
}  
```

### Date Selector

```json  
{
    "id": "screeningDate",
    "type": "dateSelector",
    "title": "Screening Date",
    "subtitle": "When was your screening?",
    "required": true,
    "findingId": "screeningDate",
    "notes": "",
    "constrain": {
        "allowFutureDates": false,
        "allowPastDates": true
    },
    "findings": {},
    "transport": {
        "screeningType": "PCP"
    }
}
```
