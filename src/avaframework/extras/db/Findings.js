const FindingRepo = require('./FindingRepo')


class Findings {

    async save(id, findings) {
        const result = await FindingRepo.save(id, findings)
        return result.error === undefined ? { success: `${result.length} findings successfully updated` } : result
    }

    async saveAll(id, ...findings) {
        const result = await FindingRepo.saveAll(id, ...findings)
        return result.error === undefined ? { success: `findings successfully updated` } : result
    }

    read(id, ...findingIds) {
        return FindingRepo.read(id, ...findingIds)
    }

    delete(id, ...findingIds) {
        return FindingRepo.delete(id, ...findingIds)
    }

    findingEntry(findingDefinitions) {
         return function(id, findingId, value) {
             const findingDefinition = findingDefinitions[findingId]
             return {
                 owner: id,
                 findingId: findingId,
                 name: findingDefinition ? findingDefinition.name : findingId,
                 value: value,
                 updated: Date.now(),
                 expires: findingDefinition ? findingDefinition.expiresAfterDuration : Date.now()
             }
         }
    }
}

module.exports = new Findings()