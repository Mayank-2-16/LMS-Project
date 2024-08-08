const express = require('express');

const verifyToken = require('../utils/verifyToken');

const router = express.Router();

const { addNewVideo, deleteVideo, deleteSection, getVideos, saveCurriculum, isCoursePresent, instructorAllCourses, getDetails } = require('../controller/instructor.controller');
const isCourseTaught = require('../middlewares/instructor.middleware');

router.get('/getVideos/:course_id', verifyToken, isCourseTaught, getVideos)

router.get('/instructorAllCourses/:teacher_id', instructorAllCourses)

router.get('/isCoursePresent/:course_id', verifyToken, isCourseTaught, isCoursePresent)

router.get('/getDetails/:teacher_id', getDetails)

router.post('/addNewVideo/:course_id', addNewVideo)

router.post('/saveCurriculum', saveCurriculum)

router.delete('/deleteVideo', deleteVideo)

router.delete('/deleteSection', deleteSection)

module.exports = router;