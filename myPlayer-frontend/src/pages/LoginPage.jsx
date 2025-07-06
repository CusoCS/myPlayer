import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        try {
            const payload = { username: email, email: email, password: password };
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login/`, payload);
            
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            window.location.href = '/'; // Redirect to home page on success
        } catch (error) {
            console.error("Login failed!", error.response.data);
            alert("Login failed. Please check your credentials.");
        }
    };

    // --- NEW DYNAMIC URL BUILDER ---
    // This function constructs the Google Login URL with my Client ID
    const buildGoogleLoginUrl = () => {
        const params = new URLSearchParams({
            redirect_uri: "http://localhost:5173/auth/google/callback",
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            access_type: "offline",
            response_type: "code",
            scope: "openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile"
        });
        return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handlePasswordLogin}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Login</button>
            </form>
            <hr />
            <a href={buildGoogleLoginUrl()}>
                <button>Login with Google</button>
            </a>
        </div>
    );
};

export default LoginPage;