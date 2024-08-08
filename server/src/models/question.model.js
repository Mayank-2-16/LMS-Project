const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: String,
    questionNumber: Number,
    options: [String],
    correctAnswer: Number,
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }
});


module.exports = mongoose.model('Question', questionSchema);