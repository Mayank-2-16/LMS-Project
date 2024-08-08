const bcrypt = require('bcrypt');
const OTP = require('../models/otp.model');

const userModel = require('../models/user.model');

const user = async (req, res) => {
    try {
        const userData = req.user;
        console.log(userData)
        return res.status(200).json({msg: userData});
    } catch (error) {
        console.log(`Error from user router: ${error}`);
    }
}

module.exports = { user };