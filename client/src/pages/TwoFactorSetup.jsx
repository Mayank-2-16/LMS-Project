import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const TwoFactorSetup = ({ token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjcwNjdkYTkzMTYzMTgzYzk1NTZiZTQiLCJlbWFpbCI6InF3ZXJAc2FkZi5jb20iLCJpYXQiOjE3MTg2NDM3MzZ9.Ga2UkVG4PCFuZrnDET95b8K0hTPTnuDYpQLGUK8ibH4" }) => {
  const [qrCode, setQrCode] = useState(null);
  const [secret, setSecret] = useState('');
  const [userToken, setUserToken] = useState('');
  const [verificationResult, setVerificationResult] = useState('');

  const navigate = useNavigate();
  const [message, setMessage] = useState("")
  const [redirectUrl, setRedirectUrl] = useState("")
  const [res, setRes] = useState("")
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  console.log("twoFactorSetup.jsx")

  useEffect(() => {
    const handleAuth = async () => {
      console.log("twoFactorSetup.jsx2")
      try {
        const res = await fetch(`${BASE_URL}/2fa/setup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
          credentials: "include",
        });
        const data = await res.json();
        console.log(data);
        console.log(res.status);
        // setQrCode(data.qrCode);

          if(res.status === 401 || res.status === 403) navigate('/login');
          console.log("twoFactorSetup.jsx3");
      } catch (error) {
        console.log("Error during user Authentication");
        console.log(error);
      }
      
    };
  
    handleAuth();
  })

  const handleVerify = () => {
    fetch('http://localhost:3000/2fa/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ token: userToken })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setVerificationResult('2FA setup successful!');
          setTimeout(() => {
            console.log("dwfe")
            navigate('/user')
            console.log("dfe")
          }, 1000);
        } else {
          setVerificationResult('2FA setup failed. Please try again.');
        }
      });
  };

  return (
      <div>
    <div className="flex items-center justify-between px-6 md:px-[200px] py-4">
      <h1 className="text-lg md:text-xl font-extrabold">
        <Link to="/">Lumens</Link>
      </h1>
      <h3>
        <Link to="/login">Login</Link>
      </h3>
    </div>
    <div className="w-full flex justify-center items-center h-[80vh] ">
      <div className="flex flex-col justify-center items-center space-y-4 w-[80%] md:w-[25%]">
        <h1 className="text-xl font-bold text-center">Two-Factor Authentication Setup</h1>
        {qrCode && <img src={qrCode} alt="QR Code" className="w-full h-auto" />}
        <p className='text-center'>Scan the QR code with your 2FA app <br /> and enter the token below:</p>
        <input
          className="w-full px-4 py-2 border-2 border-black outline-0 text-center"
          type="text"
          value={userToken}
          onChange={(e) => setUserToken(e.target.value)}
          placeholder="Enter your token"
        />
        <button
          onClick={handleVerify}
          className="w-full px-4 py-4 text-lg font-bold text-white bg-black rounded-lg hover:bg-gray-500 hover:text-black"
        >
          Verify
        </button>
        <Link className='text-gray-400' to="/user">Enter without Setting Up 2FA</Link>
        <p className="text-red-500">{verificationResult}</p>
      </div>
    </div>
  </div>

  );
};

export default TwoFactorSetup;