const myCoursesPipeline = [
    {
        $group:
        /**
         * _id: The id of the group.
         * fieldN: The first field name.
         */
        {
            _id: {
                studentId: "$students",
                courseId: "$_id"
            },
            studentId: {
                $first: "$students"
            },
            courseDetails: {
                $first: "$$ROOT"
            }
        }
    },
    {
        $unwind:
        /**
         * path: Path to the array field.
         * includeArrayIndex: Optional name for index.
         * preserveNullAndEmptyArrays: Optional
         *   toggle to unwind null and empty values.
         */
        {
            path: "$studentId"
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
            from: "videos",
            localField: "courseDetails._id",
            foreignField: "courseId",
            as: "courseDetails.videos"
        }
    },
    {
        $group:
        /**
         * _id: The id of the group.
         * fieldN: The first field name.
         */
        {
            // _id: "$_id",
            _id: "$studentId",
            courseDetails: {
                $push: "$courseDetails"
            }
        }
    }
]

module.exports = myCoursesPipeline;