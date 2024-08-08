const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model')

const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization");

    if(!token){
        return res.status(401).json({message : "Utauthorized HTTP, token not valid"}); 
    }

    
    console.log("token from middleware", token);
    const jwtToken = token.replace("Bearer", "").trim();
    console.log("token from middleware", jwtToken);

    try {
        const isVerified = jwt.verify(jwtToken, "Secret-Key");
        const userData = await userModel.findOne({ email : isVerified.email}).select({ password : 0})
        console.log(userData);

        req.user = userData;
        req.token = token;
        req.userId = userData._id;
    } catch (error) {
        return res.status(401).json({message : "Utauthorized HTTP, token not valid"}); 
    }

    next();
}

module.exports = authMiddleware;