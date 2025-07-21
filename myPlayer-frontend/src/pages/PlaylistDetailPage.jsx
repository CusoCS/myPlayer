import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const PlaylistDetailPage = () => {
    const [playlist, setPlaylist] = useState(null);
    const { id } = useParams();
    const { playPlaylist, shufflePlaylist } = useAuth();

    const fetchPlaylistDetails = async () => {
        try {
            const response = await api.get(`/api/playlists/${id}/`);
            setPlaylist(response.data);
        } catch (error) {
            console.error("Failed to fetch playlist details", error);
        }
    };

    useEffect(() => {
        fetchPlaylistDetails();
    }, [id]);

    const handleRemoveSong = async (itemId) => {
        try {
            await api.delete(`/api/playlist-items/${itemId}/`);
            fetchPlaylistDetails(); // Refresh the playlist details after removing a song
        } catch (error) {
            console.error("Failed to remove song", error);
            alert("Failed to remove the song from the playlist.");
        }
    };

    if (!playlist) return <div>Loading...</div>;

    return (
        <div>
            <h2>{playlist.name}</h2>
            <p>{playlist.description}</p>
            {playlist.items.length > 0 && (
                <button onClick={() => shufflePlaylist(playlist.items)} style={{marginBottom: '20px'}}>
                    Shuffle Play
                </button>
            )}
            {playlist.items.map((item, index) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', margin: '10px', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={item.song.thumbnail_url} alt={item.song.title} width="80" />
                        <div style={{ marginLeft: '10px' }}>
                            <h4>{item.song.title}</h4>
                            <p>{item.song.artist}</p>
                            <button onClick={() => playPlaylist(playlist.items, index)}>Play</button>
                        </div>
                    </div>
                    <button onClick={() => handleRemoveSong(item.id)} style={{backgroundColor: 'orange', color: 'white'}}>
                        Remove
                    </button>
                </div>
            ))}
        </div>
    );
};

export default PlaylistDetailPage;