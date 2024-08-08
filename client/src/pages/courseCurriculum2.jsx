import React, { useEffect, useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IoIosVideocam } from "react-icons/io";
import { CiPlay1 } from "react-icons/ci";

const CourseCurriculum = ({ id, video_id }) => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [curriculum, setCurriculum] = useState([]);
    const [expandedSections, setExpandedSections] = useState({ 0: true });

    useEffect(() => {

        const fetchCourseCurriculum = async () => {
            try {
                console.log(id)
                const response = await fetch(`${BASE_URL}/course/get/${id}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data);
                setCurriculum(data);

            } catch (error) {
                console.error('Error fetching course curriculum:', error);
            }
        };

        fetchCourseCurriculum();
    }, []);

    const toggleSection = (sectionIndex) => {
        setExpandedSections(prevState => ({
            ...prevState,
            [sectionIndex]: !prevState[sectionIndex]
        }));
    };

    return (
        <div className="">

            {curriculum.sections?.map((section, index) => {
                const isExpanded = expandedSections[index];

                return (
                    <div key={index} className="border rounded-lg mb-8 w-full">
                        <div
                            className="bg-gray-100 p-4 flex justify-between items-center cursor-pointer"
                            onClick={() => toggleSection(index)}
                        >
                            <h2 className="text-xl font-semibold">{section.sectionName}</h2>
                            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                        {isExpanded && (
                            <ul className="">
                                {section.lectures.map((lecture, idx) => (
                                    <li key={idx} className="flex justify-between items-center p-4 border">
                                        <div className="flex items-center">
                                            <span className='bg-orange-100 p-2 rounded-full mr-3'><CiPlay1 /></span>
                                            <div
                                                className={`${lecture.video._id === video_id ? 'text-orange-500' : ''} hover:text-orange-500`}
                                            >
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                );
            })}
        </div>
    );


}

export default CourseCurriculum
