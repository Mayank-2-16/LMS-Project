const messageModel = require('../models/message.model');
const userModel = require('../models/user.model');
const courseModel = require('../models/course.model');

const getMessages = async (req, res) => {
    const { user_id, selected_user_id } = req.params;
    const messages1 = await messageModel.find({ sender: [user_id], recipient: [selected_user_id] }).sort({ createdAt: 1 });
    const messages2 = await messageModel.find({ sender: [selected_user_id], recipient: [user_id] }).sort({ createdAt: 1 });
    const totalMessages = [...messages1, ...messages2].sort((a, b) => a.createdAt - b.createdAt);
    res.json(totalMessages);
}

const getPeople = async (req, res) => {
    const { user_id } = req.params;
    const result = await courseModel.aggregate([
        {
            $unwind: "$students"
        },
        {
            $lookup: {
                from: "users",
                localField: "teacherId",
                foreignField: "_id",
                as: "teacherDetails"
            }
        },
        {
            $unwind: "$teacherDetails"
        },
        {
            $group: {
                _id: "$students",
                chatDetails: {
                    $addToSet: {
                        senderId: "$teacherDetails._id",
                        senderName: "$teacherDetails.name"
                    }
                }
            }
        },
        {
            $project: {
                recipientId: "$_id",
                chatDetails: 1,
                _id: 0
            }
        }
    ]);

    const otherPeople = await messageModel.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'sender',
                foreignField: '_id',
                as: 'senderDetails'
            }
        },
        {
            $unwind: '$senderDetails'
        },
        {
            $group: {
                _id: '$recipient',
                chatDetails: {
                    $addToSet: {
                        senderId: '$sender',
                        senderName: '$senderDetails.name'
                    }
                }
            }
        },
        {
            $project: {
                recipientId: '$_id',
                chatDetails: 1,
                _id: 0
            }
        }
    ]);


    let combined = [...result, ...otherPeople];

    const singleUserChatDetails = combined.filter((item) => item.recipientId == user_id);
    let merged = [];

    singleUserChatDetails.map((item) => {
        item.chatDetails.map((chatDetail) => {
            if (merged.length === 0) {
                merged.push(chatDetail);
            } else {
                merged.forEach((mergedItem) => {
                    if (mergedItem.senderId.toString() != chatDetail.senderId.toString()) {
                        merged.push(chatDetail);
                    }
                });
            }
        });
    });

    const uniqueElements = new Map();

    // Iterate over each element of the array
    merged.forEach(element => {
        // Create a unique key based on the contents of the object
        const key = `${element.senderId}-${element.senderName}`;
        if (!uniqueElements.has(key)) {
            uniqueElements.set(key, element);
        }
    });

    // Convert the Map values back to an array
    const resultArray = Array.from(uniqueElements.values());

    res.status(200).json(resultArray);
}

module.exports = {
    getMessages,
    getPeople
}