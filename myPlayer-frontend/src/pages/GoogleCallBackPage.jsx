import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 1. Accept setIsLoggedIn as a prop
const GoogleCallbackPage = ({ setIsLoggedIn }) => { 
    const navigate = useNavigate();
    const effectRan = useRef(false);

    useEffect(() => {
        if (effectRan.current === false) {
            const handleGoogleCallback = async () => {
                const code = new URLSearchParams(window.location.search).get('code');
                if (code) {
                    try {
                        const payload = { code: code };
                        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/google/`, payload);
                        
                        localStorage.setItem('access_token', response.data.access_token);
                        localStorage.setItem('refresh_token', response.data.refresh_token);
                        
                        // 2. Update the state in the App component immediately
                        setIsLoggedIn(true); 
                        
                        navigate('/'); 
                        
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
    }, [setIsLoggedIn, navigate]); // Add setIsLoggedIn and navigate to the dependency array

    return <div>Loading...</div>;
};

export default GoogleCallbackPage;