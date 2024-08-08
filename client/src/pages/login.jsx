import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import girlImage from "../assets/01.png"
import loginPageImage from "../assets/loginpageimage.png"

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showLoginPage, setShowLoginPage] = useState(false);
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const allCookies = document.cookie;
                if (allCookies) {
                    const allTokens = allCookies.split(";");
                    const token = allTokens.find(cookie => cookie.trim().startsWith("token="));
                    console.log(token)
                    if (token) navigate('/')
                    else setShowLoginPage(true);
                }
                else setShowLoginPage(true);
            } catch (error) {
                console.error("Error fetching user ID:", error);
            }
        };

        fetchUserId();
    }, [navigate]);

    const handleLogin = async () => {
        try {
            const res = await fetch(`${BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (res.status === 200) {
                navigate('/')
            } else {
                console.log("Login failed", data);
                alert("Login failed");
                setError("Login failed");
            }
        } catch (err) {
            console.log(err);
            setError("Login failed");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin();
    };


    return (
        showLoginPage && (
            <>
                <div className="flex min-h-screen">
                    <div className="w-1/2 bg-loginpagebg flex flex-col justify-center items-center">
                        <div className="max-w-md text-center">
                            <img src={loginPageImage} alt="Welcome" className="mb-4" />
                            <h2 className="text-3xl font-bold mb-4">Welcome to the Courses Website.</h2>
                            <p className="mb-6">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                            </p>
                        </div>
                    </div>

                    <div className=" w-1/2 space-y-8 px-36 py-16 bg-white rounded-xl shadow-lg">
                        <div>
                            <img
                                className="mx-auto h-12 w-auto"
                                src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                                alt="Educatsy"
                            />
                            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                                Welcome to Online Learning Platform
                            </h2>
                        </div>
                        <form className="mt-8 space-y-6">
                            <div className="relative mt-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or sign in with your email</span>
                                </div>
                            </div>
                            <div className="rounded-md shadow-sm -space-y-px">
                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="user@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-4 relative">
                                    <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
                                    <input
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="********"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                >
                                    Sign In
                                </button>
                            </div>
                        </form>
                        <div className="mt-4 text-center">
                            Don’t have an account?{' '}
                            <a href="register" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Sign Up
                            </a>
                        </div>
                    </div>

                </div>
            </>)
    );
};

export default Login;