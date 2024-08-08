import React, { useEffect, useState } from 'react';
import Test from './test';
import LeftNavbar from './leftnavbar';
import { redirect, useNavigate, useParams } from 'react-router-dom';



const Curriculum = () => {
    const { course_id } = useParams();
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();
    const [show, setShow] = useState(false)

    useEffect(() => {
        // console.log(course_id)
        const fetchEditDetails = async () => {
            try {
                console.log(course_id);
                const response = await fetch(`${BASE_URL}/instructor/isCoursePresent/${course_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: 'include'
                });
                console.log("Net1")
                console.log(response)
                console.log("Net2")
                console.log(response.status);
                if(response.status === 401) navigate('/login')
                if(response.status === 400) navigate('/profile/dashboard')
                if (response.status === 302) {
                    navigate(`/instructor/editCourse/${course_id}`)
                }
                else setShow(true);
            } catch (error) {
                console.log("Error while fetching related courses", error);
            }
        };

        fetchEditDetails();
    }, []);

    return (
        <div>
            {show && <div className="pr-2">
                <div className="flex">
                    <LeftNavbar />
                    <div className="min-h-1/4 w-2/3 ml-96 p-8">
                        <h1 className="text-4xl md:text-5xl mb-6 md:mb-1 font-bold text-gray-800">Curriculum</h1>
                        <hr />
                        <div className="border border-gray-300 mt-10 p-4 bg-white rounded-md shadow-sm">
                            <Test course_id={course_id} />
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    );
};

export default Curriculum;

