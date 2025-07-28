import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // Use your configured axios instance for logout

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [nowPlaying, setNowPlaying] = useState(null); // Will hold only the videoId
  const [playQueue, setPlayQueue] = useState([]); // Will hold full song objects
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const navigate = useNavigate();

  /**
   * On initial app load, check localStorage for existing session data.
   */
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

  /**
   * ✨ NEW: This hook watches for changes to the currently playing song
   * and logs it to the user's history.
   */
  useEffect(() => {
    if (nowPlaying && currentTrackIndex > -1 && playQueue[currentTrackIndex]) {
      const currentSong = playQueue[currentTrackIndex];
      // Send the full song object to the history endpoint
      api
        .post("/api/history/log/", currentSong)
        .catch((e) => console.error("Failed to log play to history:", e));
    }
  }, [nowPlaying]); // This effect runs every time 'nowPlaying' changes

  /**
   * Handles user login, storing tokens and user data.
   */
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

  /**
   * Handles user logout, clearing local storage and server-side tokens.
   */
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        await api.post("/api/auth/logout/", { refresh: refreshToken });
      }
    } catch (e) {
      console.error("Logout failed on server.", e);
    } finally {
      localStorage.clear();
      setIsLoggedIn(false);
      setUser(null);
      setNowPlaying(null);
      setPlayQueue([]);
      setCurrentTrackIndex(-1);
      setIsPlaying(false);
      setShowQueue(false);
      navigate("/");
    }
  };

  /**
   * Plays a single song and sets the queue to only that song.
   */
  const selectSong = (song) => {
    setPlayQueue([song]); // The queue is now an array with one full song object
    setCurrentTrackIndex(0);
    setNowPlaying(song.video_id);
    setIsPlaying(true);
  };

  /**
   * Plays a list of songs from a specific starting point.
   */
  const playPlaylist = (items, startIndex = 0) => {
    const songs = items.map((item) => item.song);
    setPlayQueue(songs);
    setCurrentTrackIndex(startIndex);
    setNowPlaying(songs[startIndex].video_id);
    setIsPlaying(true);
  };

  /**
   * Plays the next song in the current queue.
   */
  const playNext = () => {
    if (playQueue.length > 0 && currentTrackIndex < playQueue.length - 1) {
      const nextIndex = currentTrackIndex + 1;
      setCurrentTrackIndex(nextIndex);
      setNowPlaying(playQueue[nextIndex].video_id);
    } else {
      setNowPlaying(null);
      setPlayQueue([]);
      setCurrentTrackIndex(-1);
      setIsPlaying(false);
    }
  };

  /**
   * Plays the previous song in the current queue.
   */
  const playPrevious = () => {
    if (playQueue.length > 0 && currentTrackIndex > 0) {
      const prevIndex = currentTrackIndex - 1;
      setCurrentTrackIndex(prevIndex);
      setNowPlaying(playQueue[prevIndex].video_id);
    }
  };

  /**
   * Toggles play/pause state.
   */
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  /**
   * Toggles the queue visibility.
   */
  const toggleQueue = () => {
    setShowQueue(!showQueue);
  };

  /**
   * Shuffles a playlist and starts playing it.
   */
  const shufflePlaylist = (items) => {
    const songs = items.map((item) => item.song);
    const shuffledSongs = [...songs];
    for (let i = shuffledSongs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledSongs[i], shuffledSongs[j]] = [
        shuffledSongs[j],
        shuffledSongs[i],
      ];
    }
    // Re-create a structure that playPlaylist expects
    const shuffledItems = shuffledSongs.map((song) => ({ song }));
    playPlaylist(shuffledItems, 0);
  };

    /**
     * ✨ NEW: Adds a song to the play queue immediately after the current song.
     * @param {object} song - The full song object to add.
     */
    const addToQueue = (song) => {
        // If nothing is playing, just start playing the song
        if (currentTrackIndex === -1) {
            selectSong(song);
            return;
        }

        // Create a new queue by inserting the song after the current one
        const newQueue = [
            ...playQueue.slice(0, currentTrackIndex + 1),
            song,
            ...playQueue.slice(currentTrackIndex + 1),
        ];
        
        setPlayQueue(newQueue);
        alert(`"${song.title}" added to queue!`);
    };

    /**
     * ✨ NEW: Converts the current queue to a new playlist
     * @param {string} playlistName - The name for the new playlist
     */
    const convertQueueToPlaylist = async (playlistName) => {
        if (playQueue.length === 0) {
            alert("Queue is empty!");
            return false;
        }

        try {
            // Create the playlist
            const playlistResponse = await api.post("/api/playlists/", {
                name: playlistName,
                description: `Created from queue on ${new Date().toLocaleDateString()}`
            });

            const playlistId = playlistResponse.data.id;

            // Add all songs from queue to the playlist
            for (let i = 0; i < playQueue.length; i++) {
                const song = playQueue[i];
                await api.post(`/api/playlists/${playlistId}/add-song/`, {
                    video_id: song.video_id,
                    title: song.title,
                    artist: song.artist,
                    thumbnail_url: song.thumbnail_url
                });
            }

            alert(`Successfully created playlist "${playlistName}" with ${playQueue.length} songs!`);
            return true;
        } catch (error) {
            console.error("Failed to convert queue to playlist:", error);
            alert("Failed to create playlist. Please try again.");
            return false;
        }
    };  const value = {
    isLoggedIn,
    user,
    nowPlaying,
    playQueue,
    currentTrackIndex,
    isPlaying,
    showQueue,
    login,
    logout,
    selectSong,
    playPlaylist,
    playNext,
    playPrevious,
    togglePlayPause,
    toggleQueue,
    shufflePlaylist,
    addToQueue,
    convertQueueToPlaylist
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
