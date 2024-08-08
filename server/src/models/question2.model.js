const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: String,
    options: [String],
    correctAnswer: Number,
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    index: Number
});


module.exports = mongoose.model('Question2', questionSchema);