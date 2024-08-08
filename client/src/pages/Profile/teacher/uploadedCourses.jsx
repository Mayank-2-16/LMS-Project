import { FaBookReader } from "react-icons/fa";
import { BiBookReader } from "react-icons/bi";
import React, { useEffect, useState } from 'react'
import TopBar from '../topbar'
import SideBar from '../sidebar'
import { GoVersions } from "react-icons/go";
import { TbAward } from "react-icons/tb";
import { Footer } from '../../footer';
import { Link, useNavigate } from 'react-router-dom';


const UploadedCourses = () => {

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [courses, setCourses] = useState([]);
    const [teacher_id, setTeacherId] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const allCookies = document.cookie;
                if (allCookies) {
                    const allTokens = allCookies.split(";");
                    const token = allTokens.find(cookie => cookie.trim().startsWith("token="));
                    if (token) {
                        const teacher_id = JSON.parse(atob(token.split('.')[1]))._id;
                        setTeacherId(teacher_id);
                    } else {
                        // Handle the case where token is not found
                        // navigate("/login");
                        console.error("Token not found");
                    }
                } else {
                    // Handle the case where no cookies are found
                    // navigate("/login");
                    console.error("No cookies found");
                }
            } catch (error) {
                console.error("Error fetching user ID:", error);
                // navigate("/login");
            }
        };

        fetchUserId();
    }, [navigate]);

    useEffect(() => {

        const fetchUploadedCourses = async () => {
            try {
                const response = await fetch(`${BASE_URL}/instructor/instructorAllCourses/${teacher_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    // credentials: "include",
                    // body: JSON.stringify({ email, password }), // Use in POST
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log("Fetched data:", data);
                setCourses(data);
                // console.log(courses?.courseDetails[0]?.videos[0]?._id)
            } catch (error) {
                console.log("Error while fetching data", error);
            }
        }

        fetchUploadedCourses();
    }, [BASE_URL, teacher_id]);

    return (
        <div className='bg-gray-100'>

            <TopBar />
            <div className="flex mt-10 px-32 mb-32">
                <div className="flex flex-col">
                    <div className=" p-4 flex bg-white rounded-xl mb-8 items-center justify-center">
                        <h1 className="text-gray-900 text-xl font-semibold">Uploaded Courses</h1>
                    </div>
                    <SideBar />
                </div>
                <div className='w-[80%]'>
                    <div className='flex justify-between ml-10'>
                        <div className='bg-white rounded-3xl h-32 px-6 py-8 mr-10 flex w-[45%] items-center'>
                            <div className='bg-orange-300 p-4 rounded-full'>
                                <GoVersions className='text-3xl' />
                            </div>
                            <div className='ml-4'>
                                <h3 className='text-3xl'>{courses?.courseDetails?.length || 0}</h3>
                                <p className='text-lg mt-1'>{courses?.courseDetails?.length === 1 ? "Total Course" : "Total Courses"}</p>
                            </div>
                        </div>

                        {/* <div className='bg-white rounded-3xl h-32 px-6 py-8 flex w-[45%] items-center '>
                            <div className='bg-orange-300 p-3 rounded-full'>
                                <TbAward className='text-4xl' />
                            </div>
                            <div className='ml-4'>
                                <h3 className='text-3xl'>{courses?.courseDetails?.totalCertifications ? courses?.courseDetails?.totalCertifications : '0'}</h3>
                                <p className='text-lg mt-1'>Total Certifications</p>
                            </div>
                        </div> */}
                    </div>
                    <div className='pt-10'>
                        <h1 className='text-3xl font-bold ml-10'>My Uploaded Courses</h1>

                        <div className='flex flex-wrap w-full ml-4'>
                            {courses?.courseDetails?.map((course, index) => (
                                <div key={index} className='bg-white rounded-3xl p-6 my-4 w-[30%] ml-6'>
                                    <img alt="" className='min-h-48 bg-red-100 w-full rounded-lg mb-2' />
                                    {/* <h3 className='text-xl font-bold'>{course.title}</h3> */}
                                    {/* <BiBookReader /> */}
                                    <Link
                                        to={`/instructor/editCourse/${course.courseId}`}
                                        className='text-lg font-medium hover:text-orange-500 duration-200 delay-50'>
                                        {course.courseTitle}
                                    </Link>
                                    <div className="flex text-gray-600 items-center mt-2">
                                        <FaBookReader />
                                        <p className='text-gray-800 ml-2'>{course.totalCourseVideos} {course?.totalCourseVideos === 1 ? "Lecture" : "Lectures"}</p>
                                    </div>
                                    {/* <p className='text-gray-500 mt-2'>{course.courseDescription}</p> */}
                                    <div className='flex justify-between mt-2'>
                                        {/* <p className='text-gray-800'>{course.totalLectures} Lectures</p> */}
                                        {/* <p className='text-gray-800'>INR {course.price}</p> */}
                                    </div>
                                </div>
                            )
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default UploadedCourses