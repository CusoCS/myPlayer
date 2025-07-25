import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";

import SearchBar from "../components/SearchBar";
import SearchResults from "../components/SearchResults";
import AddToPlaylistModal from "../components/AddToPlaylistModal";

const HomePage = () => {
  const { user, selectSong, addToQueue } = useAuth();

  // Initialize searchResults state to null instead of an empty array
  const [searchResults, setSearchResults] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [songToAdd, setSongToAdd] = useState(null);

  const handleSearch = async (query) => {
    if (!query) {
      setSearchResults(null);
      return;
    }
    try {
      const response = await api.get(`/api/songs/search/?query=${query}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]); // Set to empty array on error to show "No results"
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
    <div>
      {user ? (
        <>
          <h2>Welcome back{user ? `, ${user.first_name}` : ""}!</h2>
          <p>Search for a song to begin.</p>

          <SearchBar onSearch={handleSearch} />

          {searchResults !== null && (
            <SearchResults
              results={searchResults}
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
        <>
          <h2>GL Jukebox - Sign up now!</h2>
          <p>
            Please log in or register to search for music and create playlists.
          </p>
        </>
      )}
    </div>
  );
};

export default HomePage;
