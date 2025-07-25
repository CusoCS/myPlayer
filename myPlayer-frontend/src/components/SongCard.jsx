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
    <div
      onClick={() => onSongSelect(song)}
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
        <button onClick={handleQueueClick} style={{ marginLeft: "5px" }}>
          Add to Queue
        </button>
      </div>
    </div>
  );
};

export default SongCard;
