const express = require('express')
const app = express();
const cors = require('cors')

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}
app.use(cors(corsOptions))

const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        console.log("hellooo")
        next();
    } else {
        console.log("BYeeeeeeee")
        res.status(401).json({ message: 'Unauthorizeddd', redirectUrl: '/register'});
    }
}

module.exports = isAuth