const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const verifyToken = require("../utils/verifyToken")

const app = express();

// const cors = require('cors')
// const corsOptions = {
//     origin: 'http://localhost:5173',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
// }
// app.use(cors(corsOptions))

const { getUserDetails, changePassword, updateDetails, isCourseBought, role } = require('../controller/user.controller');

router.post("/", verifyToken, (req, res) => {
    console.log("Authentication");
    res.status(200).json({ message: "user.router.js post/" });
});

router.post('/auth', async (req, res) => {
    try {
        console.log("user.router.js");
        const token = req.cookies.token;
        const userId = JSON.parse(atob(token.split('.')[1]))._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            success: true,
            message: 'Login successful',
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/name/:user_id', async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const user = await User.findById(user_id);
        res.json({ name: user.name });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/details/:user_id', verifyToken, getUserDetails);

router.get('/:user_id/isCourseBought/:course_id', isCourseBought);

router.get('/role', verifyToken, role);

router.patch('/change-password/:user_id', changePassword);

router.patch('/updateDetails/:user_id', updateDetails);

module.exports = router;