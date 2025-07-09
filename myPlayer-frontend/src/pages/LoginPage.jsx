import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        try {
            const payload = { username: email, email: email, password: password };
            const response = await api.post('/api/auth/login/', payload);
            login(response.data.access, response.data.refresh, response.data.user);
        } catch (error) {
            console.error("Login failed!", error.response?.data);
            alert("Login failed. Please check your credentials.");
        }
    };

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