import React, { useState, useRef, useEffect } from 'react';
import TopBar from './topbar';
import SideBar from './sidebar';
import { IoMdCloudUpload } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Footer } from '../footer';
import { FaTrash } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

const AutoResizeTextarea = ({ value, onChange }) => {
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            rows={3}
            className='w-full p-2 border rounded bg-gray-50 outline-none'
            placeholder='Tell us about yourself'
        />
    );
};

const EditProfile = () => {
    const [user_id, setUserId] = useState("");
    const [user, setUser] = useState();
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();

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
                        navigate("/login");
                        console.error("Token not found");
                    }
                } else {
                    navigate("/login");
                    console.error("No cookies found");
                }
            } catch (error) {
                console.error("Error fetching user ID:", error);
                navigate("/login");
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

    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showPasswords, setShowPasswords] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    const handleNameChange = (e) => {
        setUser({
            ...user,
            name: e.target.value
        });
    };

    const handleEmailChange = (e) => {
        setUser({
            ...user,
            email: e.target.value
        });
    };

    const handlePhoneNumberChange = (event) => {
        const value = event.target.value;
        if (/^\d*$/.test(value) && value.length <= 10) {
            setUser({
                ...user,
                phoneNumber: value
            });
        }
    };

    const handleBioChange = (e) => {
        setUser({
            ...user,
            bio: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords({
            ...passwords,
            [name]: value
        });
        console.log(passwords);
    };

    const toggleShowPassword = (field) => {
        setShowPasswords({
            ...showPasswords,
            [field]: !showPasswords[field]
        });
    };

    const handleSaveChanges = async () => {
        const response = await fetch(`${BASE_URL}/user/updateDetails/${user_id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(user),
        });

        const data = await response.json();
        scrollTo(0, 0);
        alert("Changes saved successfully");
        window.location.reload();
    };

    const handleSavePasswordChange = async () => {
        console.log('Changed passwords:', passwords);
        const { oldPassword, newPassword, confirmPassword } = passwords;

        const response = await fetch(`${BASE_URL}/user/change-password/${user_id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
        });

        console.log(response);
        const data = await response.json();
        if (!response.ok) {
            alert(data.message);
        }
        else alert("Password changed successfully");
    }

    return (
        <div className='bg-gray-100'>
            <TopBar />
            <div className="flex mt-10 px-32">
                <div className="flex flex-col">
                    <div className=" p-4 flex bg-white rounded-xl mb-8 items-center justify-center">
                        <h1 className="text-gray-900 text-xl font-semibold">Edit Profile</h1>
                    </div>
                    <SideBar />
                </div>
                <div className=' w-full  ml-10'>
                    <div className='bg-white rounded-3xl p-10'>
                        <div className='text-2xl font-semibold'>Edit Profile</div>
                        <hr className='my-4' />
                        {/* Profile Photo Section */}
                        <div className='text-lg mt-8 mb-4'>Profile Photo</div>
                        <div className='flex items-center'>
                            <img alt="" className='rounded-full w-24 h-24 bg-slate-100' />
                            <button className='bg-orange-400 rounded-full px-6 py-3 mx-10 hover:bg-orange-500 duration-300 delay-50'>
                                <IoMdCloudUpload className='inline text-2xl mr-2' />
                                Upload Photo
                            </button>
                            <button className='border border-gray-600 hover:bg-red-600 hover:text-white duration-300 delay-50 rounded-full px-6 py-3'>
                                <FaTrash className='inline text-lg mb-1 mr-2' />
                                Delete Photo
                            </button>
                        </div>
                        <hr className='my-8' />
                        {/* Name, Email, Phone Number and Bio Section */}
                        <div>
                            <h2 className='text-xl font-semibold'>Personal Details</h2>
                            <h4 className='text-gray-600 mb-6 mt-1'>Edit your Personal Information</h4>
                            <div className='font-semibold'>Full Name</div>
                            <input
                                type="text"
                                className='border bg-gray-50 outline-none w-full rounded-lg p-2 px-5 mt-3 mb-6'
                                value={user?.name}
                                onChange={handleNameChange}
                            />

                            <div className='font-semibold'>Email</div>
                            <input
                                type="email"
                                className='border bg-gray-50 outline-none w-full rounded-lg p-2 px-5 mt-3 mb-6'
                                value={user?.email}
                                onChange={handleEmailChange}
                            />

                            <div className='font-semibold'>Phone Number</div>
                            <input
                                type="text"
                                className='border bg-gray-50 outline-none w-full rounded-lg p-2 px-5 mt-3 mb-6'
                                value={user?.phoneNumber}
                                placeholder='Add Phone Number (Optional)'
                                onChange={handlePhoneNumberChange}
                            />
                        </div>
                        {/* Bio Section */}
                        <div>
                            <h2 className='font-semibold'>Bio</h2>
                            <h4 className='text-gray-600 text-sm'>Tell us about yourself</h4>
                            <AutoResizeTextarea
                                value={user?.bio}
                                onChange={handleBioChange}
                            />
                        </div>

                        <button
                            className='bg-blue-500 text-white rounded-full px-6 py-3 mt-6 hover:bg-blue-600 duration-300'
                            onClick={handleSaveChanges}
                        >
                            Save Changes
                        </button>
                    </div>

                    {/* Password Change Section */}

                    <div className='bg-white p-10 mt-10 rounded-3xl mb-32'>
                        <h2 className='text-xl font-semibold mb-6'>Change Password</h2>
                        <h4 className='text-gray-600  mt-1'>New password must contain:</h4>
                        <ul className='text-gray-600 mb-6'>
                            <li>At least 8 characters</li>
                            <li>At least 1 lower letter (a-z)</li>
                            <li>At least 1 uppercase letter (A-Z)</li>
                            <li>At least 1 number (0-9)</li>
                            <li>At least 1 special character</li>
                        </ul>
                        <div className='font-semibold'>Old Password</div>
                        <div className='relative mb-6 mt-3'>
                            <input
                                type={showPasswords.oldPassword ? "text" : "password"}
                                name="oldPassword"
                                className='border bg-gray-50 outline-none w-full rounded-lg p-2 px-5'
                                value={passwords.oldPassword}
                                onChange={handlePasswordChange}
                            />
                            <button
                                type="button"
                                className='absolute inset-y-0 right-0 flex items-center px-4'
                                onClick={() => toggleShowPassword('oldPassword')}
                            >
                                {showPasswords.oldPassword ? <FaEye /> : <FaEyeSlash />}
                            </button>
                        </div>

                        <div className='font-semibold'>New Password</div>
                        <div className='relative mb-6 mt-3'>
                            <input
                                type={showPasswords.newPassword ? "text" : "password"}
                                name="newPassword"
                                className='border bg-gray-50 outline-none w-full rounded-lg p-2 px-5'
                                value={passwords.newPassword}
                                onChange={handlePasswordChange}
                            />
                            <button
                                type="button"
                                className='absolute inset-y-0 right-0 flex items-center px-4'
                                onClick={() => toggleShowPassword('newPassword')}
                            >
                                {showPasswords.newPassword ? <FaEye /> : <FaEyeSlash />}
                            </button>
                        </div>

                        <div className='font-semibold'>Re-enter New Password</div>
                        <div className='relative mb-6 mt-3'>
                            <input
                                type={showPasswords.confirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                className='border bg-gray-50 outline-none w-full rounded-lg p-2 px-5'
                                value={passwords.confirmPassword}
                                onChange={handlePasswordChange}
                            />
                            <button
                                type="button"
                                className='absolute inset-y-0 right-0 flex items-center px-4'
                                onClick={() => toggleShowPassword('confirmPassword')}
                            >
                                {showPasswords.confirmPassword ? <FaEye /> : <FaEyeSlash />}
                            </button>
                        </div>
                        <button
                            className='bg-blue-500 text-white rounded-full px-6 py-3 mt-6 hover:bg-blue-600 duration-300'
                            onClick={handleSavePasswordChange}
                        >
                            Change Password
                        </button>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EditProfile;