import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import styles from "../components/PlaylistsPage.module.css";

const PlaylistsPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlaylists = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/playlists/");
      setPlaylists(response.data);
    } catch (error) {
      console.error("Failed to fetch playlists", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    
    try {
      await api.post("/api/playlists/", { name: newPlaylistName.trim() });
      setNewPlaylistName(""); // Clear input field
      fetchPlaylists(); // Refresh the list of playlists
    } catch (error) {
      console.error("Failed to create playlist", error);
      alert("Failed to create playlist. Please try again.");
    }
  };

  const handleDeletePlaylist = async (playlistId, playlistName) => {
    if (window.confirm(`Are you sure you want to delete "${playlistName}"? This action cannot be undone.`)) {
      try {
        await api.delete(`/api/playlists/${playlistId}/`);
        fetchPlaylists(); // Refresh the list after deleting
      } catch (error) {
        console.error("Failed to delete playlist", error);
        alert("Failed to delete the playlist.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🎵 My Playlists</h1>
        <p className={styles.subtitle}>
          Create and manage your personal music collections
        </p>
      </div>

      <div className={styles.createSection}>
        <h2 className={styles.createTitle}>✨ Create New Playlist</h2>
        <form onSubmit={handleCreatePlaylist} className={styles.createForm}>
          <input
            type="text"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="Enter playlist name..."
            required
            className={styles.createInput}
            maxLength={100}
          />
          <button type="submit" className={styles.createButton}>
            ➕ Create
          </button>
        </form>
      </div>

      {playlists.length > 0 ? (
        <div className={styles.playlistsGrid}>
          {playlists.map((playlist) => (
            <div key={playlist.id} className={styles.playlistCard}>
              <Link to={`/playlists/${playlist.id}`} className={styles.playlistLink}>
                <div className={styles.playlistIcon}>🎶</div>
                <h3 className={styles.playlistName}>{playlist.name}</h3>
                <div className={styles.playlistInfo}>
                  <span>{playlist.song_count} songs</span>
                  <span>Updated {new Date(playlist.updated_at).toLocaleDateString()}</span>
                </div>
              </Link>
              <div className={styles.playlistActions}>
                <Link to={`/playlists/${playlist.id}`} className={styles.viewButton}>
                  👁 View
                </Link>
                <button
                  onClick={() => handleDeletePlaylist(playlist.id, playlist.name)}
                  className={styles.deleteButton}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📱</div>
          <h3 className={styles.emptyTitle}>No playlists yet</h3>
          <p className={styles.emptyText}>
            Create your first playlist above to start organizing your favorite songs!
          </p>
        </div>
      )}
    </div>
  );
};

export default PlaylistsPage;
