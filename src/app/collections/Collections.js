const ScreeningAssessment         = require('./screening/ScreeningAssessment');
const TestAssessment              = require('../../avaframework/extras/test/TestAssessment');
const QuestionTypeAssessment      = require('../../avaframework/extras/test/QuestionTypeAssessment')
const DemoAssessment              = require('./demo/DemoAssessment');

module.exports = {
    "HealthScreening": ScreeningAssessment,
    "TestAssessment": TestAssessment,
    "QuestionTypeAssessment": QuestionTypeAssessment,
    "DemoAssessment": DemoAssessment
}
