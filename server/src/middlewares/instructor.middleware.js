const courseModel = require('../models/course.model')

const isCourseTaught = async (req, res, next) => {
    try {
        console.log("req.user at isCourseTaught", req.user);
        console.log("req.body at isCourseTaught", req.body);
        console.log("req.params at isCourseTaught", req.params);

        const course = await courseModel.findById(req.params.course_id);
        console.log(course)

        if (course.teacherId != req.user._id) {
            return res.status(400).json({message: "You are not the owner of this course"})
        }
        
        console.log("You can access this course as you are the owner of this course")

        next();
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
}

module.exports = isCourseTaught;