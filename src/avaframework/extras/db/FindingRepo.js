const mdbcExecute = require("./MongoDBExecutor")
const connectionService = require('../../../factories/mongo-connection-service');

module.exports = function() {

    const collectionName = 'findings'

    const execute = mdbcExecute(connectionService.dbName, connectionService.connect)

    class FindingRepo {

        save(id, findings) {
            return execute(
                (db) => db.collection(collectionName).updateOne({"id": id}, {$set: findings}, {upsert: true}),
                'Error when attempting to update user findings'
            )
        }

        saveAll(id, ...findings) {
            return execute(
                (db) => {
                    var bulk = db.collection(collectionName).initializeUnorderedBulkOp()
                    findings.forEach(finding =>
                        bulk.find({"owner": id, "findingId": finding.findingId}).upsert().replaceOne(finding)
                    )
                    return bulk.execute()
                },
                'Error when attempting to update user findings'
            )
        }

        read(id, ...findingIds) {
            return execute(
                (db) => db.collection('findings').findOne(FindingRepo.inQuery(id, "findingId", ...findingIds)),
                'Error when trying to read user findings'
            )
        }

        delete(id, ...findingIds) {
            return execute(
                (db) => db.collection('findings').deleteMany(FindingRepo.inQuery(id, "findingId", ...findingIds)),
                'Error when trying to delete user findings'
            )
        }

        static inQuery(id, field, ...values) {
            return values.length === 0 ? {owner: id} : {owner: id, [field]: {$in: values}}
        }
    }

    return new FindingRepo()
}()