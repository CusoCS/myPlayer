const SongCard = ({ song, onSongSelect, onAddToPlaylist }) => {
  const handleAddClick = (e) => {
    // Stop the click from also triggering the onSongSelect on the parent div
    e.stopPropagation();
    onAddToPlaylist(song);
  };

  return (
    <div
      onClick={() => onSongSelect(song.video_id)}
      style={{
        border: "1px solid #ccc",
        margin: "10px",
        padding: "10px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
      }}
    >
      <img src={song.thumbnail_url} alt={song.title} width="120" />
      <div style={{ marginLeft: "10px" }}>
        <h4>{song.title}</h4>
        <p>{song.artist}</p>
        <button onClick={handleAddClick}>Add to Playlist</button>
      </div>
    </div>
  );
};

export default SongCard;
