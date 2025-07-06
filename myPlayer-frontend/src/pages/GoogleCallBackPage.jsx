import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const GoogleCallbackPage = () => { 
    const { login } = useAuth();
    const navigate = useNavigate();
    const effectRan = useRef(false);

    useEffect(() => {
        if (effectRan.current === false) {
            const handleGoogleCallback = async () => {
                const code = new URLSearchParams(window.location.search).get('code');
                if (code) {
                    try {
                        const payload = { code: code };
                        const response = await api.post('/api/auth/google/', payload);
                        login(response.data.access_token, response.data.refresh_token);
                    } catch (error) {
                        console.error("Google login failed!", error);
                        alert("Google login failed.");
                        navigate('/login');
                    }
                }
            };
            handleGoogleCallback();

            return () => {
                effectRan.current = true;
            };
        }
    }, [login, navigate]);

    return <div>Loading...</div>;
};

export default GoogleCallbackPage;