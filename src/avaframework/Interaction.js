const Context                 = require("./Context")
const Validation              = require("./Validation")
const Errors                  = require("./Errors")
const Element                 = require("./Element")
const pipeline                = require("./extras/utils/FunctionalUtils").pipeline
const config                  = require('config')
const ScreeningConfigurations = require("../app/collections/screening/ScreeningConfigurations");


class Interaction {

    async initiate(req) {

        // TEMPORARY ACCESS CONTROL TO RELEASE TO PROD WHILE OUT

        if(config.access !== undefined && req.get("X-Client-Id") !== config.access)
            return Errors.errorResponse("Value for X-Client-Id incorrect or not provided", 401)

        await ScreeningConfigurations.loadConfs()

        try {
            return pipeline(
                Context.initialize(req),
                this.validateRequirements.bind(this), 
                this.evaluateRequest.bind(this),
                this.validateSubmission.bind(this),
                this.executeGlobalPrelogic.bind(this),
                this.getNext.bind(this)
            )
        } catch (error) {
            return error.error ? error : Errors.errorResponse(error.message, 500)
        }
    }

    async validateRequirements(ctx) {
        if (ctx.collection === undefined) throw Errors.badRequestNoCollectionError
        await ctx.collection.validateRequirements(ctx)
        return ctx
    }

    async evaluateRequest(ctx) {
        if (ctx.collection && ctx.query.reference.id === undefined && ctx.query.reference.goto === undefined)
            return await this.getFirst(ctx)
        return ctx
    }

    validateSubmission(ctx) {
        if (ctx.findings === undefined) return ctx
        const validationErrors = Validation.validate(ctx.findings, ctx.collection.findingDefinitions)
        return validationErrors.length > 0 ? Errors.validationError(validationErrors) : ctx
    }

    async executeGlobalPrelogic(ctx) {
        if (undefined === ctx.collection.prelogic) return ctx
        await ctx.collection.prelogic(ctx)
        return ctx
    }

    async getFirst(ctx) {
        await ctx.collection.onFirst(ctx)
        const element = Element.first(ctx.collection.elements)
        await this.executeGlobalPrelogic(ctx)
        return await this.executeNextElement(ctx, element)
    }

    async getNext(ctx) {
        if (ctx.collection && ctx.query.reference.goto) return this.getSpecificElement(ctx)
        const currentElement = Element.to(ctx.collection.elements, ctx.query.reference.id)
        return this.getNextElement(ctx, currentElement)
    }

    async getSpecificElement(ctx) {
        const element = Element.to(ctx.collection.elements, ctx.query.reference.goto)
        await this.executeGlobalPrelogic(ctx)
        return await this.executeNextElement(ctx, element)
    }

    async getNextElement(ctx, currentElement) {
        if (currentElement.preAnswerLogic !== undefined) await currentElement.preAnswerLogic(ctx)
        await ctx.collection.answerlogic(ctx)
        await currentElement.answerLogic(ctx)
        return this.processNextElement(ctx, currentElement)
    }

    async processNextElement(ctx, element) {
        const nextElement = ctx.element !== undefined ? ctx.element : Element.next(ctx.collection.elements, element.id)
        return this.executeNextElement(ctx, nextElement)
    }

    async executeNextElement(ctx, element) {
        ctx.element = undefined
        await element.prelogic(ctx)
        if (ctx.element !== undefined) return this.executeNextElement(ctx, ctx.element)
        return { success: element ? await this.add(ctx, element.element(ctx)) : this.processNextElement(ctx, ctx.element) }
    }

    async add(ctx, element) {
        const e = await element
        this.combine("transport", e, ctx)
        this.combine("found", e, ctx, "findings")
        return e
    }

    async combine(field, e, ctx, setField = field) {
        e[setField] = undefined === ctx[field] && undefined === e[field] ? undefined : { ...e[field], ...ctx[field] }
    }
}


module.exports = new Interaction()