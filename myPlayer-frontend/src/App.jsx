import { Routes, Route, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import "./App.css";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import GoogleCallbackPage from "./pages/GoogleCallBackPage";
import PlaylistsPage from "./pages/PlaylistsPage";
import PlaylistDetailPage from "./pages/PlaylistDetailPage";
import HistoryPage from "./pages/HistoryPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import Player from "./components/Player";
import NavbarSearch from "./components/NavbarSearch";

function App() {
  const { isLoggedIn, logout, user, nowPlaying } = useAuth();

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-content">
          <div className="nav-left">
            <div className="nav-links">
              <Link to="/">Home</Link>
              {isLoggedIn ? (
                <>
                  <Link to="/recommendations">Discover</Link>
                  <Link to="/playlists">My Playlists</Link>
                  <Link to="/history">History</Link>
                </>
              ) : (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/register">Sign Up</Link>
                </>
              )}
            </div>
          </div>
          
          {isLoggedIn && (
            <div className="nav-center">
              <NavbarSearch />
            </div>
          )}
          
          {isLoggedIn && (
            <div className="nav-right">
              <div className="nav-user-info">
                <span>{user?.first_name}'s Jukebox</span>
                <button onClick={logout} className="logout-button">
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/auth/google/callback"
            element={<GoogleCallbackPage />}
          />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/playlists" element={<PlaylistsPage />} />
          <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </main>
      {nowPlaying && <Player videoId={nowPlaying} />}
    </div>
  );
}

export default App;