import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './App.css';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GoogleCallbackPage from './pages/GoogleCallBackPage';
import PlaylistsPage from './pages/PlaylistsPage';
import PlaylistDetailPage from './pages/PlaylistDetailPage';
import Player from './components/Player';

function App() {
  const { isLoggedIn, logout, user, nowPlaying } = useAuth();

  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | 
        {isLoggedIn ? (
          <>
            <Link to="/playlists" style={{ margin: '0 10px' }}>My Playlists</Link> |
            <span style={{ margin: '0 10px' }}>{user?.first_name}'s Jukebox</span>
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </>
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
          <Route path="/playlists" element={<PlaylistsPage />} />
          <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
        </Routes>
      </main>
      {nowPlaying && <Player videoId={nowPlaying} />}
    </div>
  );
}

export default App;