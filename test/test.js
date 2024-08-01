const { expect }     = require('chai');
const interaction    = require('../src/avaframework/Interaction');
const Conversions    = require('../src/avaframework/extras/utils/Conversions');
const chai           = require('chai');
const chaiJsonEqual  = require('chai-json-equal');


chai.use(chaiJsonEqual)


function getBody(id, goto, findings, collection = "TestAssessment") {
    return { body: {
        "type": "interaction-standard-1",
        "action": null,
        "reference": {
            "collection":collection,
            "id": id,
            "goto": goto
        },
        "parameters": {
            "entity": "XXX-XXXX-XXXXX",
            "unitPreference": "metric"
        },
        "findings":findings,
        "contexts": []
    }}
}

before(() => undefined);

describe('collection tests', () => {

    before(async () => {

    });

    beforeEach(async () => {

    });

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // NAVIGATIONAL TESTS
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Navigation: should error is collection not found', async () => {
        const r = await interaction.initiate(getBody(undefined, undefined, undefined, "NonExistantCollection"))
        expect(r.error).to.equal("Bad Request: Assessment Not Defined")
    });

    it('Navigation: should navigate to first', async () => {
        const r = await interaction.initiate(getBody())
        expect(r.id).to.equal("a")
    });

    it('Navigation: Answering a should skip b and go on to c (due to preLogic Element.to)', async () => {
        const r = await interaction.initiate(getBody("b"))
        expect(r.id).not.equal("b")
        expect(r.id).to.equal("c")
    });

    it('Navigation: Answering b should go on to c (because it is naturally next)', async () => {
        const r = await interaction.initiate(getBody("b"))
        expect(r.id).to.equal("c")
    });

    it('Navigation: Answering c should skip d and go on to e (due to preLogic Element.next)', async () => {
        const r = await interaction.initiate(getBody("c"))
        expect(r.id).to.equal("e")
    });

    it('Navigation: should go to f (due to preLogic Element.next)', async () => {
        const r = await interaction.initiate(getBody(undefined, "f"))
        expect(r.id).to.equal("f")
    });

    it('Navigation: should 404 if goto element is not found (does not exist in collection)', async () => {
        const r = await interaction.initiate(getBody(undefined, "id does not exist"))
        expect(r.status).to.equal("404")
    });

    it('Navigation: should 404 if an element is not found (does not exist in collection)', async () => {
        const r = await interaction.initiate(getBody("id does not exist"))
        expect(r.status).to.equal("404")
    });

    
    // FIRST:

    it('Logical Blocks: Interaction.onStart should not allow "ctx.findings.color == blue"', async () => {
        const r = await interaction.initiate(getBody(undefined, undefined, {color: "blue"}))
        expect(r.error).to.equal("Color cannot be blue")
    });

    it('Logical Blocks: Collection.validateAssessmentRequirements should not allow "ctx.findings.age > 200"', async () => {
        const r = await interaction.initiate(getBody(undefined, undefined, {age: 300}))
        expect(r.error).to.equal("Age out of range")
    });

    it('Logical Blocks: (first) Interaction.executeGlobalPrelogic should not allow "ctx.findings.name == Jerry"', async () => {
        const r = await interaction.initiate(getBody(undefined, undefined, {name: "Jerry"}))
        expect(r.error).to.equal("Bad Request: Name cannot be Jerry Not Defined")
    });

    it('Logical Blocks: Collection.validateAssessmentRequirements should not allow "ctx.findings.age > 200"', async () => {
        const r = await interaction.initiate(getBody(undefined, "f", {age: 300}))
        expect(r.error).to.equal("Age out of range")
    });

    it('Logical Blocks: (goto) Interaction.executeGlobalPrelogic should not allow "ctx.findings.name == Jerry"', async () => {
        const r = await interaction.initiate(getBody(undefined, "f", {name: "Jerry"}))
        expect(r.error).to.equal("Bad Request: Name cannot be Jerry Not Defined")
    });

    it('Logical Blocks: Element.preAnswerLogic should not allow "ctx.findings.location == Atl"', async () => {
        const r = await interaction.initiate(getBody("g", undefined, {location: "Atl"}))
        expect(r.error).to.equal("Location cannot be Atl")
    });

    it('Logical Blocks: Collection.answerlogic should not allow "ctx.findings.answer == Maybe"', async () => {
        const r = await interaction.initiate(getBody("g", undefined, {answer: "Maybe"}))
        expect(r.error).to.equal("Answer cannot be Maybe")
    });

   

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // // TRANSPORT / VALUES / PIPELINE
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Logical Blocks: Element.preAnswerLogic should be able to set values to the transport"', async () => {
        const r = await interaction.initiate(getBody("e", undefined, {location: "Atl"}))
        const expected = [
            "collection.validateAssessmentRequirements",
            "collection.prelogic",
            "element.preAnswerLogic",
            "collection.answerlogic",
            "element.answerLogic",
            "element.prelogic"
        ]
        expect(r.id).to.equal("f")
        expect(r.transport.collectionOfValues).to.eql(expected)
    });

    it('Logical Blocks: Element.preAnswerLogic should be able to set values/findings to "findings"', async () => {
        const r = await interaction.initiate(getBody("e", undefined, {location: "Atl"}))
        expect(r.findings.someValue).to.eql("Some Value")
    });

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // FINDING VALIDATIONS
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Validations: should fail finding validations', async () => {
        const r = await interaction.initiate(getBody("a", undefined, {rangeFinding: 1000, rangeFinding2: 3000}))
        expect(r.error).to.equal("Validation Errors")
    });

    
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Unit Conversions
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Unit Conversions: should match expected outs', async () => {

        const [lbToKg, ] = Conversions.lbToKg(161.47)
        const [inToCm, ] = Conversions.inToCm(69.63)
        const [inToM , ] = Conversions.inToM(69.37)
        const [cmToM , ] = Conversions.cmToM(2.37)

        const DlbToKg = Math.abs(lbToKg - 73.24156) < .0001
        const DinToCm = Math.abs(inToCm - 176.8602) < .0001
        const DinToM  = Math.abs(inToM  - 1.761998) < .0001
        const DcmToM  = Math.abs(cmToM  - 0.0237  ) < .0001

        expect(DlbToKg).to.equal(true)
        expect(DinToCm).to.equal(true)
        expect(DinToM ).to.equal(true)
        expect(DcmToM ).to.equal(true)
    });

});

after(() => undefined);
