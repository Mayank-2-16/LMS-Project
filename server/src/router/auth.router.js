const express = require('express');

const authController = require('../controller/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/user').get(authMiddleware, authController.user);

module.exports = router;