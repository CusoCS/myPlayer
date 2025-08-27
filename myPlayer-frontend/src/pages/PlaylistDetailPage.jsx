import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import styles from "../components/PlaylistDetailPage.module.css";

const PlaylistDetailPage = () => {
  const [playlist, setPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const { playPlaylist, shufflePlaylist } = useAuth();

  const fetchPlaylistDetails = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/playlists/${id}/`);
      setPlaylist(response.data);
    } catch (error) {
      console.error("Failed to fetch playlist details", error);
      if (error.response?.status === 404) {
        navigate("/playlists");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylistDetails();
  }, [id]);

  const handleRemoveSong = async (itemId, songTitle) => {
    if (window.confirm(`Remove "${songTitle}" from this playlist?`)) {
      try {
        await api.delete(`/api/playlist-items/${itemId}/`);
        fetchPlaylistDetails(); // Refresh the playlist details after removing a song
      } catch (error) {
        console.error("Failed to remove song", error);
        alert("Failed to remove the song from the playlist.");
      }
    }
  };

  const handlePlaySong = (index) => {
    playPlaylist(playlist.items, index);
  };

  const handleShufflePlay = () => {
    shufflePlaylist(playlist.items);
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

  if (!playlist) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>❌</div>
          <h3 className={styles.emptyTitle}>Playlist not found</h3>
          <p className={styles.emptyText}>
            This playlist doesn't exist or you don't have permission to view it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.playlistIcon}>🎶</div>
          <h1 className={styles.playlistTitle}>{playlist.name}</h1>
          <div className={styles.playlistMeta}>
            <div className={styles.metaItem}>
              <span>🎵</span>
              <span>{playlist.items?.length || 0} songs</span>
            </div>
            <div className={styles.metaItem}>
              <span>📅</span>
              <span>
                Created {new Date(playlist.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className={styles.metaItem}>
              <span>🔄</span>
              <span>
                Updated {new Date(playlist.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          {playlist.description && (
            <p className={styles.playlistDescription}>{playlist.description}</p>
          )}
        </div>
      </div>

      <div className={styles.controlsSection}>
        <Link
          to="/playlists"
          className={styles.controlButton + " " + styles.backButton}
        >
          ← Back to Playlists
        </Link>
        {playlist.items && playlist.items.length > 0 && (
          <button
            onClick={handleShufflePlay}
            className={styles.controlButton + " " + styles.shuffleButton}
          >
            🔀 Shuffle Play
          </button>
        )}
      </div>

      <div className={styles.songsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>🎵 Songs</h2>
          {playlist.items && playlist.items.length > 0 && (
            <span className={styles.songCount}>
              {playlist.items.length} song
              {playlist.items.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {playlist.items && playlist.items.length > 0 ? (
          <div className={styles.songsList}>
            {playlist.items.map((item, index) => (
              <div key={item.id} className={styles.songItem}>
                <div className={styles.songNumber}>{index + 1}</div>
                <img
                  src={item.song.thumbnail_url}
                  alt={item.song.title}
                  className={styles.songThumbnail}
                />
                <div className={styles.songInfo}>
                  <h4 className={styles.songTitle}>{item.song.title}</h4>
                  <p className={styles.songArtist}>{item.song.artist}</p>
                </div>
                <div className={styles.songActions}>
                  <button
                    onClick={() => handlePlaySong(index)}
                    className={styles.actionButton + " " + styles.playButton}
                  >
                    ▶ Play
                  </button>
                  <button
                    onClick={() => handleRemoveSong(item.id, item.song.title)}
                    className={styles.actionButton + " " + styles.removeButton}
                  >
                    🗑 Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎵</div>
            <h3 className={styles.emptyTitle}>No songs in this playlist</h3>
            <p className={styles.emptyText}>
              Start adding songs to this playlist by searching for music on the
              home page!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetailPage;
