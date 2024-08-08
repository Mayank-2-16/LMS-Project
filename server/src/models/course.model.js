const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    title: {
        type: String,
        // required: true
    },
    description: {
        type: String,
        // required: true
    },
    price: {
        type: Number,
        // required: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        // type: String,
        // required: true
    },
    instructor: {
        type: String,
        // required: true
    },
    enrolledStudents : Number,
    courseOutcomes : [{
        type: String
    }],
    prerequisites: String,
    students : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;