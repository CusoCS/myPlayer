import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const navigate = useNavigate();

    const handleRegistration = async (e) => {
        e.preventDefault();

        if (password !== password2) {
            alert("Passwords do not match!");
            return;
        }

        const payload = {
            username: email,
            email: email,
            first_name: firstName,
            last_name: lastName,
            password1: password,
            password2: password2,
        };

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/registration/`, payload);
            
            alert("Registration successful! Please log in.");
            navigate('/login');

        } catch (error) {
            console.error("Registration failed!", error.response.data);
            alert("Registration failed. This email may already be in use.");
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleRegistration}>
                <div>
                    <label>First Name:</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div>
                    <label>Last Name:</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} required />
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default RegisterPage;