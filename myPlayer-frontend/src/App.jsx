import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Import your page components
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GoogleCallbackPage from './pages/GoogleCallBackPage';

// A simple placeholder for your home page
const HomePage = () => <h2>Home Page - Welcome!</h2>;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // On initial application load, check if a token exists in local storage
  // to keep the user logged in across browser refreshes.
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  /**
   * Handles the complete logout process.
   * 1. Makes an API call to blacklist the refresh token on the server.
   * 2. Clears tokens from local storage and updates the UI state.
   */
  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      // Only make the API call if a refresh token exists
      if (refreshToken) {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout/`, {
          refresh: refreshToken,
        });
      }
    } catch (e) {
      // Log the error but proceed with client-side cleanup
      console.error('Logout failed. Server might be down or token expired.', e);
    } finally {
      // Always clear local storage and update the UI state, even if the API call fails.
      // This ensures the user is logged out from the app's perspective.
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setIsLoggedIn(false);
      navigate('/');
    }
  };

  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | 
        {isLoggedIn ? (
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link> | <Link to="/register">Sign Up</Link>
          </>
        )}
      </nav>
      <hr />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/login" 
            element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} 
          />
          <Route 
            path="/register" 
            element={<RegisterPage />} 
          />
          <Route 
            path="/auth/google/callback" 
            element={<GoogleCallbackPage setIsLoggedIn={setIsLoggedIn} />} 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;