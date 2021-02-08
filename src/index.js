const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')

const app = express()

app
    .use(bodyParser.json())



    .get('/', (req, res) => {
        res.json({ message: "Tudo ok por aqui"})
    })

    .get('/clientes', (req, res) => {
        res.json([{ id: 1, name: 'Júlião' }])
    })

    .post('/login', (req, res) => {
        if (req.body.user === 'julio' && req.body === 123) {
            return res.end()
        }

        res.status(401).end()
    })

    .post('/logout', (req, res) => {
        res.end()
    })

    .listen(3000)