import { useState, useEffect } from 'react';
import api from '../api';

const HistoryPage = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/api/history/');
                setHistory(response.data);
            } catch (error) {
                console.error("Failed to fetch history", error);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div>
            <h2>Recently Played (Last 5 Days)</h2>
            {history.map((entry, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', margin: '10px' }}>
                    <img src={entry.song.thumbnail_url} alt={entry.song.title} width="60" />
                    <div style={{ marginLeft: '10px' }}>
                        <h4>{entry.song.title}</h4>
                        <p>{entry.song.artist}</p>
                        <small>Played at: {entry.played_at}</small>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HistoryPage;