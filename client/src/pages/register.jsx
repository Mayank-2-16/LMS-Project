import React, { useState, useEffect } from "react";
import { Link, useNavigate, useBlocker } from "react-router-dom";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import OTP from "./otp";
import girlImage from "../assets/01.png"
import axios from "axios";
import registerPageImage from "../assets/registerpageimage.png" 

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [re_password, setRePassword] = useState("");
    // const [rePassword, setRePassword] = useState('');
    const [isTeacher, setIsTeacher] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(false);
    const [twoFA, set2FA] = useState(false);
    const [success, setSuccess] = useState(false); // To handle success state
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [imgClass, setImgClass] = useState("ri-eye-close-fill absolute mr-9 text-xl text-gray-600")
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        const BASE_URL = import.meta.env.VITE_BASE_URL;
        e.preventDefault();
        try {
            // console.log(name);
            // console.log(email);
            // console.log(password);
            // console.log(re_password);
            const res = await fetch(`${BASE_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password, re_password, isTeacher }),
            });

            console.log(res);

            const data = await res.json();
            if (data === "All fields are required") {
                alert("All fields are required");
                return;
            } else if (data === "Name must be between 3 and 20 characters") {
                alert("Name must be between 3 and 20 characters");
                return;
            } else if (data === "Invalid name") {
                alert("Invalid name");
                return;
            } else if (data === "Re-password is Wrong") {
                alert("Re-password is Wrong");
                return;
            }
            console.log("Success:", data);
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }

            setSuccess(true); // Set success state to true on successful registration
            setShowOtpInput(true);
        } catch (error) {
            console.error("Register Error", error);
            setError(true); // Set error state to true if there's an error
        }
    };

    const [type, setType] = useState("password");

    const handleToggle = () => {
        if (type === "password") {
            setImgClass("ri-eye-fill absolute mr-9 text-xl text-gray-600")
            setType("text");
        } else {
            setImgClass("ri-eye-close-fill absolute mr-9 text-xl text-gray-600")
            setType("password");
        }
    };

    const onOtpSubmit = (otp) => {
        // console.log("Registered Successfully", otp);
        // set2FA(true);
    };

    return (
        <>
            {!showOtpInput ? (
                <div className="flex min-h-screen ">
                    
                    <div className="w-1/2 space-y-8 py-20 px-36 bg-white rounded-xl shadow-lg">
                        <div>
                            <h2 className="text-center text-3xl font-extrabold text-gray-900">
                                Create Your Account
                            </h2>
                        </div>
                        <form className="space-y-4" onSubmit={handleRegister}>
                            <div className="rounded-md shadow-sm">
                                {/* Name */}
                                <div className="mb-6">
                                    <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Your Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                {/* Email */}
                                <div className="mb-6">
                                    <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="user@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                {/* Password */}
                                <div className="mb-6">
                                    <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
                                    <div className="flex w-full">
                                        <input
                                            type={type}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="********"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />

                                        <span
                                            className="flex justify-around items-center"
                                            onClick={handleToggle}
                                        >
                                            <i className={imgClass}></i>
                                        </span>
                                    </div>
                                </div>
                                {/* Re-password */}
                                <div className="mb-10">
                                    <label className="block mb-1 text-sm font-medium text-gray-700">Re-Enter Your Password</label>
                                    <div className="flex">
                                        <input
                                            // type={showPassword ? 'text' : 'password'}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="********"
                                            value={re_password}
                                            type={type}
                                            onChange={(e) => setRePassword(e.target.value)}
                                            required
                                        />
                                        <span
                                            className="flex justify-around items-center"
                                            onClick={handleToggle}
                                        >
                                            <i className={imgClass}></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    onClick={handleRegister}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </form>
                        <div className="mt-4 text-center">
                            Already have an account?{' '}
                            <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Sign In
                            </a>
                        </div>
                        
                    </div>
                    <div className="w-1/2 bg-gradient-to-r from-orange-100 to-white flex flex-col justify-center items-center">
                        <div className="max-w-md text-center">
                            <img src={girlImage} alt="Learning" className="mb-4" />
                            <h2 className="text-3xl font-bold mb-4">Learn From World's Best Instructors Around The World.</h2>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="w-full flex justify-center items-center h-[80vh] ">
                        <div className="flex flex-col justify-center items-center space-y-4 w-full md:w-[40%]">
                            <h1 className="text-center text-4xl font-bold">
                                Check Your Inbox
                            </h1>
                            <br />
                            <span className="text-center">
                                <p className="">Enter the 6-digit code we sent to</p>
                                <p className="">
                                    <strong>{email}</strong>
                                </p>
                                <p className="">to finish your registration.</p>
                            </span>
                            <br />
                            <OTP
                                length={6}
                                onOtpSubmit={onOtpSubmit}
                                recievedEmail={email}
                            ></OTP>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Register;