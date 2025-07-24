import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [playQueue, setPlayQueue] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Failed to parse user data, logging out.", error);
        logout();
      }
    }
  }, []);

  const login = (accessToken, refreshToken, userData) => {
    localStorage.setItem("access_token", accessToken);
    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    }
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
    setIsLoggedIn(true);
    navigate("/");
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        await api.post("/api/auth/logout/", { refresh: refreshToken });
      }
    } catch (e) {
      console.error("Logout failed on server.", e);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      setIsLoggedIn(false);
      setUser(null);
      setNowPlaying(null);
      setPlayQueue([]);
      setCurrentTrackIndex(-1);
      navigate("/");
    }
  };

  const selectSong = (videoId) => {
    // Play a single song and clear the queue
    setNowPlaying(videoId);
    setPlayQueue([]);
    setCurrentTrackIndex(-1);
  };

  const playPlaylist = (items, startIndex = 0) => {
    // Set the queue to the video IDs from the playlist items
    const videoIds = items.map((item) => item.song.video_id);
    setPlayQueue(videoIds);
    setCurrentTrackIndex(startIndex);
    setNowPlaying(videoIds[startIndex]);
  };

  const playNext = () => {
    // If there's a queue and we're not at the end, play the next track
    if (playQueue.length > 0 && currentTrackIndex < playQueue.length - 1) {
      const nextIndex = currentTrackIndex + 1;
      setCurrentTrackIndex(nextIndex);
      setNowPlaying(playQueue[nextIndex]);
    } else {
      // Otherwise, clear the player
      setNowPlaying(null);
      setPlayQueue([]);
      setCurrentTrackIndex(-1);
    }
  };

  const shufflePlaylist = (items) => {
    // Create a copy of the items array to avoid changing the original order
    const shuffledItems = [...items];

    // Fisher-Yates shuffle algorithm for a truly random order
    for (let i = shuffledItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledItems[i], shuffledItems[j]] = [
        shuffledItems[j],
        shuffledItems[i],
      ];
    }

    // Start playing the shuffled playlist from the first song
    playPlaylist(shuffledItems, 0);
  };

  const value = {
    isLoggedIn,
    user,
    nowPlaying,
    login,
    logout,
    selectSong,
    playPlaylist,
    playNext,
    shufflePlaylist,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
