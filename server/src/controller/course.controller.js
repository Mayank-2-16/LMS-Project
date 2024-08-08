const userModel = require("../models/user.model");
const courseModel = require("../models/course.model");
const videoModel = require("../models/video.model");
const questionModel = require("../models/question.model");

const pipeline = require("../utils/course.pipeline")
const myCoursesPipeline = require("../utils/mycourses.pipeline");

// CREATE

const buyCourse = async (req, res) => {
    const { userId, courseId } = req.body;

    try {
        console.log("course.router.js1 .post/buy");
        console.log(userId, courseId);
        const course = await courseModel.findById(courseId);

        if (!course) return res.status(404).json({ message: "Course not found" });

        if (course.students.includes(userId)) return res.status(400).json({ message: "User already enrolled" });

        course.students.push(userId);
        console.log(course.students);
        await course.save();

        res.status(200).json({ message: "Course purchased successfully" });
    } catch (error) {
        console.error("Error purchasing course:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const createCourse = async (req, res) => {
    try {
        console.log("req.body", req.body);
        const { title, desc, prerequisites } = req.body;
        const courseOutcomes = Object.keys(req.body.courseOutcomes).map((key) => req.body.courseOutcomes[key]);
        console.log(courseOutcomes)
        const course = await courseModel.create({
            title,
            description: desc,
            courseOutcomes,
            teacherId: req.user._id,
            prerequisites
        })
        console.log(course);
        res.status(200).json(course._id);
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(400).json(error);
    }
}

// READ

const getAllCourses = async (req, res) => {
    try {
        let result = await videoModel.aggregate(pipeline).exec();
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const getCourseById = async (req, res) => {
    let result = await videoModel.aggregate(pipeline).exec();
    // console.log(JSON.stringify(result, null, 2));
    res.status(200).json(result.find(item => item.courseId == req.params.id));
}

const getRelatedCourses = async (req, res) => {
    const id = req.params.id;

    try {
        let relatedCourses = [];
        let result = await videoModel.aggregate(pipeline).exec();

        result.map((course) => (relatedCourses.length < 2 && id != course.courseId) ? relatedCourses.push(course) : null);
        res.status(201).json(relatedCourses);
    } catch (error) {
        console.log("Error while fetching related courses", error);
    }
}

const getCourseVideo = async (req, res) => {
    try {
        console.log("req.user._id", req.user._id)

        const { course_id, video_id } = req.params;
        const course = await courseModel.findById(course_id);
        if (!course) {
            res.status(402).json({ message: "Course not found" });
        } else {
            const video = await videoModel.findById(video_id);
            video.courseId == course_id ? res.status(200).json(video.videoUrl) : res.status(404).json({ message: "Video not found" });
        }
    } catch (error) {
        console.error("Error fetching course video:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const getMyCourses = async (req, res) => {
    try {
        const courses = await courseModel.aggregate(myCoursesPipeline).exec();
        res.status(200).json(courses.find(item => item._id == req.user._id));
    } catch (error) {
        console.error("Error fetching my courses:", error);
        res.status(500).json({ message: "Server error" });
    }
}

// UPDATE


// DELETE

module.exports = {
    getCourseById,
    buyCourse,
    getAllCourses,
    getRelatedCourses,
    getCourseVideo,
    getMyCourses,
    createCourse
}