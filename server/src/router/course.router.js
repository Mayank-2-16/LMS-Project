const express = require("express");
const router = express.Router();
const verifyToken = require("../utils/verifyToken");

const { getCourseById, buyCourse, getAllCourses, getRelatedCourses, getCourseVideo, getMyCourses, createCourse } = require("../controller/course.controller");

// CREATE
router.post("/buy", buyCourse);

router.post("/create", verifyToken, createCourse);

// READ
router.get("/all", getAllCourses);

router.get('/:course_id/video/:video_id', verifyToken, getCourseVideo)

router.get('/related/:id', getRelatedCourses)

router.get("/get/:id", getCourseById)

router.get("/my-courses", verifyToken, getMyCourses);

// UPDATE
// DELETE


module.exports = router;