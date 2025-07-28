import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import styles from "../components/HomePage.module.css";

import SearchBar from "../components/SearchBar";
import SearchResults from "../components/SearchResults";
import AddToPlaylistModal from "../components/AddToPlaylistModal";
import Recommendations from "../components/Recommendations";

const HomePage = () => {
  const { user, selectSong, addToQueue } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize searchResults state to null instead of an empty array
  const [searchResults, setSearchResults] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [songToAdd, setSongToAdd] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle search from URL parameters (from navbar search)
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery && user) {
      handleSearch(searchQuery);
      // Clear the search parameter from URL after processing
      setSearchParams({});
    }
  }, [searchParams, user, setSearchParams]);

  const handleSearch = async (query) => {
    if (!query) {
      setSearchResults(null);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await api.get(`/api/songs/search/?query=${query}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]); // Set to empty array on error to show "No results"
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (song) => {
    setSongToAdd(song);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSongToAdd(null);
  };

  return (
    <div className={styles.container}>
      {user ? (
        <>
          <div className={styles.welcomeSection}>
            <h1 className={styles.welcomeTitle}>
              Welcome back{user ? `, ${user.first_name}` : ""}! 🎵
            </h1>
            <p className={styles.welcomeSubtitle}>
              Search for your favorite songs and discover new music
            </p>
          </div>

          <SearchBar onSearch={handleSearch} />

          {(searchResults !== null || isLoading) && (
            <SearchResults
              results={searchResults || []}
              onSongSelect={selectSong}
              onAddToPlaylist={handleOpenModal}
              onAddToQueue={addToQueue}
              isLoading={isLoading}
            />
          )}

          {/* Show recommendations when not searching */}
          {searchResults === null && !isLoading && (
            <Recommendations
              onSongSelect={selectSong}
              onAddToPlaylist={handleOpenModal}
              onAddToQueue={addToQueue}
            />
          )}

          {isModalOpen && (
            <AddToPlaylistModal song={songToAdd} onClose={handleCloseModal} />
          )}
        </>
      ) : (
        <div className={styles.guestSection}>
          <h1 className={styles.guestTitle}>🎵 GL Jukebox</h1>
          <h2>Your Personal Music Experience Awaits!</h2>
          <p>
            Create playlists, discover music, and enjoy your favorite songs all in one place.
            Join our community and start your musical journey today.
          </p>
          <div className={styles.authButtons}>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Get Started</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
