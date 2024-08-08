const videoModel = require('../models/video.model')
const courseModel = require('../models/course.model')
const pipeline = require('../utils/course.pipeline');
const instructorCoursesPipeline = require('../utils/instructor.courses.pipeline');
const userModel = require('../models/user.model');

// CREATE
const addNewVideo = async (req, res) => {
    const videoData = req.body;
    console.log(req.body)
    const { course_id } = req.params;

    try {
        // Isi mein ek update waala bhi banana hai, kyunki button toh ek hi hai 'save' naam se, but functionalities 
        // do hai
        // console.log("sectionIndex", sectionIndex);
        // console.log("lectureIndex", lectureIndex);
        const course = await courseModel.findById(course_id);
        console.log("videoData1", videoData);
        // videoData.courseId = "668b8202a45267930acbdff6";
        // console.log("videoData2", videoData);
        const newVideo = new videoModel({...videoData, teacherId: course.teacherId});
        console.log(newVideo);
        // console.log("Course_id", videoData.courseId);
        // await newVideo.save();
        // console.log("instructor.controller addNewVideo1")

        // console.log("🚀 ~ addNewVideo ~ course:", course)
        // console.log(course);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        console.log("instructor.controller addNewVideo2")

        console.log("instructor.controller addNewVideo8")

        res.status(201).json(course);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error adding video to course', error });
    }

}

const saveCurriculum = async (req, res) => {
    try {
        const {sections, course_id}  = req.body;
        console.log("course_id", course_id);
        console.log(sections);
        console.log(req.body)

        const course = await courseModel.findById(course_id);
        // console.log(course.teacherId);
        const teacherId = course.teacherId;

        for(let i = 0; i < sections.length; i++) {
            const section = sections[i];
            for(let j = 0; j < section.lectures.length; j++) {
                const lecture = section.lectures[j];
                console.log("lecture", lecture);
                const newVideo = new videoModel({
                    teacherId: teacherId,
                    title: lecture.title,
                    videoUrl: lecture.videoUrl,
                    courseId: course_id,
                    lectureIndex: j,
                    sectionIndex: i,
                    sectionName: section.title
                });
                console.log("newVideo", newVideo);
                await newVideo.save();
            }
        }
        res.status(200).json({ message: 'Course Saved Successfully' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error saving Course', error }); 
    }
}

// READ

const getVideos = async (req, res) => {
    const {course_id} = req.params;
    console.log("Fetched CourseId", course_id)
    try {
        let result = await videoModel.aggregate(pipeline).exec();
        console.log(result)
        const sendResult = result.find(item => item.courseId == course_id)
        console.log("result.find(item => item.course_id == req.params.course_id)", sendResult)
        res.status(200).json(sendResult);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error deleting section from course', error });   
    }
}

const instructorAllCourses = async (req, res) => {
    try {
        const courses = await videoModel.aggregate(instructorCoursesPipeline).exec();
        const filteredCourses = courses.find(item => item._id == req.params.teacher_id);

        res.status(200).json(filteredCourses);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching all courses', error });   
    }
}

const getDetails = async (req, res) => {
    try {
        const details = await userModel.findById(req.params.teacher_id);
        res.status(200).json(details);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching teacher details', error });   
    }
}


const isCoursePresent = async (req, res) => {
    console.log("object")
    const {course_id} = req.params;
    console.log(course_id);
    console.log("req.params", req.params)
    try {
        let result = await videoModel.aggregate(pipeline).exec();
        const sendResult = result.find(item => item.courseId == course_id)
        console.log("result.find(item => item.course_id == req.params.course_id)", sendResult)

        let sendStatus = 0;
        if(sendResult) sendStatus = 302; // Redirect if result present
        else{
            sendStatus = 200; // Result not present
        }
        res.status(sendStatus).json(sendResult);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error deleting section from course', error });   
    }
}
// UPDATE

const saveAll = async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error deleting section from course', error });   
    }
}

// DELETE
const deleteVideo = async (req, res) => {
    try {
        const { sectionIndex, lectureIndex } = req.body;
        const courseId = "668b8202a45267930acbdff6";
        console.log("sectionIndex", sectionIndex);
        console.log("lectureIndex", lectureIndex);
        // const courseId = ObjectId('668b8202a45267930acbdff6');
        // const ans = await videoModel.deleteOne({ courseId: courseId, sectionIndex: sectionIndex, lectureIndex: lectureIndex });
        // console.log(ans)
        // const filter = {courseId: { et: courseId }, lectureIndex: { gte: lectureIndex + 1} };
        // const update = {lectureIndex: lectureIndex - 1}

        // const filter = { courseId: courseId, sectionIndex: sectionIndex, lectureIndex: { $gt: lectureIndex } };

        // Define the update to decrement the lectureIndex by 1
        // const update = { $inc: { lectureIndex: -1 } };

        // const result = await videoModel.updateMany(filter, update);
        // console.log(result);
        // console.log(sectionIndex);
        // console.log(lectureIndex);
        // console.log(courseId);
        // console.log(req.body);
        res.status(200).json({ message: 'Video Deleted Successfully' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error deleting video from course', error });
    }
}

const deleteSection = async(req, res) => {
    try {
        const {sectionIndex} = req.body;
        const courseId = "668b8202a45267930acbdff6";
        await videoModel.deleteMany({courseId: courseId, sectionIndex: sectionIndex})
        // const filter = { courseId: courseId, sectionIndex: { $gt: sectionIndex } };

        // Define the update to decrement the lectureIndex by 1
        // const update = { $inc: { sectionIndex: -1 } };

        // await videoModel.updateMany(filter, update);
        res.status(200).json({ message: 'Section Deleted Successfully' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error deleting section from course', error });
    }
}

module.exports = { addNewVideo, deleteVideo, deleteSection, getVideos, saveCurriculum, isCoursePresent, instructorAllCourses, getDetails }