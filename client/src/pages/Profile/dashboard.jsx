import React, { useEffect, useState } from 'react'
import TopBar from './topbar'
import SideBar from './sidebar'
import { GoVersions } from "react-icons/go";
import { TbAward } from "react-icons/tb";
import { Footer } from '../footer';
import { Link, useNavigate } from 'react-router-dom';

const student = {
    totalCourses: 5,
    totalCertifications: 2,
}

const Dashboard = () => {

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/course/my-courses`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });
                if(response.status === 401) navigate('/login')
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
    }, [BASE_URL]);

    return (
        <div className='bg-gray-100'>

            <TopBar />
            <div className="flex mt-10 px-32 mb-32">
                <div className="flex flex-col">
                    <div className=" p-4 flex bg-white rounded-xl mb-8 items-center justify-center">
                        <h1 className="text-gray-900 text-xl font-semibold">Dashboard</h1>
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

                        <div className='bg-white rounded-3xl h-32 px-6 py-8 flex w-[45%] items-center '>
                            <div className='bg-orange-300 p-3 rounded-full'>
                                <TbAward className='text-4xl' />
                            </div>
                            <div className='ml-4'>
                                <h3 className='text-3xl'>{courses?.courseDetails?.totalCertifications ? courses?.courseDetails?.totalCertifications: '0'}</h3>
                                <p className='text-lg mt-1'>Total Certifications</p>
                            </div>
                        </div>
                    </div>
                    <div className='pt-10'>
                        <h1 className='text-3xl font-bold ml-10'>My Courses</h1>
                            
                        <div className='flex flex-wrap w-full ml-4'>
                        {courses?.courseDetails?.map((course, index) => (
                                <div key={index} className='bg-white rounded-3xl p-6 my-4 w-[47%] ml-6'>
                                    <img alt="" className='min-h-56 bg-red-100 w-full rounded-lg mb-2' />
                                    <Link 
                                    to={`/course/${course._id}/videos/`}
                                    className='text-xl font-bold hover:text-orange-500 duration-200 delay-50'>{course.title}</Link>
                                    <p className='text-gray-500 mt-2'>{course.description}</p>
                                    <div className='flex justify-between mt-2'>
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

export default Dashboard