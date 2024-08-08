import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OTP = ({ length = 6, onOtpSubmit = () => { }, receivedEmail = "" }) => {
    const [message, setMessage] = useState('');
    const [otp, setOtp] = useState(new Array(length).fill(''));
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const temp = otp.join('');
            const otpNew = Number(temp);

            const res = await fetch(`${BASE_URL}/register/otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: receivedEmail, otp: otpNew }),
            });

            const data = await res.json();

            if (data === 'success') {
                setMessage('OTP verified successfully');
                navigate('/login');
            } else if (data === 'User Exists') {
                alert('User already exists');
            } else {
                setMessage(data.error || 'Failed to verify OTP');
            }
        } catch (error) {
            setMessage('An error occurred');
        }
    };

    const inputRefs = useRef([]);

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index, e) => {
        const value = e.target.value;
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        const combinedOtp = newOtp.join('');
        if (combinedOtp.length === length) onOtpSubmit(combinedOtp);

        if (value && index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleClick = (index) => {
        inputRefs.current[index].setSelectionRange(1, 1);

        if (index > 0 && !otp[index - 1]) {
            inputRefs.current[otp.indexOf('')].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1].focus();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <h2 className="text-2xl font-extrabold text-center text-gray-900">Enter OTP</h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="flex justify-center space-x-2">
                        {otp.map((value, index) => (
                            <input
                                key={index}
                                type="text"
                                ref={(input) => (inputRefs.current[index] = input)}
                                value={value}
                                onChange={(e) => handleChange(index, e)}
                                onClick={() => handleClick(index)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-14 h-12 text-2xl text-center border-2 border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                maxLength="1"
                            />
                        ))}
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-4 text-lg font-bold text-white bg-black rounded-lg hover:bg-gray-500 hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Submit OTP
                    </button>
                </form>
                {message && <p className="mt-2 text-center text-sm text-red-600">{message}</p>}
            </div>
        </div>
    );
};

export default OTP;