const videoModel = require("../models/video.model");

const addVideo = async (req, res, next) => {
    const data1 = req.user;
    const data2 = req.body;
    console.log("video.controller.js1");
    console.log(data1);
    console.log(data2);
    console.log("video.controller.js2");
        const newVideo = new videoModel({ userId: req.user._id, ...req.body });
        console.log(newVideo);
        try {
            const savedVideo = await newVideo.save();
            res.status(200).json(savedVideo);
        } catch (err) {
            next(err);
        }
};

module.exports = addVideo;