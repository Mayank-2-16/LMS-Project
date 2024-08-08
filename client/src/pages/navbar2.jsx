import React, { useEffect, useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from './chat/avatar';

const Navbar2 = () => {
    // State to manage the navbar's visibility
    const [nav, setNav] = useState(false);
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [username, setUsername] = useState("");
    const [user_id, setUserId] = useState("");
    const navigate = useNavigate();

    // Toggle function to handle the navbar's display
    const handleNav = () => {
        setNav(!nav);
    };

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
            if (user_id) {
                try {
                    const response = await fetch(`${BASE_URL}/user/name/${user_id}`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setUsername(data.name);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        fetchData();
    }, [user_id, BASE_URL]);

    // Array containing navigation items
    const navItems = [
        { id: 1, text: 'Home', link: "/", both: true },
        { id: 2, text: 'About', link: "/about", both: true },
        { id: 3, text: 'Contact', link: "/contact", both: true },
        { id: 4, text: 'Logout', link: "/logout", login: user_id ? true : false },
        { id: 5, text: 'Login', link: "/login", login: user_id ? false : true },
        { id: 6, text: 'Register', link: "/register", login: user_id ? false : true }
    ];

    return (
        <div className='bg-homepagebgcolor flex justify-between items-center h-18 mx-auto px-4 min-h-16 '>
            {/* Logo */}
            <img
                className="h-12 ml-5 size-10"
                src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                alt="Educatsy"
            />

            {/* Desktop Navigation */}
            <ul className='hidden md:flex items-center'>
                {navItems.map(item => (
                    (item.login || item.both) && <Link to={item.link}
                        key={item.id}
                        className='p-4 hover:text-orange-500 text-white relative after:bg-white after:absolute after:h-[3%] after:w-0 after:bottom-3 after:left-[15%] hover:after:w-3/4 after:transition-all after:duration-300 rounded-xl m-2 cursor-pointer duration-300'
                    >
                        {item.text}
                    </Link>
                ))}
                {user_id && <Avatar username={username} userId={user_id} size={"10"} />}
            </ul>

            {/* Mobile Navigation Icon */}
            <div onClick={handleNav} className='block md:hidden'>
                {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
            </div>

            {/* Mobile Navigation Menu */}
            <ul
                className={
                    nav
                        ? 'fixed md:hidden left-0 top-0 w-[30%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500 text-white'
                        : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%] text-white'
                }
            >
                {/* Mobile Logo */}
                <img
                    className="h-12 ml-5 size-10"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                    alt="Educatsy"
                />

                
            </ul>
        </div>
    );
};

export default Navbar2;
