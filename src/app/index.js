const ScreeningConfigurations = require('./collections/screening/ScreeningConfigurations')
const Collections = require('./collections/Collections')
const config = require('config')
const Errors = require("../avaframework/Errors")
const express = require('express')
const router = express.Router()

function response(res) {
    return res.set({
        'Content-Type'  : 'application/json',
        'Cache-Control' : 'no-cache'
    })
}

router.patch('/admin/configurations/:id', async (req, res) => {
    if(config.admin_access !== undefined && req.get("X-Client-Id") !== config.admin_access)
        return response(res).send(Errors.errorResponse("Value for X-Client-Id incorrect or not provided", 401))
    req.body.id = req.params.id
    ScreeningConfigurations.save(req.params.id, req.body)
    response(res).send(req.body)
});

router.patch('/admin/configurations', async (req, res) => {
    if(config.admin_access !== undefined && req.get("X-Client-Id") !== config.admin_access)
        return response(res).send(Errors.errorResponse("Value for X-Client-Id incorrect or not provided", 401))
    ScreeningConfigurations.saveAll(req.body)
    response(res).send(req.body)
});

router.get('/admin/configurations/:id', async (req, res) => {
    if(config.admin_access !== undefined && req.get("X-Client-Id") !== config.admin_access)
        return response(res).send(Errors.errorResponse("Value for X-Client-Id incorrect or not provided", 401))
    const r = await ScreeningConfigurations.read(req.params.id)
    response(res).send(r)
});

router.get('/admin/configurations', async (req, res) => {
    if(config.admin_access !== undefined && req.get("X-Client-Id") !== config.admin_access)
        return response(res).send(Errors.errorResponse("Value for X-Client-Id incorrect or not provided", 401))
    const r = await ScreeningConfigurations.readAll()
    response(res).send(r)
});

router.get('/admin/collection/:id', async (req, res) => {
    if(config.admin_access !== undefined && req.get("X-Client-Id") !== config.admin_access)
        return response(res).send(Errors.errorResponse("Value for X-Client-Id incorrect or not provided", 401))
    const collection = Collections[req.params.id]
    response(res).send(collection.elements)
});



module.exports = router

