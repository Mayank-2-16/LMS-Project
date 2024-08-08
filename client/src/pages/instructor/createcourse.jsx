import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftNavbar from './leftnavbar';

const AutoResizeTextarea = ({ value, onChange }) => {
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            rows={4}
            className='border border-gray-300 rounded-md w-full md:w-1/2 mb-2 p-2'
            placeholder='Eg. Comprehensive course basics to advanced concepts with practical examples.'
        />
    );
};

const CreateCourse = () => {
    const navigate = useNavigate();
    const [desc, setDesc] = useState('');
    const [title, setTitle] = useState('');
    const [goals, setGoals] = useState(false);
    const [courseOutcomes, setCourseOutcomes] = useState({
        courseoutcome1: '',
        courseoutcome2: '',
        courseoutcome3: '',
        courseoutcome4: '',
    });
    const [prerequisites, setPrerequisites] = useState('')
    const [course_id, setCourse_id] = useState('');

    const handlePageChange = () => {
        setGoals(true);
    }

    const handlenext = (e) => {
        e.preventDefault();
        const BASE_URL = import.meta.env.VITE_BASE_URL;
        console.log('title', title);
        console.log('desc', desc);
        console.log("courseOutcomes", courseOutcomes)
        const fetchData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/course/create`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ title, desc, courseOutcomes, prerequisites }), // Use in POST
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log("Fetched data:", data);
                setCourse_id(data)
            } catch (error) {
                console.log("Error while fetching data", error);
            }
        }

        fetchData();
    };

    useEffect(() => {
        if (course_id) {
            navigate(`/instructor/course/${course_id}/manage/curriculum`);
        }
    }, [course_id, navigate]);


    const handleDescChange = (e) => {
        setDesc(e.target.value);
        console.log(e.target.value);
    };

    const handleCourseOutcomesChange = (e) => {
        const { name, value } = e.target;
        setCourseOutcomes(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className="flex">
            {/* <LeftNavbar /> */}
            {!goals ? <div className="p-8 md:p-24 bg-gray-50 min-h-screen w-full">
                <h1 className="text-4xl md:text-5xl mb-6 md:mb-10 font-bold text-gray-800">Create a Course</h1>

                <div className="mb-10">
                    <h2 className="text-2xl mb-2 text-gray-700">Write Your Course Title</h2>
                    <p className="mb-4 text-sm text-gray-600">It's ok if you can't think of a good title now. You can change it later.</p>
                    <input
                        className="border border-gray-300 rounded-md w-full md:w-1/2 mb-4 p-2"
                        name="coursename"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        placeholder="Eg. Learn React from Scratch"
                    />
                </div>

                <div className="mb-10">
                    <h2 className="text-2xl mb-2 text-gray-700">Write Your Course Description</h2>
                    <AutoResizeTextarea
                        value={desc}
                        onChange={handleDescChange}
                    />
                    {/* </div> */}
                    <p className="text-xs text-gray-500">Minimum 200 words</p>
                </div>

                <button
                    onClick={handlePageChange}
                    className="bg-blue-500 text-white rounded-md px-6 py-2 mt-4 hover:bg-blue-600 transition-colors duration-300"
                >
                    Next
                </button>
            </div> :
                <div className="p-8 md:p-24 bg-gray-50 min-h-screen w-full">
                    <h1 className="text-4xl md:text-5xl mb-6 md:mb-10 font-bold text-gray-800">Intended Learners</h1>

                    <div className="mb-10">
                        <h2 className="text-2xl mb-2 text-gray-700">Write Your Course Learning Outcomes</h2>
                        <p className="mb-4 text-gray-600">Add at least four learning outcomes</p>
                        {['courseoutcome1', 'courseoutcome2', 'courseoutcome3', 'courseoutcome4'].map((name, index) => (
                            <input
                                key={name}
                                className="border border-gray-300 rounded-md w-full md:w-[49%] mb-4 p-2 mr-2"
                                name={name}
                                value={courseOutcomes[name]}
                                onChange={handleCourseOutcomesChange}
                                type="text"
                                placeholder={`Eg. ${[
                                    'Develop proficiency in problem-solving techniques.',
                                    'Gain understanding of foundational programming concepts.',
                                    'Enhance skills in effective communication strategies.',
                                    'Master basic principles of project management.'
                                ][index]}`}
                            />
                        ))}
                    </div>

                    <div className="mb-10">
                        <h2 className="text-2xl mb-2 text-gray-700">Write Course Prerequisites</h2>
                        <input
                            className="border border-gray-300 rounded-md w-full md:w-[49%] mb-2 p-2"
                            name="coursedesc"
                            type="text"
                            value={prerequisites}
                            onChange={(e) => setPrerequisites(e.target.value)}
                            placeholder="Prerequisites"
                        />
                    </div>

                    <button
                        onClick={handlenext}
                        className="bg-blue-500 text-white rounded-md px-6 py-2 mt-4 hover:bg-blue-600 transition-colors duration-300"
                    >
                        Next
                    </button>
                </div>}
        </div>
    );
};

export default CreateCourse;
