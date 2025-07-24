import YouTube from "react-youtube";
import { useAuth } from "../context/AuthContext";

const Player = ({ videoId }) => {
  const { playNext } = useAuth();

  const opts = {
    height: "0",
    width: "320",
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div style={{ position: "fixed", top: "0", right: "0", zIndex: -1 }}>
      <YouTube videoId={videoId} opts={opts} onEnd={playNext} />
    </div>
  );
};

export default Player;
