import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TwoFactorSetup = () => {
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSecret = async () => {
      try {
        const response = await axios.post('http://localhost:3000/2fa/setup', {}, { withCredentials: true });
        setQrCode(response.data.qrCode);
        setSecret(response.data.secret);
      } catch (err) {
        console.error('Failed to fetch 2FA secret', err);
        setError('Failed to fetch 2FA secret');
      }
    };

    fetchSecret();
  }, []);

  const handleVerify = async () => {
    try {
      const response = await axios.post('http://localhost:3000/2fa/verify', {
        token,
      }, { withCredentials: true });
      if (response.data.success) {
        setVerified(true);
        navigate('/user'); // Redirect to the user page after successful verification
      } else {
        setError('Verification failed');
      }
    } catch (err) {
      console.error('Failed to verify 2FA token', err);
      setError('Failed to verify 2FA token');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-white text-black p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Setup 2FA</h2>
        {qrCode && (
          <div className="mb-4 text-center">
            <img src={qrCode} alt="QR Code" />
          </div>
        )}
        <div className="mb-4">
          <label className="block">2FA Token</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>
        <button
          onClick={handleVerify}
          className="w-full bg-black text-white p-2 rounded mt-4"
        >
          Verify
        </button>
        {verified && <div className="mt-4 text-green-500">2FA Setup Complete</div>}
        {error && <div className="mt-4 text-red-500">{error}</div>}
      </div>
    </div>
  );
};

export default TwoFactorSetup;