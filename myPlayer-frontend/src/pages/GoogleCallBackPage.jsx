import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const GoogleCallbackPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    // State to handle errors and provide feedback to the user
    const [error, setError] = useState(null);

    // This ref ensures the effect runs only once, even in React's Strict Mode
    const effectRan = useRef(false);

    useEffect(() => {
        // We only want this effect to run once on component mount.
        // In StrictMode, components render twice to detect side effects.
        if (effectRan.current === true) {
            return;
        }

        const handleGoogleCallback = async () => {
            // Extract the authorization code from the URL query parameters
            const code = new URLSearchParams(window.location.search).get('code');

            if (!code) {
                setError("Authentication failed: No authorization code found.");
                return;
            }

            try {
                const payload = { code };
                // Exchange the authorization code for access and refresh tokens from backend
                const response = await api.post('/api/auth/google/', payload);
                
                const { access, refresh } = response.data;

                // Defensive check: ensure the tokens exist before proceeding
                if (!access || !refresh) {
                    throw new Error("Login failed: Invalid token response from server.");
                }

                // Use the login function from AuthContext to store tokens and set auth state
                login(access, refresh);

                // Redirect user to the homepage on successful login
                navigate('/');

            } catch (err) {
                console.error("Google login failed!", err);
                const errorMessage = err.response?.data?.detail || err.message || "An unknown error occurred during login.";
                setError(errorMessage);
            }
        };

        handleGoogleCallback();

        // Mark that the effect has run
        return () => {
            effectRan.current = true;
        };
    }, [login, navigate]); // Dependencies for the useEffect hook

    // Render different UI based on the state (loading vs. error)
    if (error) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>Login Failed</h1>
                <p style={{ color: 'red' }}>{error}</p>
                <button onClick={() => navigate('/login')}>Try Again</button>
            </div>
        );
    }

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Finalizing your login...</h1>
            <p>Please wait a moment.</p>
        </div>
    );
};

export default GoogleCallbackPage;