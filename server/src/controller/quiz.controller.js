const questionModel = require("../models/question.model");
const questionModel2 = require("../models/question2.model");

// CREATE

const createQuizQuestions2 = async (req, res) => {
    try {
        const { quesData, course_id, index } = req.body;
        let empty = false;
        

        quesData.questions.forEach(async (ques) => {
            let emptyOptions = false;

            if(!ques.question) {
                empty = true;
                res.status(406).json({message: "Enter all question titles"})
                return;
            }
            ques.options.forEach((option) => {
                if(!option) {
                    emptyOptions = true;
                    empty = true;
                }
            });

            if(emptyOptions) {
                empty = true;
                res.status(406).json({message: "Enter all question options"});
                return;
            }

            if(!ques.correctAnswer) res.status(406).json({message: "Select a correct answer"});
        })


        if(!empty){
            quesData.questions.forEach(async (ques) => {
                const optionsArray = new Array();
    
                console.log(ques.question);
                ques.options.forEach((option) => {
                    console.log(option);
                    optionsArray.push(option);
                });
                console.log(optionsArray)
                console.log(ques.correctAnswer)
    
                const newQuestion = new questionModel2({
                    questionText: ques.question,
                    options: optionsArray,
                    correctAnswer: ques.correctAnswer,
                    courseId: course_id,
                    index: index
                });
                await newQuestion.save();
            })
        }
    } catch (error) {
        console.log("Error while creating Questions", error);
        res.status(406).json({ error });
    }
}

const createQuizQuestions = async (req, res) => {
    try {
        const { quesData, course_id } = req.body;
        let errors = [];
        console.log(course_id);

        // Validate input data
        quesData.questions.forEach((ques, qIndex) => {
            // console.log(index);
            if (!ques.question) {
                errors.push(`Question ${qIndex + 1} title is missing`);
            }

            let emptyOptions = false;
            ques.options.forEach((option, oIndex) => {
                if (!option) {
                    emptyOptions = true;
                    errors.push(`Option ${oIndex + 1} for Question ${qIndex + 1} is missing`);
                }
            });

            if (!ques.correctAnswer) {
                errors.push(`Correct answer for Question ${qIndex + 1} is not selected`);
            }
        });

        if (errors.length > 0) {
            return res.status(406).json({ message: "Validation errors", errors });
        }

        // Save questions if no validation errors
        for (const ques of quesData.questions) {
            const newQuestion = new questionModel2({
                questionText: ques.question,
                options: ques.options,
                correctAnswer: ques.correctAnswer,
                courseId: course_id,
                index: ques.index
            });
            // await newQuestion.save();
            console.log(newQuestion);
        }

        res.status(201).json({ message: "Questions created successfully" });
    } catch (error) {
        console.log("Error while creating Questions", error);
        res.status(500).json({ error: "An error occurred while creating questions" });
    }
}


// READ

const getQuizQuestions = async (req, res) => {
    try {
        console.log("quiz.contoller.js1")
        const { course_id } = req.params;
        console.log(course_id)
        const questions = await questionModel2.find({ courseId: course_id });
        res.status(200).json(questions);
    } catch (error) {
        console.log("Error fetching questions", error);
        res.status(500).json({ error: "An error occurred while fetching questions" });
    }
};


// UPDATE

const updateQuizQuestions = async (req, res) => {
    try {
        const { course_id } = req.params;
        const { questions } = req.body;

        console.log(questions)
        await questionModel2.deleteMany({ courseId: course_id })

        for (const ques of questions) {
            console.log(ques._id)
            console.log(ques.questionText)
            console.log(ques.correctAnswer)
            console.log(ques.index)
                const newQuestion = new questionModel2({
                    questionText: ques.questionText,
                    options: ques.options,
                    correctAnswer: ques.correctAnswer,
                    courseId: course_id,
                    index: ques.index
                });

                await newQuestion.save()
            }
        res.status(200).json({ message: "Questions updated successfully" });
    } catch (error) {
        console.log("Error while updating questions", error);
        res.status(500).json({ error: "An error occurred while updating questions" });
    }
};

// DELETE


const submitQuizQuestions = async (req, res) => {
    const { answers } = req.body;
    console.log(answers)
    const questions = await questionModel2.find().select('correctAnswer');
    let score = 0;
    questions.forEach((question, index) => {
        if (question.correctAnswer === answers[index]) {
            score++;
        }
    });
    res.status(201).json({ passed: score >= 6, score });
}


module.exports = { getQuizQuestions, submitQuizQuestions, createQuizQuestions, updateQuizQuestions };