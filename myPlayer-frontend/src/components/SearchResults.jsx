import SongCard from "./SongCard";
import styles from "./SearchResults.module.css";

const SearchResults = ({ results, onSongSelect, onAddToPlaylist, onAddToQueue, isLoading }) => {
  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          🎵 Search Results
        </h3>
        {results.length > 0 && (
          <span className={styles.resultCount}>
            {results.length} song{results.length !== 1 ? 's' : ''} found
          </span>
        )}
      </div>
      <div className={styles.resultsGrid}>
        {results.length > 0 ? (
          results.map((song) => (
            <SongCard
              key={song.video_id}
              song={song}
              onSongSelect={onSongSelect}
              onAddToPlaylist={onAddToPlaylist}
              onAddToQueue={onAddToQueue}
            />
          ))
        ) : (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>🔍</div>
            <h4 className={styles.noResultsTitle}>No songs found</h4>
            <p className={styles.noResultsText}>
              Try searching with different keywords or check your spelling
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
