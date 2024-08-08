const instructorCoursesPipeline = [
    {
        $group: {
            _id: {
                courseId: "$courseId",
                sectionIndex: "$sectionIndex",
                lectureIndex: "$lectureIndex"
            },
            videos: {
                $push: "$$ROOT"
            },
            totalVideos: {
                $sum: 1
            }
        }
    },
    {
        $addFields:
        /**
         * newField: The new field name.
         * expression: The new field expression.
         */
        {
            teacherId: "$videos.teacherId"
        }
    },
    {
        $project: {
            totalVideos: 1,
            _id: 1,
            videos: {
                _id: 1,
                title: 1,
                videoUrl: 1,
                sectionName: 1
                // userId: 1
            },
            teacherId: 1
        }
    },
    {
        $lookup: {
            from: "courses",
            localField: "_id.courseId",
            foreignField: "_id",
            as: "courseDetails"
        }
    },
    // {
    //   $unwind: "$courseDetails"
    // }
    {
        $group: {
            _id: {
                courseId: "$_id.courseId",
                teacherId: "$teacherId",
                sectionIndex: "$_id.sectionIndex"
            },
            courseTitle: {
                $first: "$courseDetails.title"
            },
            courseDescription: {
                $first: "$courseDetails.description"
            },
            lectures: {
                $push: {
                    lectureIndex: "$_id.lectureIndex",
                    video: {
                        $first: "$videos"
                    }
                }
            },
            totalSectionVideos: {
                $sum: "$totalVideos"
            },
            price: {
                $first: "$courseDetails.price"
            }
        }
    },
    {
        $sort: {
            "_id.sectionIndex": 1
        }
    },
    {
        $project: {
            _id: 0,
            courseId: "$_id.courseId",
            courseTitle: {
                $first: "$courseTitle"
            },
            courseDescription: {
                $first: "$courseDescription"
            },
            teacherId: {
                $first: "$_id.teacherId"
            },
            sectionName: {
                $first: "$lectures.video.sectionName"
            },
            sectionIndex: "$_id.sectionIndex",
            totalSectionVideos: 1,
            lectures: {
                $sortArray: {
                    input: "$lectures",
                    sortBy: {
                        lectureIndex: 1
                    }
                }
            },
            price: {
                $first: "$price"
            }
        }
    },
    {
        $lookup:
        /**
         * from: The target collection.
         * localField: The local join field.
         * foreignField: The target join field.
         * as: The name for the results.
         * pipeline: Optional pipeline to run on the foreign collection.
         * let: Optional variables to use in the pipeline field stages.
         */
        {
            from: "users",
            localField: "teacherId",
            foreignField: "_id",
            as: "teacher"
        }
    },
    {
        $group: {
            _id: "$courseId",
            courseTitle: {
                $first: "$courseTitle"
            },
            // teacherId: "$teacherId",
            teacherName: {
                $first: "$teacher.name"
            },
            courseDescription: {
                $first: "$courseDescription"
            },
            // courseDescription: "$courseDescription",
            sections: {
                $push: {
                    totalSectionVideos:
                        "$totalSectionVideos",
                    lectures: "$lectures",
                    sectionName: "$sectionName",
                    sectionIndex: "$sectionIndex"
                }
            },
            totalCourseVideos: {
                $sum: "$totalSectionVideos"
            },
            teacherId: {
                $first: "$teacherId"
            },
            price: {
                $first: "$price"
            }
        }
    },
    {
        $project: {
            _id: 0,
            courseId: "$_id",
            courseTitle: 1,
            courseDescription: 1,
            totalCourseVideos: 1,
            sections: 1,
            teacherName: {
                $first: "$teacherName"
            },
            teacherId: "$teacherId",
            price: "$price"
        }
    },
    {
        $group:
        /**
         * _id: The id of the group.
         * fieldN: The first field name.
         */
        {
            _id: {
                courseId: "$courseId",
                teacherId: "$teacherId"
            },
            teacherId: {
                $first: "$teacherId"
            },
            courseDetails: {
                $first: "$$ROOT"
            }
        }
    },
    {
        $group:
        /**
         * _id: The id of the group.
         * fieldN: The first field name.
         */
        {
            _id: "$teacherId",
            courseDetails: {
                $push: "$courseDetails"
            }
        }
    }
]


module.exports = instructorCoursesPipeline;