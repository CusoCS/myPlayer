import { useState, useEffect } from 'react';
import api from '../api';

const AddToPlaylistModal = ({ song, onClose }) => {
    const [playlists, setPlaylists] = useState([]);

    // Fetch the user's playlists when the modal opens
    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await api.get('/api/playlists/');
                setPlaylists(response.data);
            } catch (error) {
                console.error("Failed to fetch playlists", error);
            }
        };
        fetchPlaylists();
    }, []);

    // Handle adding the song to the selected playlist
    const handlePlaylistSelect = async (playlistId) => {
        try {
            await api.post(`/api/playlists/${playlistId}/add-song/`, song);
            alert(`Song added to playlist!`);
            onClose(); // Close the modal on success
        } catch (error) {
            console.error("Failed to add song to playlist", error);
            alert("Failed to add song. It might already be in this playlist.");
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3>Add "{song.title}" to a playlist:</h3>
                {playlists.map(playlist => (
                    <div 
                        key={playlist.id} 
                        className="playlist-item"
                        onClick={() => handlePlaylistSelect(playlist.id)}
                    >
                        {playlist.name}
                    </div>
                ))}
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default AddToPlaylistModal;