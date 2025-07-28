import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Recommendations from "../components/Recommendations";
import AddToPlaylistModal from "../components/AddToPlaylistModal";

const RecommendationsPage = () => {
  const { selectSong, addToQueue } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [songToAdd, setSongToAdd] = useState(null);

  const handleOpenModal = (song) => {
    setSongToAdd(song);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSongToAdd(null);
  };

  return (
    <>
      <Recommendations
        onSongSelect={selectSong}
        onAddToPlaylist={handleOpenModal}
        onAddToQueue={addToQueue}
      />
      
      {isModalOpen && (
        <AddToPlaylistModal song={songToAdd} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default RecommendationsPage;
