const ConfigurationRepo = require('./ConfigurationRepo')


const defaultConf = {
    id: "test",
    hide: [],
    optional: []
}

class ScreeningConfigurations {

    constructor() {
        this.confs = undefined
        this.loadConfs()
    }

    async loadConfs() {
        const c = await ConfigurationRepo.readAll()
        const confs = c.reduce((a, v) => {
            a[v.id] = v
            return a
        }, {})
        this.confs = confs
    }

    getScreeningConfiguration(ctx) {
        return ctx.query.parameters["screeningConf"] !== undefined
            ? this.confs[ctx.query.parameters.screeningConf] !== undefined ? this.confs[ctx.query.parameters.screeningConf] : defaultConf
            : defaultConf
    }

    save(id, screeningConfiguration) {
        const result = ConfigurationRepo.save(id, screeningConfiguration)
        if (!result.error) this.confs[id] = screeningConfiguration
        return result
    }

    saveAll(screeningConfigurations) {
        const result = ConfigurationRepo.saveAll(screeningConfigurations)
        if (!result.error) screeningConfigurations.forEach(screeningConfiguration => this.confs[screeningConfiguration.id] = screeningConfiguration)
        return result
    }

    readAll() {
        return ConfigurationRepo.readAll()
    }

    read(id) {
        return ConfigurationRepo.read(id)
    }

    delete(id) {
        return ConfigurationRepo.delete(id)
    }
}

module.exports = new ScreeningConfigurations()




