import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Create the context
const AuthContext = createContext(null);

// Create the provider component
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null); // State to hold user data
    const navigate = useNavigate();

    useEffect(() => {
        // On initial load, check for token and user data in localStorage
        const token = localStorage.getItem('access_token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            setIsLoggedIn(true);
            setUser(JSON.parse(storedUser)); // Set user state from localStorage
        }
    }, []);

    const login = (accessToken, refreshToken, userData) => {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('user', JSON.stringify(userData)); // Store user data
        
        setIsLoggedIn(true);
        setUser(userData); // Set user state
        navigate('/');
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout/`, {
                    refresh: refreshToken
                });
            }
        } catch (e) {
            console.error('Logout failed.', e);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user'); // Clear user data on logout
            
            setIsLoggedIn(false);
            setUser(null); // Clear user state
            navigate('/');
        }
    };

    const value = {
        isLoggedIn,
        user, // Expose user data through the context
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to easily use the auth context
export const useAuth = () => {
    return useContext(AuthContext);
};