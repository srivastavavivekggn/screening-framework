const Errors = require("./Errors");


module.exports = function() {

    const elementNotFound =
        id => Errors.errorResponse(`Element Error: Element '${id}' was not found`, "404", [], false)

    class Element {

        constructor() {
            this.to    = this.navigateFrom(  )
            this.next  = this.navigateFrom( 1)
            this.first = elements => elements[0]
        }

        navigateFrom(direction) {
            return (elements, elementId) => {
                if (direction === undefined) {
                    const next = elements.find(element => element.id === elementId)
                    if (!next) throw elementNotFound(elementId)
                    return next
                } else {
                    const index = elements.findIndex(element => element.id === elementId) + direction
                    if (!elements[index]) throw elementNotFound(elementId)
                    return elements[index]
                }
            }
        }
    }

    return new Element()
}()
