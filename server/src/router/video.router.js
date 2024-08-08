const express = require('express');
const router = express.Router();
const addVideo = require("../controller/video.controller")
const path = require('path');
const videoModel = require('../models/video.model')

router.post("/upload", addVideo, async (req, res) => {
    try {
        console.log("video.router.js")
        console.log(req.user)
        
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
})

module.exports = router;