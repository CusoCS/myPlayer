import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import styles from "./Recommendations.module.css";
import SongCard from "./SongCard";

const Recommendations = ({ onSongSelect, onAddToPlaylist, onAddToQueue }) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  }, [user]);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/api/recommendations/");
      setRecommendations(response.data);
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
      setError("Failed to load recommendations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchRecommendations();
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>🎵 Recommendations for You</h2>
        </div>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Finding songs you'll love...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>🎵 Recommendations for You</h2>
        </div>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={handleRefresh} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>🎵 Recommendations for You</h2>
        </div>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🎧</div>
          <h3>No recommendations yet</h3>
          <p>Start listening to some songs to get personalized recommendations!</p>
          <button onClick={handleRefresh} className={styles.refreshButton}>
            Check Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>🎵 Recommendations for You</h2>
        <button onClick={handleRefresh} className={styles.refreshButton}>
          🔄 Refresh
        </button>
      </div>

      {recommendations.map((category, categoryIndex) => (
        <div key={categoryIndex} className={styles.categorySection}>
          <div className={styles.categoryHeader}>
            <h3 className={styles.categoryTitle}>{category.category}</h3>
            <p className={styles.categoryReason}>{category.reason}</p>
          </div>
          
          <div className={styles.songsGrid}>
            {category.songs.map((song, songIndex) => (
              <SongCard
                key={`${categoryIndex}-${songIndex}`}
                song={song}
                onSongSelect={onSongSelect}
                onAddToPlaylist={onAddToPlaylist}
                onAddToQueue={onAddToQueue}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Recommendations;
