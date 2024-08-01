const MongoClient = require('mongodb').MongoClient
const mdbcExecute = require("../../../avaframework/extras/db/MongoDBExecutor")
const {dbName, connStr} = require('../../../factories/mongo-connection-service')

class Configuration {

    constructor(collectionName) {
        this.execute = mdbcExecute(
            dbName,
            () => MongoClient.connect(connStr)
        )
        this.collectionName = collectionName
    }

    save(id, configuration) {
        configuration._id == undefined
        return this.execute(
            (db) => db.collection(this.collectionName).updateOne({"id": id}, {$set: configuration}, {upsert: true}),
            'Error when attempting to update screening configuration'
        )
    }

    saveAll(configurations) {
        return this.execute(
            (db) => {
                var bulk = db.collection(this.collectionName).initializeUnorderedBulkOp()
                configurations.map(item => item._id = undefined).forEach(configuration =>
                    bulk.find({"id": configuration.id}).upsert().replaceOne(configuration)
                )
                return bulk.execute()
            },
            'Error when attempting to update screening configurations'
        )
    }

    readAll() {
        return this.execute(
            async (db) => {
                const c = await db.collection(this.collectionName).find({}).toArray()
                c.map(c => c._id = undefined)
                return c
            },
            'Error when trying to read configurations'
        )
    }

    read(id) {
        return this.execute(
            async (db) => {
                const c = await db.collection(this.collectionName).findOne(Configuration.inQuery("id", id))
                return {...c, _id: undefined}
            },
            'Error when trying to read configuration'
        )
    }

    delete(id) {
        return this.execute(
            (db) => db.collection(this.collectionName).deleteMany(Configuration.inQuery("id", id)),
            'Error when trying to delete configuration'
        )
    }

    static inQuery(field, ...values) {
        return {[field]: {$in: values}}
    }
}


module.exports = Configuration