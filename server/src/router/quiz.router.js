const express = require("express");
const router = express.Router();
const { getQuizQuestions, submitQuizQuestions,createQuizQuestions, updateQuizQuestions } = require("../controller/quiz.controller")

// CREATE
router.post('/create', createQuizQuestions)

// READ
router.get('/questions/:course_id', getQuizQuestions)

// UPDATE

router.put('/update/:course_id', updateQuizQuestions)

// DELETE

router.post('/submit', submitQuizQuestions)

module.exports = router;