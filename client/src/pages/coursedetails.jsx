import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Footer } from './footer';
import Navbar2 from './navbar2';
import CourseCurriculum from './courseCurriculum';

const learningOutcomes = [
    "You will be able to add UX designer to your CV",
    "Become a UI designer.",
    "All the techniques used by UX professionals",
    "Learn to design websites & mobile phone apps"
]

const requirements = [
    "No prior knowledge is required",
]

const comments = [
    {
        date: "2024-07-12",
        time: "10:15 AM",
        studentName: "Alice Johnson",
        text: "The course content is very detailed and well-structured. I appreciate the step-by-step approach, which makes it easier to follow along."
    },
    {
        date: "2024-07-11",
        time: "02:45 PM",
        studentName: "Bob Smith",
        text: "Great course! The practical examples and assignments really helped me understand the concepts better. Looking forward to more advanced topics."
    },
    {
        date: "2024-07-10",
        time: "08:30 AM",
        studentName: "Carol Martinez",
        text: "I found some of the lectures a bit fast-paced, but the additional resources provided were very helpful. Overall, a very informative course."
    }
];


const CoursePage = () => {
    const { id } = useParams();
    const [relatedCourses, setRelatedCourses] = useState(null);
    const [course, setCourse] = useState(null);
    const [alreadyBought, setAlreadyBought] = useState(false);
    const [userId, setUserId] = useState(null);
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();
    const teacherbio = "Experienced ReactJS, ExpressJS, and MongoDB instructor with a passion for web development. Specializes in creating dynamic, full-stack applications, and simplifying complex concepts for students. Committed to hands-on learning and real-world projects, fostering a practical understanding of modern web technologies and development best practices.";

    const { user_id } = useParams();
    useEffect(() => {
        const fetchRelatedCourses = async () => {
            try {
                const response = await fetch(`${BASE_URL}/course/related/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log("Fetched related courses:", data);
                setRelatedCourses(data);
                const allCookies = document.cookie;
                if (allCookies && allCookies.split(";")) {
                    const allTokens = allCookies.split(";");
                    const token = allTokens.find(cookie => (cookie.trim().startsWith("token=")) ? cookie : null);
                    if (token) {
                        const user_id = JSON.parse(atob(token.split('.')[1]))._id;
                        setUserId(user_id);
                        console.log(userId);
                    } else {
                        console.log("No Token found")
                    }
                } else {
                    console.log("No Token found")
                }
            } catch (error) {
                console.log("Error while fetching related courses", error);
            }
        }

        fetchRelatedCourses();
    }, [id, BASE_URL, userId]);

    useEffect(() => {

        const fetchCourse = async () => {
            try {
                const response = await fetch(`${BASE_URL}/course/get/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log("Fetched data:", data);
                setCourse(data);

                const myCourses = await fetch(`${BASE_URL}/course/my-courses`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                })
                const myCoursesData = await myCourses.json();
                const myCoursesId = myCoursesData.courseDetails.map(course => course._id);
                if (myCoursesId.includes(id)) {
                    setAlreadyBought(true);
                }
                console.log("alreadyBought", alreadyBought)
            } catch (error) {
                console.error('Error fetching course details:', error);
            }
        };

        fetchCourse();
    }, [id, BASE_URL, alreadyBought]);  

    if (!course) {
        return <div>Loading...</div>;
    }

    const handleClick = async (courseId) => {
        try {
            // setUserId(user_id);


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

    return (
        <div className="bg-white text-black">
            <Navbar2 />
            <div className="container py-8 px-40">
                {/* Course Video Section */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center mb-8">
                    <div className="flex-1">
                        <span className="bg-orange-400 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4 inline-block">
                            Development
                        </span>
                        <h1 className="text-6xl lg:text-5xl font-bold mb-4">{course.courseTitle}</h1>
                        <div className="flex items-center text-gray-600 text-sm mb-4">
                            <span className="mr-2">Teacher: {course.teacherName ? course.teacherName : 'Mayank Arora'}</span>
                            <span className="mr-2">Last Updated: {course.lastUpdate ? course.lastUpdate : '22 July 2024'}</span>
                            {course.review && <span>Review: <span className="text-orange-500">{course.review}⭐</span></span>}
                        </div>
                        <div className='w-[95%] h-full bg-red-300 rounded-lg shadow-md object-fill'>
                            {/* <Play /> */}
                            <video
                                controls
                                controlsList="nodownload"
                                src={course.sections[0].lectures[0].video.videoUrl}
                                className='object-fill w-full h-full'
                                onContextMenu={(e) => e.preventDefault()}
                            ></video>
                        </div>
                    </div>
                    <div className="bg-gray-100 rounded-lg shadow-md ml-8 mt-40">
                        <div className='pt-12 px-12'>
                            <h1 className="text-3xl font-bold mb-4">INR 500</h1>
                            <p className="text-gray-600 mb-2 text-lg">Instructor: {course.teacherName ? course.teacherName : 'Mayank Arora'}</p>
                            <hr className='mb-4' />
                            <p className="text-gray-600 mb-2 text-lg">Lectures: {course.totalCourseVideos}</p>
                            <hr className='mb-4' />
                            <p className="text-gray-600 mb-2 text-lg">Duration: 6 Weeks</p>
                            <hr className='mb-4' />
                            <p className="text-gray-600 mb-2 text-lg">Enrolled: 146 students</p>
                            <hr className='mb-4' />
                            <p className="text-gray-600 mb-6 text-lg">Language: Hinglish</p>
                        </div>
                        {userId && <div className='flex justify-center mr-2'>
                            <button
                                {...(alreadyBought ? { onClick: () => navigate(`/course/${id}/videos`) } : { onClick: () => handleClick(id) })}
                                className="flex bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-md mb-6"
                            >
                                {alreadyBought ? "Go To Course" : "Buy Course"}
                            </button>
                        </div>}
                    </div>
                </div>

                {/* Description Section */}
                <div className="mb-10 w-[69%]">
                    <h2 className="text-3xl font-bold mb-4">Overview</h2>
                    <p className="text-gray-600 text-xl">{course.courseDescription}</p>
                </div>

                {/* Course Outcomes Section */}
                <div className="mb-10 w-[69%]">
                    <h2 className="text-3xl font-bold mb-4">What you'll learn</h2>
                    {learningOutcomes.map((outcome, index) => (
                        <li key={index} className="text-gray-600 text-xl">{outcome}</li>
                    ))}
                </div>

                {/* Course Requirements Section */}
                <div className="mb-10 w-[69%]">
                    <h2 className="text-3xl font-bold mb-4">Requirements</h2>
                    {requirements.map((requirement, index) => (
                        <li key={index} className="text-gray-600 text-xl">{requirement}</li>
                    ))}
                </div>

                {/* Course Curriculum Section */}
                <div className="mb-10">
                    <h2 className="text-3xl font-bold mb-8">Course Curriculum</h2>
                    <CourseCurriculum id={id} />
                </div>

                {/* About Instructor Section */}
                <h2 className="text-3xl  font-bold mb-4">Instructor</h2>
                <div className=' w-[70%] p-5 flex rounded-lg bg-white mb-10 shadow-md'>
                    <img src="" alt="" className='w-40 h-40 rounded-full bg-gray-700' />
                    <div className='ml-12'>
                        {/* <h4 className='text-xl font-bold'>{course.teacherName}</h4> */}
                        <Link
                            to={`/instructor/${course.teacherId}/details`}
                            // onClick={() => navigateToInstructorDetailsPage()}
                            className='text-xl font-bold hover:text-orange-600 duration-300'>{course.teacherName}</Link>
                        <p className='text-gray-600 mt-2 w-[95%]'>{teacherbio}</p>
                    </div>
                </div>
                {/* Comments Section */}
                <h2 className="text-3xl font-bold mb-4">Course Reviews</h2>
                <div className='mb-10'>
                    {comments.map((comment, index) => (
                        <div key={index} className=' p-4 rounded-lg mb-4 shadow-md w-[70%]'>
                            <div className='flex justify-between'>
                                <div>
                                    <h4 className='text-lg font-bold'>{comment.studentName}</h4>
                                    <p className='text-gray-600'>{comment.date} • {comment.time}</p>
                                </div>
                                <div>
                                    <img alt="" className='w-12 h-12 rounded-full bg-gray-700' />
                                </div>
                            </div>
                            <p className='text-gray-600 mt-2 w-[93.76%]'>{comment.text}</p>
                        </div>
                    ))}
                </div>

                {/* Add a Comment */}
                {alreadyBought && <div className='mb-10'>
                    <h2 className="text-3xl font-bold mb-4">Add a Review</h2>
                    <form className='w-[70%]'>
                        <textarea
                            className='w-full h-32 p-4 rounded-lg shadow-md mb-4 outline-none'
                            placeholder='Write your review here...'
                        ></textarea>
                        <button className='bg-orange-500 text-white px-4 py-2 rounded'>Submit</button>
                    </form>
                </div>}

                {/* Related Courses Section */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Related Courses</h2>
                    <div className="flex space-x-12">

                        {relatedCourses && relatedCourses.map((course) => (
                            <div key={course.courseId} className="bg-white p-4 px-6 rounded-lg shadow-md w-[33%] pb-6">
                                <img className="w-full h-52 bg-red-200 object-cover rounded-lg mb-4" alt="" />
                                <h3 className="text-lg font-bold mt-2">{course.courseTitle}</h3>
                                <p className="text-gray-600 mt-1">{course.teacherName ? course.teacherName : "Mayank Arora"}</p>
                                <p className="mt-1 mb-6">
                                    <span className="font-semibold">{course.totalCourseVideos} {course.totalCourseVideos === 1 ? 'Lesson' : 'Lessons'}</span> •{' '}
                                    <span className="font-semibold">{course.rating ? course.rating : "4.6"}⭐ ({course.reviews ? course.review : "35"})</span>
                                </p>
                                <a href={`/coursedetails/${course.courseId}`} className='mt-6 bg-orange-500 text-white px-4 py-2 rounded'>Know Details</a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CoursePage;