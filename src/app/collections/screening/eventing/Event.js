const Publish = require("../../../../avaframework/extras/eventing/publish");


class Event {
    static healthScreeningComplete(ctx) {
        const msg = {
            "source": "health-screening/complete",
            "timestamp": Date.now(),
            "event": "health-screening/complete",
            "description": "Health screening complete",
            "data": {
                "secureId": ctx.query.parameters.secureId,
                "entity": ctx.query.parameters.entity,
                "url": "",
                "id": ctx.query.parameters.id
            }
        }
        Publish("health-screening_complete", JSON.stringify(msg))
    }
}

module.exports = Event

