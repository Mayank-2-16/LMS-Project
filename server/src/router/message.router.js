const express = require('express');
const router = express.Router();

const { getMessages, getPeople } = require('../controller/message.controller');
const verifyToken = require('../utils/verifyToken');

router.get('/user/:user_id/:selected_user_id', getMessages)

router.get('/people/:user_id', getPeople);

module.exports = router;