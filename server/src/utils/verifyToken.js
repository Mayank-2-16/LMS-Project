const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({ message: "You are not authenticated!" })
    }
    jwt.verify(token, "Secret-Key", async (err, user) => {
        if (err) {
            return res.status(403).json("Token is not valid!")
        }
        req.user = user
        console.log("verify token successful")
        next()
    })
}

module.exports = verifyToken