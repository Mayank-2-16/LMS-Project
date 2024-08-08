import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import coursespageimage1 from "../assets/coursespageimage1.png"
import Navbar2 from './navbar2';
import { IoIosGrid } from "react-icons/io";
import { CiGrid41 } from "react-icons/ci";
import { FaArrowRight, FaListUl } from "react-icons/fa6";
import { BiBookAlt } from "react-icons/bi";
import { Footer } from './footer';
import { FaSearch } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';

const CourseBuy = () => {

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [courses, setCourses] = useState([]);
    const [userId, setUserId] = useState("")
    const [show, setShow] = useState(false)
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {

                const response = await fetch(`${BASE_URL}/course/all`, {
                    method: 'GET',
                })
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                setShow(true);
                const data = await response.json();
                setCourses(data);
                console.log(courses);
                // }
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, [BASE_URL, navigate]);

    useEffect(() => {
        const setId = async () => {
            try {
                const allCookies = document.cookie;
            } catch (error) {
                console.log(error)
            }
        };
        show && setId();
    }, [show])

    const handleClick = async (courseId) => {
        try {
            const response = await fetch(`${BASE_URL}/course/buy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, courseId }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (response.status === 200) {
                alert('Course purchased successfully!');
            } else {
                alert('Failed to purchase course');
            }
        } catch (error) {
            console.error('Error purchasing course:', error);
            alert('Error purchasing course');
        }
    }

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredCourses = courses.filter((course) =>
        course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [toggleState, setToggleState] = useState('grid');
    const [animate, setAnimate] = useState(false)

    const CourseCard = ({ course }) => (
        <div className="bg-white text-black rounded-xl shadow-md">
            {toggleState === 'list' ?
                <div className='flex'>
                    <img src={course.imageUrl} className="min-h-80 min-w-96 object-cover bg-rose-300 rounded-l-xl" />
                    <div className='ml-10 m-8 mt-6 w-full'>
                        <div className='text-gray-500 flex items-center w-full '>
                            <BiBookAlt className="text-xl mr-1" />
                            <span className="font-semibold">{course.totalCourseVideos} {course.totalCourseVideos > 1 ? 'Lessons' : "Lesson"}</span>
                        </div>
                        <h3 className="text-3xl font-semibold mt-2">{course.courseTitle}</h3>
                        <p className='mt-5 text-lg'>{course.courseDescription?.length > 170 ? course.courseDescription.slice(0, 170) + '...' : course.courseDescription}</p>
                        <p className="text-gray-500 mt-3 font-semibold">By {course.teacherName ? course.teacherName : 'Mayank Arora'}</p>
                        <hr className='bg-gray-100 mt-4' />
                        <div className='flex justify-between items-center mt-4'>
                            <span className='text-orange-500'>Rs. {course.price ? course.price : '799'}</span>
                            <div className='flex justify-end border-b-2 hover:border-black border-white hover:delay-50 hover:duration-300 pb-1'>
                                <Link to={`/coursedetails/${course.courseId}`} className={`flex justify-end items-center`}>
                                    Know Details
                                    <span className='ml-1'><FaArrowRight /></span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className=''>

                    <img src={course.imageUrl} className={`h-52 object-cover bg-rose-300 rounded-t-xl mb-4 ${toggleState === 'list' ? 'w-1/2' : 'w-full'}`} />
                    <div className='px-8 pt-3 pb-10'>
                        <div className='text-gray-500 flex items-center'>
                            <BiBookAlt className="text-xl mr-1" />
                            <span className="font-semibold">{course.totalCourseVideos} {course.totalCourseVideos > 1 ? 'Lessons' : "Lesson"}</span>
                        </div>
                        <h3 className="text-xl font-semibold mt-2">{course.courseTitle}</h3>
                        <p className="text-gray-600 font-medium mt-4">By {course.teacherName ? course.teacherName : 'Mayank Arora'}</p>
                        <hr className='bg-gray-100 mt-8' />
                        <div className='flex justify-between items-center mt-4'>
                            <span className='text-gray-600'>Rs. {course.price ? course.price : '599'}</span>
                            <div className='border-b-2 hover:border-black border-white hover:delay-50 hover:duration-300'>
                                <Link to={`/coursedetails/${course.courseId}`} className={`flex items-center`}>
                                    Know Details
                                    <span className='ml-1'><FaArrowRight /></span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );

    return (
        <div>
            {show && (<div className="container bg-slate-100">
                <Navbar2 />
                <div className='relative'>
                    <img src={coursespageimage1} className='h-96 bg-cover bg-center object-cover' alt="" />
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex flex-col justify-center items-center">
                        <h1 className="text-5xl font-bold text-white mb-4">Courses</h1>
                        <p className="text-white text-xl">Home • Courses</p>
                    </div>
                </div>
                <div className="min-h-screen text-black p-10 ml-16 mr-16 pb-20">
                    <div className="flex items-center justify-between mb-6 bg-gray-300 p-3 rounded-xl">

                        <div className="flex space-x-2 ">
                            <button
                                onClick={() => setToggleState('grid')}
                                className={`px-4 py-2 rounded text-2xl ${toggleState === 'grid' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'}`}
                            >
                                {/* Grid */}
                                <CiGrid41 />
                            </button>
                            <button
                                onClick={() => setToggleState('list')}
                                className={`px-4 py-2 text-xl rounded ${toggleState === 'list' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'}`}
                            >
                                <FaListUl />
                            </button>
                        </div>
                        <div>
                            <span className="text-gray-400 ml-24">Showing 1 - {courses.length} of {courses.length}</span>
                        </div>
                        <div className='flex items-center'>
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="px-4 py-2 border border-gray-300 text-black rounded-md outline-none"
                            />
                        </div>
                    </div>
                    <div className={`grid ${toggleState === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-8`}>
                        {filteredCourses.map((course) => (
                            <CourseCard key={course.courseId} course={course} />
                        ))}
                    </div>
                </div>

                <Footer />
            </div>)}
        </div>
    )
}

export default CourseBuy
