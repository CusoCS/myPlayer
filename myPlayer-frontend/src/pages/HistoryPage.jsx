import { useState, useEffect } from "react";
import api from "../api";
import styles from "../components/HistoryPage.module.css";

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/api/history/");
        setHistory(response.data);
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const formatPlayedTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
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
        <h1 className={styles.title}>🎵 Recently Played</h1>
        <p className={styles.subtitle}>
          Your music listening history from the last 2 days
        </p>
      </div>

      {history.length > 0 ? (
        <div className={styles.historyList}>
          {history.map((entry, index) => (
            <div key={index} className={styles.historyItem}>
              <img
                src={entry.song.thumbnail_url}
                alt={entry.song.title}
                className={styles.thumbnail}
              />
              <div className={styles.songInfo}>
                <h4 className={styles.songTitle}>{entry.song.title}</h4>
                <p className={styles.songArtist}>{entry.song.artist}</p>
              </div>
              <div className={styles.timeInfo}>
                <div className={styles.playedTime}>
                  🕒 {formatPlayedTime(entry.played_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🎵</div>
          <h3 className={styles.emptyTitle}>No listening history</h3>
          <p className={styles.emptyText}>
            Start playing some music to see your listening history here!
          </p>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
