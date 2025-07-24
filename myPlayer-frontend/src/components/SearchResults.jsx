import SongCard from "./SongCard";

const SearchResults = ({ results, onSongSelect, onAddToPlaylist }) => {
  return (
    <div>
      <h3>Search Results</h3>
      <div>
        {results.length > 0 ? (
          results.map((song) => (
            <SongCard
              key={song.video_id}
              song={song}
              onSongSelect={onSongSelect}
              onAddToPlaylist={onAddToPlaylist}
            />
          ))
        ) : (
          <p>No results found. Try a new search.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
