import React, { useEffect, useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IoIosVideocam } from "react-icons/io";

const CourseCurriculum = ({ id }) => {
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
                // console.log(response)
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
                    <div key={index} className="border rounded-lg mb-8 w-[70%]">
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
                                            <IoIosVideocam className="mr-2 text-lg text-gray-700" />
                                            <span className="font-semibold mr-2 text-gray-800">Video:</span>
                                            <span>{lecture.video.title}</span>
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