import React, { useState } from 'react';
import { FaSave, FaPencilAlt, FaTrashAlt, FaExternalLinkAlt, FaBars } from "react-icons/fa";

const LectureEditor = ({ lecture, lectureIndex, sectionIndex, deleteLecture }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingVideo, setIsEditingVideo] = useState(false);
    const [isViewing, setIsViewing] = useState(false);
    const [newLectureTitle, setNewLectureTitle] = useState(lecture.video.title);
    const courseId = "668b8202a45267930acbdff6";
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const saveLectureTitle = () => {
        lecture.video.title = newLectureTitle;
        setIsEditing(false);
    };

    const handleEditLecture = () => {
        setIsEditingVideo(false);
    };

    const handleDeleteLecture = async () => {
        try {
            const response = await fetch(`${BASE_URL}/instructor/deleteVideo`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    courseId,
                    sectionIndex,
                    lectureIndex,
                    // videoData
                }),
            });

            if (response.ok) {
                deleteLecture(lectureIndex);

                console.log('Video deleted successfully');
            } else {
                console.error('Failed to delete video');
            }
        } catch (error) {
            console.log("error", error)
        }
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
    };

    return (
        <div className="mt-2 bg-white px-4 py-2.5 mb-4">
            <div className="flex justify-between items-center px-1">
                <FaBars className='mr-2 text-lg' />
                {isEditing ? (
                    <div className="flex justify-between w-full items-center">
                        <input
                            type="text"
                            value={newLectureTitle}
                            onChange={(e) => setNewLectureTitle(e.target.value)}
                            className="rounded-md border border-gray-300 px-1 text-lg w-full font-semibold outline-none"
                        />
                        <button onClick={saveLectureTitle} className="ml-2">
                            <FaSave className="" />
                        </button>
                    </div>
                ) : (
                    <div className='flex w-full items-center justify-between '>
                        <h3 className="text-lg font-medium border outline-none border-white">{newLectureTitle}</h3>
                        <div>
                            <button onClick={() => setIsEditing(true)} className="ml-2">
                                <FaPencilAlt className="" />
                            </button>
                            <button onClick={() => handleDeleteLecture()} className="ml-2">
                                <FaTrashAlt className="text-red-500" />
                            </button>
                            <button onClick={() => setIsViewing(true)} className="ml-2">
                                <FaExternalLinkAlt className="" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {isViewing && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                    <div className="bg-white p-4 rounded-lg w-3/4">
                        <video src={lecture.video.videoUrl} controls className="w-full mb-4" />
                        <button onClick={() => setIsViewing(false)} className="bg-gray-800 text-white px-4 py-2 rounded-lg">Close</button>
                        <button onClick={() => setIsEditingVideo(true)} className="bg-slate-600 text-white px-4 py-2 rounded-lg ml-2">Edit Video</button>
                    </div>
                </div>
            )}
            {isEditingVideo && (
                <div className="fixed inset-0 flex items-end pb-7 justify-center bg-gray-800 bg-opacity-75">
                    <div className="bg-white p-4 rounded-lg w-3/4 h-[10%]">
                        <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoChange}
                            className="mb-4"
                        />
                        <button onClick={handleEditLecture} className="bg-gray-600 text-white px-4 py-2 rounded-lg">Save</button>
                        <button onClick={() => setIsEditingVideo(false)} className="bg-gray-800 text-white px-4 py-2 rounded-lg ml-2">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LectureEditor;