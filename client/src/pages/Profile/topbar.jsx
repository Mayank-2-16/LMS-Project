import React, { useEffect, useState } from 'react'
import Navbar2 from '../navbar2';

const TopBar = () => {
    const [user_id, setUserId] = useState("");
    const [user, setUser] = useState();
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
                        // Handle the case where token is not found
                        console.error("Token not found");
                    }
                } else {
                    // Handle the case where no cookies are found
                    console.error("No cookies found");
                }
            } catch (error) {
                console.error("Error fetching user ID:", error);
            }
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            if (user_id) {
                try {
                    const response = await fetch(`${BASE_URL}/user/details/${user_id}`, {
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
                    console.log(data.user);
                    setUser(data.user);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        fetchUser();
    }, [user_id, BASE_URL]);


    return (
        <div>
            <Navbar2 />
            <div className=' px-32 pt-10'>
                <div className='flex flex-col justify-center items-center  bg-white rounded-xl pt-4 pb-6'>
                    <img src="" alt="" className='w-36 h-36 rounded-full bg-red-200' />
                    <h1 className='text-3xl mt-4 font-bold'>{user?.name}</h1>
                </div>

            </div>
        </div>
    )
}

export default TopBar
