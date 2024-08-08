const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {
    res.status(200).json({ message: "coursedetails.router.js post/" });
})

module.exports = router;