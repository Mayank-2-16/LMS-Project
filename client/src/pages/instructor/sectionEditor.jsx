import React, { useState } from 'react';
import LectureEditor from './lectureEditor';
import { FaSave, FaPencilAlt, FaTrashAlt, FaPlus } from "react-icons/fa";

const SectionEditor = ({ section, sectionIndex, course, setCourse, deleteSection }) => {
    const [isSectionNameEditing, setIsSectionNameEditing] = useState(false);
    const [newSectionName, setNewSectionName] = useState(section.sectionName);
    const [isHidden, setIsHidden] = useState(false);
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const handleDeleteSection = () => {
        deleteSection(sectionIndex);
    };

    const saveSectionName = () => {
        const updatedSections = [...course.sections];
        updatedSections[sectionIndex].sectionName = newSectionName;
        setCourse({
            ...course,
            sections: updatedSections,
        });
        setIsSectionNameEditing(false);
    };

    const deleteLecture = (lectureIndex) => {
        const updatedSections = [...course.sections];
        updatedSections[sectionIndex].lectures.splice(lectureIndex, 1);
        setCourse({
            ...course,
            sections: updatedSections,
        });
        console.log("updatedSections", updatedSections);
    };

    const handleAddLecture = async () => {
        const lectureIndex = section.lectures.length
        const videoData = {
            title: 'New Lecture',
            videoUrl: '',
            sectionName: section.sectionName,
            lectureIndex: section.lectures.length,
            sectionIndex: sectionIndex,
            courseId: course.courseId,
        }
        console.log("lectureIndex", lectureIndex)
        console.log("videoData", videoData)
        console.log("course", course)

        const response = await fetch(`${BASE_URL}/instructor/addNewVideo/${course.courseId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(videoData),
        });

        const data = await response.json();
        console.log(data)
    };

    return (
        <div className="mt-6 bg-courseeditbgcolor p-5 rounded-xl">
            <div className="flex justify-between items-center mb-4 ">
                {isSectionNameEditing ? (
                    <div className="flex items-center w-full justify-between ">
                        <input
                            type="text"
                            value={newSectionName}
                            onChange={(e) => setNewSectionName(e.target.value)}
                            className="text-xl font-semibold bg-courseeditbgcolor border border-gray-400 w-full mr-2 pl-2"
                        />
                        <button onClick={saveSectionName} className="mr-2 text- mt-0.5">
                            <FaSave className="" />
                        </button>
                    </div>
                ) : (
                    <div className='flex items-center font-semibold'>
                        <h2 className='text-xl border border-gray-100 pl-2'>{newSectionName}</h2>
                        <button onClick={() => setIsSectionNameEditing(true)} className="ml-2 mr-2">
                            <FaPencilAlt className="" />
                        </button>
                        <button onClick={handleDeleteSection}>
                            <FaTrashAlt className="text-red-500 cursor-pointer" />
                        </button>
                    </div>
                )}
            </div>
            {!isHidden && section.lectures.map((lecture, lectureIndex) => (
                <LectureEditor
                    key={lectureIndex}
                    lecture={lecture}
                    lectureIndex={lectureIndex}
                    sectionIndex={sectionIndex}
                    deleteLecture={deleteLecture}
                />
            ))}
            {!isHidden && (
                <button onClick={handleAddLecture} className="mt-4 flex items-center text-gray-800">
                    <FaPlus className="mr-2" /> Add Lecture
                </button>
            )}
        </div>
    );
};

export default SectionEditor;