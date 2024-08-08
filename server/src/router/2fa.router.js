const express = require('express');

const router = express.Router();

router.route('/auth/google').get();

module.exports = router;