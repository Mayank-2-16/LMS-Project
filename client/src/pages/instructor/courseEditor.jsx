import React, { useState, useEffect } from 'react';
import SectionEditor from './sectionEditor';
import { FaSave, FaPencilAlt, FaPlus } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const CourseEditor = () => {
    const [course, setCourse] = useState(null);
    const [isCourseTitleEditing, setIsCourseTitleEditing] = useState(false);
    const [isCourseDescEditing, setIsCourseDescEditing] = useState(false);
    const [newCourseTitle, setNewCourseTitle] = useState('');
    const [newCourseDesc, setNewCourseDesc] = useState('');
    const { course_id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEditDetails = async () => {
            try {
                const response = await fetch(`${BASE_URL}/instructor/getVideos/${course_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: 'include',
                });

                console.log(response.status);
                if(response.status === 401) navigate('/login')
                else if(response.status === 400) navigate('/profile/dashboard')
                else if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                const data = await response.json();
                console.log(data)
                setCourse(data);
                setNewCourseTitle(data.courseTitle);
                setNewCourseDesc(data.courseDescription);
            } catch (error) {
                console.log("Error while fetching courses", error);
            }
        };
        fetchEditDetails();
    }, [course_id]);

    if (!course) {
        return <div>Loading...</div>;
    }

    const saveTitle = async () => {
        try {
            setIsCourseTitleEditing(false);
        } catch (error) {
            console.error("Error updating course title:", error);
        }
    };

    const saveDesc = async () => {
        try {
            setIsCourseDescEditing(false);
        } catch (error) {
            console.error("Error updating course description:", error);
        }
    };

    const handleCourseTitleChange = (e) => {
        setNewCourseTitle(e.target.value);
    };

    const handleCourseDescChange = (e) => {
        setNewCourseDesc(e.target.value);
    };

    const handleAddSection = () => {
        const newSection = {
            sectionName: 'New Section',
            lectures: [{ lectureIndex: 0, videoData: { _id: '', title: 'New Lecture', videoUrl: '', sectionName: 'New Section' } }],
            sectionIndex: course.sections.length,
            totalSectionVideos: 1,
        };
        
        const updatedCourse = {
            ...course,
            sections: [...course.sections, newSection],
            totalCourseVideos: course.totalCourseVideos + 1,
        };

        setCourse(updatedCourse);
    }

    const deleteSection = (sectionIndex) => {
        const updatedSections = [...course.sections];
        updatedSections.splice(sectionIndex, 1);
        const updatedCourse = {
            ...course,
            sections: updatedSections,
            totalCourseVideos: course.totalCourseVideos - course.sections[sectionIndex].totalSectionVideos,
        };
        console.log(updatedCourse);
        setCourse(updatedCourse);
    };

    return (
        <div className='bg-gray-50 min-h-screen'>
            <div className='flex justify-center'>
                <h1 className='text-5xl font-semibold mb-12 pt-8 justify-center text-gray-700'>Edit Course</h1>
            </div>
            <div className="mx-40 p-6 bg-white rounded-xl border">
                {/* EDIT COURSE TITLE */}
                {isCourseTitleEditing ? (
                    <div className="flex items-center mb-2">
                        <input
                            type="text"
                            value={newCourseTitle}
                            onChange={handleCourseTitleChange}
                            className="w-full text-3xl font-bold bg-gray-100"
                        />
                        <button onClick={saveTitle} className="ml-2">
                            <FaSave className="text-2xl" />
                        </button>
                    </div>
                ) : (
                    <div className='flex items-center text-3xl font-bold mb-2'>
                        <h3>{newCourseTitle}</h3>
                        <button onClick={() => setIsCourseTitleEditing(true)} className="ml-2">
                            <FaPencilAlt className="" />
                        </button>
                    </div>
                )}
                {/* EDIT COURSE DESCRIPTION */}
                {isCourseDescEditing ? (
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={newCourseDesc}
                            onChange={handleCourseDescChange}
                            className=" w-full bg-gray-100"
                        />
                        <button onClick={saveDesc} className="ml-2">
                            <FaSave className="" />
                        </button>
                    </div>
                ) : (
                    <div className='flex items-center text-gray-600'>
                        <h3>{newCourseDesc}</h3>
                        <button onClick={() => setIsCourseDescEditing(true)} className="ml-2">
                            <FaPencilAlt className="" />
                        </button>
                    </div>
                )}

                {course.sections.map((section, sectionIndex) => (
                    <SectionEditor
                        key={sectionIndex}
                        section={section}
                        sectionIndex={sectionIndex}
                        course={course}
                        setCourse={setCourse}
                        deleteSection={deleteSection}
                    />
                ))}
                <button className='mt-4 flex items-center text-gray-700' onClick={handleAddSection}>
                <FaPlus className="mr-2" /> Add Section
                </button>
            </div>
        </div>
    );
};

export default CourseEditor;