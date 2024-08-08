import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const Navbar = () => {
    // State to manage the navbar's visibility
    const [nav, setNav] = useState(false);

    // Toggle function to handle the navbar's display
    const handleNav = () => {
        setNav(!nav);
    };

    // Array containing navigation items
    const navItems = [
        { id: 1, text: 'Home', link: "/" },
        { id: 2, text: 'About', link: "/about" },
        { id: 3, text: 'Contact', link: "/contact" },
        { id: 4, text: 'Login', link: "/login" },
        { id: 5, text: 'Register', link: "/register" },
    ];

    return (
        <div className='bg-homepagebgcolor flex justify-between items-center h-18 mx-auto min-h-16 px-4 text-white'>
            {/* Logo */}
            <img
                className="h-12 ml-5 size-10"
                src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                alt="Educatsy"
            />

            {/* Desktop Navigation */}
            <ul className='hidden md:flex'>
                {navItems.map(item => (
                    <Link to={item.link}
                        key={item.id}
                        className='p-4 hover:text-orange-500 relative after:bg-white after:absolute after:h-[3%] after:w-0 after:bottom-3 after:left-[15%] hover:after:w-3/4 after:transition-all after:duration-300 rounded-xl m-2 cursor-pointer duration-300'
                    >
                        {item.text}
                        {/* <Link to="/login" /> */}
                    </Link>
                ))}
            </ul>

            {/* Mobile Navigation Icon */}
            <div onClick={handleNav} className='block md:hidden'>
                {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
            </div>

            {/* Mobile Navigation Menu */}
            <ul
                className={
                    nav
                        ? 'fixed md:hidden left-0 top-0 w-[30%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500'
                        : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]'
                }
            >
                {/* Mobile Logo */}
                <img
                    className="h-12 ml-20 size-10"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                    alt="Educatsy"
                />

                {/* Mobile Navigation Items */}
                {navItems.map(item => (
                    <li
                        key={item.id}
                        className='p-4 border-b rounded-xl duration-300 hover:text-orange-500 cursor-pointer border-gray-600'
                    >
                        <Link to="/login"
                        >
                            {item.text}
                            {/* <Link to="/login" /> */}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Navbar;
