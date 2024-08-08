import React, { useEffect, useState } from "react";
// import Play from "./play";
import { useNavigate, useParams } from "react-router-dom";
import Navbar2 from "./navbar2";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { CiPlay1 } from "react-icons/ci";

const CourseVideos = () => {
    const { course_id, video_id } = useParams();
    const navigate = useNavigate();

    const [curriculum, setCurriculum] = useState([]);
    const [expandedSections, setExpandedSections] = useState({ 0: true });
    const [url, setUrl] = useState(null);
    const [currentVideoId, setCurrentVideoId] = useState(null);
    const [showVideo, setShowVideo] = useState(false);
    const [user_id, setUserId] = useState(null);
    const [showContent, setShowContent] = useState(false);
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const allCookies = document.cookie;
                if (allCookies) {
                    const allTokens = allCookies.split(";");
                    const token = allTokens.find(cookie => cookie.trim().startsWith("token="));
                    if (token) {
                        const user_id = JSON.parse(atob(token.split('.')[1]))._id;
                        setUserId(user_id);
                    } else {
                        console.error("Token not found");
                    }
                } else {
                    console.error("No cookies found");
                }
            } catch (error) {
                console.error("Error fetching user ID:", error);
            }
        };

        fetchUserId();
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/user/${user_id}/isCourseBought/${course_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const isBought = await response.json();
                
                console.log("Fetched data:", isBought);

                if(!isBought) {
                    alert("You don't have permission to view this course");
                    navigate("/courses");
                }
                else{
                    setShowContent(true);
                }
            } catch (error) {
                console.log("Error while fetching data", error);
            }
        }

        if(user_id) fetchData();
    }, [user_id, BASE_URL]);

    useEffect(() => {

        const fetchCourseCurriculum = async () => {
            try {
                const id = course_id;
                console.log("course_id", id);
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
                console.log("Data fetched:", data);
                setCurriculum(data);
                console.log(curriculum)
                setUrl(data.sections[0].lectures[0].video.videoUrl);
                setCurrentVideoId(data.sections[0].lectures[0].video._id);
                setCurriculum(data);
                // console.log(data);
                setTimeout(() => {
                    setShowVideo(true);
                }, 1500);

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

    const handleVideoPlay = (video) => {
        setShowVideo(false);
        setUrl(video.videoUrl);
        setCurrentVideoId(video._id);
        setTimeout(() => {
            setShowVideo(true);
        }, 2000);
    }

    return (
        showContent && <div className="">
            <Navbar2 />
            <div className="flex h-full">
                <div className="flex flex-col w-[75%] h-full">
                    <div className="flex bg-videoplaybackcolor items-center justify-center h-148">
                        {<video
                            controls
                            controlsList="nodownload"
                            src={url}
                            className={`${showVideo ? '' : 'hidden'} object-fill h-full w-full`}
                            onContextMenu={(e) => e.preventDefault()}
                        ></video>}
                    </div>
                    <div className=" w-full py-6 px-8">
                        <h1 className="text-3xl font-semibold">{curriculum.courseTitle}</h1>
                        <p className="text-lg mt-1">{curriculum.courseDescription}</p>
                    </div>
                </div>
                <div className=" w-[25%]">
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
                                                    {/* <IoIosVideocam className="mr-2 text-lg text-gray-700" /> */}
                                                    <span className='bg-orange-100 p-2 rounded-full mr-3'><CiPlay1 /></span>
                                                    <div
                                                        className={`${lecture.video._id === currentVideoId ? 'text-orange-500' : ''} hover:text-orange-500 hover:cursor-pointer`}
                                                        onClick={() => handleVideoPlay(lecture.video)}
                                                    >
                                                        {lecture.video.title}
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
            </div>

        </div>
    );
};

export default CourseVideos;