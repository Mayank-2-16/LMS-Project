import React, { useEffect, useState } from 'react'
import Navbar2 from '../navbar2'
import { Footer } from '../footer'
import { MdEmail } from "react-icons/md";
import GursharanMaamPic from '../../assets/gursharanmaam.jpg'
import { Link, useParams } from 'react-router-dom';

const TeacherDetails = () => {
    const [courses, setCourses] = useState([]);
    const [userDetails, setUserDetails] = useState([]);
    const { teacher_id } = useParams();

    useEffect(() => {
        const BASE_URL = import.meta.env.VITE_BASE_URL;

        const fetchData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/instructor/instructorAllCourses/${teacher_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCourses(data);
            } catch (error) {
                console.log("Error while fetching data", error);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        const BASE_URL = import.meta.env.VITE_BASE_URL;

        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`${BASE_URL}/instructor/getDetails/${teacher_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setUserDetails(data);
                console.log("userDetails", userDetails);
            } catch (error) {
                console.log("Error while fetching data", error);
            }
        }

        fetchUserDetails();
    }, []);


    return (
        <div>
            <Navbar2 />
            <div className='p-10 flex'>
                <div className='w-[30%] rounded-2xl mb-20 mr-16'>
                    {/* Image and Name */}
                    <div className='border rounded-2xl h-[45%] p-5 '>
                        <img alt="" className='bg-orange-100 rounded-xl w-full h-[65%]' />
                        <h1 className='text-2xl mt-6 font-bold'>{userDetails.name}</h1>
                        <h3 className='mt-1 text-gray-600'>Specializes in creating dynamic, full-stack applications, and simplifying complex concepts for students.</h3>
                    </div>
                    {/* About Me */}
                    <div className='border rounded-2xl  p-5 mt-6'>
                        <h1 className='text-xl mt-2 font-bold'>About Me</h1>
                        <h3 className='mt-1 text-gray-600 mb-4'>{userDetails.bio}</h3>
                        <div className='flex'>
                            <p className="bg-orange-100 rounded-full p-2 px-4 mr-3 text-orange-500 font-semibold">BlockChain</p>
                            <p className="bg-orange-100 rounded-full p-2 px-4 text-orange-500 font-semibold">FrontEnd Developer</p>
                        </div>
                        <div className='flex mt-2'>
                            <p className="bg-orange-100 rounded-full p-2 px-4 mr-3 text-orange-500 font-semibold">Backend Developer</p>
                            <p className="bg-orange-100 rounded-full p-2 px-4 text-orange-500 font-semibold">Figma Designer</p>
                        </div>
                    </div >
                    {/* Contact Info */}
                    <div className='border rounded-2xl  p-5 mt-6'>
                        <h1 className='text-xl mt-2 font-bold'>Contact Info</h1>
                        <h3 className='mt-3 text-gray-400 text-sm'>Email Address</h3>
                        <div className='flex items-center mt-2'>
                            <MdEmail className='text-xl mt-0.5 text-gray-600 mr-1' />
                            <p>{userDetails.email}</p>
                        </div>
                    </div>
                </div>
                <div className='w-[65%] h-screen rounded-2xl mb-20'>
                    {/* Educational Background */}
                    <div className='border rounded-2xl p-5'>
                        <h2 className='text-xl mt-2 font-bold'>Educational Background</h2>
                        <h3 className='text-lg mt-2 font-semibold text-gray-700'>University Name</h3>
                        <p className='text-sm mt-3 text-gray-500'>Bachelor's degree, Bachelor of Architecture and Environments</p>
                        <p className='text-sm mt-2 text-gray-500'>May 2007 - Apr 2011</p>
                    </div>
                    <div className='border rounded-2xl p-5 mt-6'>
                        <h2 className='text-xl mt-2 font-bold'>Courses</h2>
                        <div className=''>
                            {courses?.courseDetails?.map((course, index) => (
                                <div key={index} className='mt-3 w-full'>
                                    <Link to={`/coursedetails/${course.courseId}`} className='text-lg mt-2 font-semibold text-black hover:text-orange-500 duration-300 delay-50'>{course.courseTitle}</Link>
                                    <p className='text-sm mt-3 text-gray-500 w-[90%]'>{course.courseDescription}</p>
                                    <div className='flex justify-between mt-2'>
                                        <p className='text-sm font-semibold text-gray-800'>{course.totalCourseVideos} Lectures</p>
                                        <p className='text-sm font-bold text-gray-800'>Rs. {course.price}</p>
                                    </div>
                                    {(index + 1 < courses.courseDetails.length) && <hr className='mt-4' />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default TeacherDetails
