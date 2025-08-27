import styles from "./SongCard.module.css";

const SongCard = ({ song, onSongSelect, onAddToPlaylist, onAddToQueue }) => {
  const handleAddClick = (e) => {
    e.stopPropagation();
    onAddToPlaylist(song);
  };

  const handleQueueClick = (e) => {
    e.stopPropagation();
    onAddToQueue(song);
  };

  return (
    <div className={styles.songCard} onClick={() => onSongSelect(song)}>
      <div className={styles.thumbnailContainer}>
        <img
          src={song.thumbnail_url}
          alt={song.title}
          className={styles.thumbnail}
        />
        <div className={styles.playOverlay}>
          <span className={styles.playIcon}>▶</span>
        </div>
      </div>
      <div className={styles.content}>
        <h4 className={styles.title}>{song.title}</h4>
        <p className={styles.artist}>{song.artist}</p>
        <div className={styles.actions}>
          <button
            onClick={handleAddClick}
            className={`${styles.actionButton} ${styles.playlistButton}`}
          >
            ➕ Playlist
          </button>
          <button
            onClick={handleQueueClick}
            className={`${styles.actionButton} ${styles.queueButton}`}
          >
            ⏭ Queue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
