const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
    {
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        title: {
            type: String,
        },
        videoUrl: {
            type: String,
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        lectureIndex: Number,
        sectionIndex: Number,
        sectionName: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);