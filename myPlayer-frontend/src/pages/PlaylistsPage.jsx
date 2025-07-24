import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const PlaylistsPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const fetchPlaylists = async () => {
    try {
      const response = await api.get("/api/playlists/");
      setPlaylists(response.data);
    } catch (error) {
      console.error("Failed to fetch playlists", error);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/playlists/", { name: newPlaylistName });
      setNewPlaylistName(""); // Clear input field
      fetchPlaylists(); // Refresh the list of playlists
    } catch (error) {
      console.error("Failed to create playlist", error);
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      try {
        await api.delete(`/api/playlists/${playlistId}/`);
        fetchPlaylists(); // Refresh the list after deleting
      } catch (error) {
        console.error("Failed to delete playlist", error);
        alert("Failed to delete the playlist.");
      }
    }
  };

  return (
    <div>
      <h2>My Playlists</h2>
      <form onSubmit={handleCreatePlaylist}>
        <input
          type="text"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          placeholder="New playlist name"
          required
        />
        <button type="submit">Create Playlist</button>
      </form>
      <hr />
      <div>
        {playlists.map((playlist) => (
          <div key={playlist.id}>
            <Link to={`/playlists/${playlist.id}`}>
              <h3>{playlist.name}</h3>
            </Link>
            <button
              onClick={() => handleDeletePlaylist(playlist.id)}
              style={{ backgroundColor: "red", color: "white" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistsPage;
