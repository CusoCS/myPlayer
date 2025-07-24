import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Your configured axios instance

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [nowPlaying, setNowPlaying] = useState(null);
    const [playQueue, setPlayQueue] = useState([]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
    const navigate = useNavigate();

    /**
     * On initial app load, check localStorage for existing session data.
     */
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const storedUser = localStorage.getItem('user');
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
     * Logs that a song has been played to the backend history endpoint.
     * @param {string} videoId - The YouTube video ID of the song played.
     */
    const logPlayToHistory = (videoId) => {
        if (!videoId) return;
        api.post('/api/history/log/', { video_id: videoId })
           .catch(e => console.error("Failed to log play to history", e));
    };

    /**
     * Handles user login, storing tokens and user data.
     * @param {string} accessToken - The JWT access token.
     * @param {string} refreshToken - The JWT refresh token.
     * @param {object} userData - The user details object.
     */
    const login = (accessToken, refreshToken, userData) => {
        localStorage.setItem('access_token', accessToken);
        if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
        }
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        }
        setIsLoggedIn(true);
        navigate('/');
    };

    /**
     * Handles user logout, clearing local storage and server-side tokens.
     */
    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                await api.post('/api/auth/logout/', { refresh: refreshToken });
            }
        } catch (e) {
            console.error('Logout failed on server.', e);
        } finally {
            localStorage.clear(); // A simpler way to clear all session data
            setIsLoggedIn(false);
            setUser(null);
            setNowPlaying(null);
            setPlayQueue([]);
            setCurrentTrackIndex(-1);
            navigate('/');
        }
    };

    /**
     * Plays a single song (e.g., from search results) and clears the queue.
     * @param {object} song - The full song object to play.
     */
    const selectSong = (song) => {
        setNowPlaying(song.video_id);
        setPlayQueue([]);
        setCurrentTrackIndex(-1);
        logPlayToHistory(song.video_id); // ✨ Log to history
    };

    /**
     * Plays a list of songs from a specific starting point.
     * @param {Array} items - The array of playlist items.
     * @param {number} startIndex - The index of the song to start playing.
     */
    const playPlaylist = (items, startIndex = 0) => {
        const videoIds = items.map((item) => item.song.video_id);
        setPlayQueue(videoIds);
        setCurrentTrackIndex(startIndex);
        setNowPlaying(videoIds[startIndex]);
        logPlayToHistory(videoIds[startIndex]); // ✨ Log to history
    };

    /**
     * Plays the next song in the current queue. Called by the player onEnd event.
     */
    const playNext = () => {
        if (playQueue.length > 0 && currentTrackIndex < playQueue.length - 1) {
            const nextIndex = currentTrackIndex + 1;
            setCurrentTrackIndex(nextIndex);
            setNowPlaying(playQueue[nextIndex]);
            logPlayToHistory(playQueue[nextIndex]); // ✨ Log to history
        } else {
            setNowPlaying(null);
            setPlayQueue([]);
            setCurrentTrackIndex(-1);
        }
    };

    /**
     * Shuffles a playlist and starts playing it.
     * @param {Array} items - The array of playlist items to shuffle.
     */
    const shufflePlaylist = (items) => {
        const shuffledItems = [...items];
        for (let i = shuffledItems.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledItems[i], shuffledItems[j]] = [shuffledItems[j], shuffledItems[i]];
        }
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