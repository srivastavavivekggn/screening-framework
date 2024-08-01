const app = require('../factories/express-app')
const interaction = require('./Interaction');
const adminController = require('../app/index');

function response(res) {
    return res.set({
        'Content-Type'  : 'application/json',
        'Cache-Control' : 'no-cache'
    })
}

app.post('/initiate', async (req, res) => {
    const r = await interaction.initiate(req)
    response(res).send(r)
});

app.use('/', adminController)

module.exports = app
