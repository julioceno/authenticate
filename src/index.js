const express = require("express")
const jwt = require("jsonwebtoken")

const app = express()

const blackList = []

function auth(req, res, next) {
    let token = req.headers['authorization']
    token = token.split(' ')[1];

    console.log(token)

    jwt.verify(token, "access", (err, user) => {
        if (!err) {
            req.user = user 
            next()
        } else {
            console.log("cri cri")
            return res.status(401).json({message: "user not authenticated"})
        }
    })
}

app.use(express.json())

app.get("/protected", auth, (req, res) => {
    res.send('inside protected route')
})

app.post('/login', (req, res) => {
    const { user } = req.body

    if (!user ) {
        return res.status(401).json({message:"Body empty"})
    }

    let accessToken = jwt.sign(user, "access", {expiresIn: "30s"} )
    let refreshToken = jwt.sign(user, "refresh", {expiresIn: "7d"} )
    blackList.push(refreshToken)
   
    return res.json({
        accessToken,
        refreshToken
    })
})

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.token;
    console.log(refreshToken)

    if (!refreshToken || !blackList.includes(refreshToken)) {
        return res.json({ message: "User not authenticated" })
    }

    jwt.verify(refreshToken, "refresh", (err, user) => {
        if (!err) {
    console.log("o3")

            const accessToken = jwt.sign({ username: user.name }, "access", { expiresIn: "30s" })
            return res.json({ sucess: accessToken })
        } else {
            return res.status(401).json({ message: "User not authenticated "})
        }
    })
})


app.listen(3000)