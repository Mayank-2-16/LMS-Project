import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

const Logout =  () => {
    const [message, setMessage] = useState("")
    const navigate = useNavigate()
    console.log("logout.jsx")
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    
    const handleLogout = async () => {
        // e.preventDefault();
        console.log("logout.jsx2")
        try {
          const res = await fetch(`${BASE_URL}/logout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message }),
            credentials: "include",
          });
          console.log("logout.jsx3");
          await window.cookieStore.delete('token')
          console.log("logout.jsx4");
          navigate("/");
          console.log("logout.jsx5");
        } catch (error) {
          console.log("Error during logout");
          console.log(error);
        }
    };

    handleLogout();
    return (
        <div>
        </div>
  )
}

export default Logout