import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar2 from './navbar2'
import girlImage from "../assets/01.png"
import girlImage2 from "../assets/homepagegirl02.png"
import bgHomePage from "../assets/bghomepage.jpg"
import Footer3 from './footer3'
import { Footer } from './footer'

const Home = () => {

    const [courses, setCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [changeRegisterToMyCourses, setChangeRegisterToMyCourses] = useState(false);
    const [isTeacher, setIsTeacher] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            try {

                const response = await fetch(`${BASE_URL}/course/all`, {
                    method: 'GET',
                    // headers: {
                    //     'Content-Type': 'application/json',
                    //   },
                    //   body: JSON.stringify({ courses }),
                    // credentials: 'include',
                })
                // if (response.status === 401 || response.status === 403) {
                //     navigate('/login');
                // }
                // else {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // setShow(true);
                // console.log("coursebuy.jsx1")
                const data = await response.json();
                // console.log("data", data);
                // console.log("coursebuy.jsx2")
                // console.log(typeof data)
                // console.log(typeof courses)
                setCourses(data);
                // console.log(courses);
                // console.log("coursebuy.jsx3")
                // }
                const allCookies = document.cookie;
                if (allCookies && allCookies.split(";")) {
                    const allTokens = allCookies.split(";");
                    const token = allTokens.find(cookie => (cookie.trim().startsWith("token=")) ? cookie : null);
                    if (token) {
                        // const user_id = JSON.parse(atob(token.split('.')[1]))._id;
                        setChangeRegisterToMyCourses(true);
                        // setUserId(user_id);
                    }
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, [BASE_URL]);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/course/my-courses`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    // body: JSON.stringify({ email, password }), // Use in POST
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log("My Fetched Courses:", data);
                setMyCourses(data);
                // console.log(courses?.courseDetails[0]?.videos[0]?._id)
            } catch (error) {
                console.log("Error while fetching data", error);
            }
        }

        fetchData();
    }, [BASE_URL]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/user/role`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                if (data === "teacher") setIsTeacher(true);
            } catch (error) {
                console.log("Error while fetching data", error);
            }
        }

        fetchData();
    }, [BASE_URL]);

    return (
        <>
            <div>
                <Navbar2 />

                {/* Main Content */}
                <main className="container mx-auto">
                    <section className="bg-bghomeimage flex md:flex-row flex-col-reverse items-center justify-center md:gap-10 gap-7 md:px-16 px-6 min-h-[65vh]">
                        <div className="md:w-1/2 mt-7 w-1/7 flex items-center justify-center">
                            <img src={girlImage2} className='h-full'></img>
                        </div>
                        <div className="md:w-1/2 w-full space-y-7">
                            <h1 className="md:text-5xl text-6xl font-semibold text-gray-900 ">
                                {/* Find out best */}
                                Welcome to Edu
                                <span className="text-orange-500 font-semibold font-open-sans">
                                    {/* Online Courses */}
                                    Site
                                </span>
                            </h1>
                            <p className="text-xl text-gray-500 font-inter">
                                Your journey to learn and grow starts here.
                                We have a large library of courses taught by highly skilled and
                                qualified faculties at a very affordable cost.
                                Explore our wide range of courses today!
                            </p>

                            <div className="space-x-6 flex">
                                <Link to="/courses">
                                    <button className="bg-orange-400 font-inter font-[500] hover:bg-orange-500 text-gray-950 md:px-5 px-3 md:py-3 py-3 rounded-md  md:text-lg text-base cursor-pointer transition-all ease-in-out duration-300">
                                        Explore courses
                                    </button>
                                </Link>

                                <Link to="/contact">
                                    <button className="border border-orange-500 text-gray-700 px-5 py-3 rounded-md font-semibold md:text-lg text-base cursor-pointer transition-all ease-in-out duration-300 hover:bg-orange-100">
                                        Contact Us
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* My Courses */}
                    {myCourses?.courseDetails && <section className="bg-white pt-10">
                        <h2 className="text-7xl px-16 text-orange-500 font-medium">
                            Continue Learning
                        </h2>
                        <section className="md:py-10 py-7 flex md:flex-row flex-col-reverse items-center justify-center md:gap-10 gap-7 md:px-16 px-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                {myCourses?.courseDetails?.map((course) => (
                                    <div key={course._id} className="course-card bg-white shadow-md rounded-md flex mb-6">
                                        <img className="w-[25%] mr-4 h-36 object-cover rounded-md bg-red-200" />
                                        <div className='w-[70%]'>
                                            <Link to={`/course/${course._id}/videos`} className="text-lg font-bold mb-2 mt-2 hover:text-orange-400 duration-300 delay-75">{course?.title}</Link>
                                            <p className="text-gray-600 mb-3">{course?.description?.length > 147 ? course?.description?.slice(0, 147) + '...' : course?.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </section>}

                    {/* Explore Our Popular Courses */}
                    <section className="bg-equalmix pt-10">
                        <h2 className="text-8xl px-16">
                            Explore our
                        </h2>
                        <h2 className="text-9xl px-16 font-medium text-orange-500 mb-10">
                            Popular Courses
                        </h2>
                        <section className="md:py-10 py-7 mb-10 flex md:flex-row flex-col-reverse items-center justify-center md:gap-10 gap-7 md:px-16 px-6 min-h-[85vh]">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {courses.map((course) => (
                                    <div key={course.courseId} className="course-card mb-10 bg-white shadow-md rounded-md p-6">
                                        <img className="w-full h-60 object-cover rounded-md mb-4 bg-red-200" />
                                        <h3 className="text-xl font-bold mb-2">{course.courseTitle}</h3>
                                        <p className="text-gray-600 mb-4">{course?.courseDescription?.length > 90 ? course?.courseDescription?.slice(0, 95) + '...' : course?.courseDescription}</p>
                                        <Link to={`/coursedetails/${course.courseId}`} className="inline-block px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-md">
                                            Learn More
                                        </Link>
                                    </div>
                                ))}

                            </div>
                        </section>
                    </section>

                    <div className="bg-bghomeimage2 bg-center pb-10">
                        <h1 className="text-3xl font-bold text-center mb-8 pt-24 pb-8 mt-10">Achieve Your Goals With Us</h1>
                        <div className="flex justify-around mb-8 mt-10">
                            <div className="text-center">
                                <p className="text-4xl font-bold">30+</p>
                                <p>Years of Language Education Experience</p>
                            </div>
                            <div className="text-center">
                                <p className="text-4xl font-bold">3084+</p>
                                <p>Learners Enrolled in Edukon Courses</p>
                            </div>
                            <div className="text-center">
                                <p className="text-4xl font-bold">330+</p>
                                <p>Qualified Teachers And Language Experts</p>
                            </div>
                            <div className="text-center">
                                <p className="text-4xl font-bold">2300+</p>
                                <p>Innovative Foreign Language Courses</p>
                            </div>
                        </div>
                        <div className="flex justify-around py-10 items-center">
                            <div className="bg-white py-16 px-6 rounded shadow-md w-1/3 text-center">
                                <h2 className="text-2xl font-bold mb-4">Start Teaching Today</h2>
                                <p className="mb-8">
                                    Seamlessly engage technically sound collaborative reinterpreted goal-oriented content rather than ethica
                                </p>
                                <Link
                                    to={isTeacher? '/profile/uploaded-courses' : '/create/course'}
                                    className="bg-yellow-500 text-white py-2 px-4 rounded">{isTeacher ? 'Continue Teaching' : 'Become An Instructor'}</Link>
                            </div>
                            <div className="bg-white py-16 px-6 rounded shadow-md w-1/3 text-center">
                                <h2 className="text-2xl font-bold mb-4">If You Join Our Course</h2>
                                <p className="mb-8">
                                    Seamlessly engage technically sound collaborative reinterpreted goal-oriented content rather than ethica
                                </p>
                                <Link
                                    to={changeRegisterToMyCourses ? "/profile/dashboard" : "/register"}
                                    className="bg-green-500 text-white py-2 px-4 rounded">{changeRegisterToMyCourses ? 'View My Courses' : 'Register For Free'}</Link>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    )
}

export default Home
