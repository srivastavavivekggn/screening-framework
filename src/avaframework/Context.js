const Collections = require('../app/collections/Collections')


module.exports = function() {

    const ensure = o =>
        (o !== null && typeof o === 'object') ? o : {}

    class Context {
        static initialize(req) {
            const body = req.body
            const q = {...body, ...{parameters: ensure(body.parameters)}}
            return {
                req: req,
                query: q,
                findings: ensure(body.findings),
                element: undefined,
                collection: Collections[body.reference.collection],
                transport: ensure(body.transport),
                found: {}
            }
        }
    }

    return Context
}()
