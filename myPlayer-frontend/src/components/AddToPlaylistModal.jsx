import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import styles from "./AddToPlaylistModal.module.css";

const AddToPlaylistModal = ({ song, onClose }) => {
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const navigate = useNavigate();

  // Fetch the user's playlists when the modal opens
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/api/playlists/");
        setPlaylists(response.data);
      } catch (error) {
        console.error("Failed to fetch playlists", error);
        setMessage({ type: 'error', text: 'Failed to load playlists' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlaylists();
  }, []);

  // Handle adding the song to the selected playlist
  const handlePlaylistSelect = async (playlistId, playlistName) => {
    try {
      setMessage({ type: '', text: '' });
      await api.post(`/api/playlists/${playlistId}/add-song/`, song);
      setMessage({ 
        type: 'success', 
        text: `✅ "${song.title}" added to "${playlistName}"!` 
      });
      
      // Auto-close after 2 seconds on success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Failed to add song to playlist", error);
      if (error.response?.status === 400) {
        setMessage({ 
          type: 'error', 
          text: 'This song is already in that playlist' 
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: 'Failed to add song. Please try again.' 
        });
      }
    }
  };

  // Handle creating a new playlist and adding the song
  const handleCreateNewPlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    try {
      setMessage({ type: '', text: '' });
      
      // Create the playlist
      const playlistResponse = await api.post("/api/playlists/", { 
        name: newPlaylistName.trim() 
      });
      
      // Add the song to the new playlist
      await api.post(`/api/playlists/${playlistResponse.data.id}/add-song/`, song);
      
      setMessage({ 
        type: 'success', 
        text: `✅ Created "${newPlaylistName}" and added "${song.title}"!` 
      });
      
      // Auto-close after 2 seconds on success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Failed to create playlist", error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to create playlist. Please try again.' 
      });
    }
  };

  // Handle backdrop click to close modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div className={styles.modalIcon}>🎵</div>
          <h2 className={styles.modalTitle}>Add to Playlist</h2>
          
          <div className={styles.songInfo}>
            <img 
              src={song.thumbnail_url} 
              alt={song.title}
              className={styles.songThumbnail}
            />
            <div className={styles.songDetails}>
              <h4 className={styles.songTitle}>{song.title}</h4>
              <p className={styles.songArtist}>{song.artist}</p>
            </div>
          </div>
        </div>

        {/* Message display */}
        {message.text && (
          <div className={message.type === 'success' ? styles.successMessage : styles.errorMessage}>
            {message.text}
          </div>
        )}

        {/* Create new playlist form */}
        {showCreateNew && (
          <div className={styles.playlistsSection}>
            <h3 className={styles.sectionTitle}>
              ✨ Create New Playlist
            </h3>
            <form onSubmit={handleCreateNewPlaylist} style={{ marginBottom: 'var(--spacing-md)' }}>
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Enter playlist name..."
                  style={{
                    flex: 1,
                    background: 'var(--surface-bg)',
                    border: '1px solid var(--accent-bg)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    color: 'var(--primary-text)',
                    fontSize: '0.9rem'
                  }}
                  autoFocus
                  maxLength={100}
                />
                <button type="submit" className={styles.createNewButton}>
                  ✅ Create & Add
                </button>
              </div>
            </form>
          </div>
        )}

        <div className={styles.playlistsSection}>
          <h3 className={styles.sectionTitle}>
            📂 Choose Playlist
            {playlists.length > 0 && (
              <span style={{ 
                fontSize: '0.8rem', 
                color: 'var(--secondary-text)',
                fontWeight: 'normal'
              }}>
                ({playlists.length} playlist{playlists.length !== 1 ? 's' : ''})
              </span>
            )}
          </h3>
          
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.loadingSpinner}></div>
            </div>
          ) : playlists.length > 0 ? (
            <div className={styles.playlistsList}>
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className={styles.playlistItem}
                  onClick={() => handlePlaylistSelect(playlist.id, playlist.name)}
                >
                  <div className={styles.playlistIcon}>🎶</div>
                  <div className={styles.playlistContent}>
                    <h4 className={styles.playlistName}>{playlist.name}</h4>
                    <div className={styles.playlistMeta}>
                      <span>{playlist.song_count} songs</span>
                      <span>Updated {new Date(playlist.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📱</div>
              <h4 className={styles.emptyTitle}>No playlists yet</h4>
              <p className={styles.emptyText}>
                Create your first playlist to start organizing your music!
              </p>
            </div>
          )}
        </div>

        <div className={styles.modalActions}>
          <button 
            onClick={onClose} 
            className={styles.cancelButton}
          >
            ❌ Cancel
          </button>
          <button 
            onClick={() => setShowCreateNew(!showCreateNew)}
            className={styles.createNewButton}
          >
            {showCreateNew ? '📂 Choose Existing' : '➕ Create New'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToPlaylistModal;
