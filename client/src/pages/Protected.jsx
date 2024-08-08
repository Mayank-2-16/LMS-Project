import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Protected = () => {
    const [data, setData] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/protected', { withCredentials: true });
                setData(response.data.message);
            } catch (err) {
                setError('Access denied');
            }
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <div className="bg-white text-black p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Protected Page</h2>
                {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
                <div>{data}</div>
            </div>
        </div>
    );
};

export default Protected