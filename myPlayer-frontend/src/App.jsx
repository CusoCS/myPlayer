import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './App.css';

// Import page components
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GoogleCallbackPage from './pages/GoogleCallBackPage';

const HomePage = () => {
  // Get both isLoggedIn and user from the context
  const { isLoggedIn, user } = useAuth();

  return (
    <div>
      {isLoggedIn ? (
        // If the user is logged in, show the welcome back message
        <h2>Welcome back{user ? `, ${user.first_name}` : ''}!</h2>
      ) : (
        // Otherwise, show the sign-up message
        <h2>GL Jukebox - Sign up now!</h2>
      )}
    </div>
  );
};

function App() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <div>
      <nav>
        <Link to="/">Home</Link> |
        {isLoggedIn ? (
          <button onClick={logout} className="logout-button">
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;