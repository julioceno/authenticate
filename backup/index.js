const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const app = express()

const SECRET= 'julioceno'

function verifyJwt(req, res, next) {
    const token = req.headers['x-access-token']
    console.log(token)

    const index = blackList.findIndex(item => { item === token})
    if (index !== -1) return res.status(401).end()

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(401).end()

        console.log(decoded)

        next()
    })

}

const blackList  = []

app
    .use(bodyParser.json())


    .get('/', (req, res) => {
        res.json({ message: "Tudo ok por aqui"})
    })

    .get('/clientes', verifyJwt,(req, res) => {
        res.json([{ id: 1, name: 'Júlião' }])
    })

    .post('/login', (req, res) => {
      
        if (req.body.user === 'julio' && req.body.password === 123) {
            let token = jwt.sign({userId: 1}, SECRET, {expiresIn: 50})

            
            return res.json({auth: true, token})
        }

        res.status(401).end()
    })

    .post("/refresh", verifyJwt, (req, res) => {
        const token = jwt.sign({ userId: 1 }, SECRET, { expiresIn: 50 });

        return res.json({ auth: true, token });
    })

    .post('/logout', (req, res) => {
        blackList.push(req.headers['x-access-token'])
        res.end()
    })

    .listen(3000)