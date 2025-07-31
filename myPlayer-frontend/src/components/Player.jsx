import { useRef, useEffect, useState } from "react";
import YouTube from "react-youtube";
import { useAuth } from "../context/AuthContext";
import styles from "./Player.module.css";

const Player = ({ videoId }) => {
  const {
    playNext,
    playPrevious,
    togglePlayPause,
    toggleQueue,
    isPlaying,
    showQueue,
    playQueue,
    currentTrackIndex,
    convertQueueToPlaylist,
  } = useAuth();

  const playerRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const opts = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 1,
    },
  };

  useEffect(() => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDragging && playerRef.current && duration > 0) {
        const progressBar = document.querySelector(`.${styles.progressBar}`);
        if (progressBar) {
          const rect = progressBar.getBoundingClientRect();
          const dragX = e.clientX - rect.left;
          const newTime = Math.max(
            0,
            Math.min((dragX / rect.width) * duration, duration)
          );
          setCurrentTime(newTime);
        }
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging && playerRef.current) {
        playerRef.current.seekTo(currentTime);
        setIsDragging(false);
      }
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, currentTime, duration]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && !isDragging) {
        try {
          const current = playerRef.current.getCurrentTime();
          const total = playerRef.current.getDuration();
          setCurrentTime(current);
          setDuration(total);
        } catch (error) {
          // Ignore errors when player is not ready
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isDragging]);

  const onReady = (event) => {
    playerRef.current = event.target;
    try {
      const total = event.target.getDuration();
      setDuration(total);
    } catch (error) {
      // Player might not be ready yet
    }
  };

  const onStateChange = (event) => {
    // Update play state based on YouTube player state
    const { data } = event;
    if (data === 1) {
      // Playing
      // Player is playing, sync with our state if needed
    } else if (data === 2) {
      // Paused
      // Player is paused, sync with our state if needed
    }
  };

  const handleProgressClick = (e) => {
    if (playerRef.current && duration > 0) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;

      playerRef.current.seekTo(newTime);
      setCurrentTime(newTime);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleProgressClick(e);
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleConvertQueueToPlaylist = async () => {
    const playlistName = prompt(
      "Enter a name for your new playlist:",
      `Queue - ${new Date().toLocaleDateString()}`
    );
    if (playlistName && playlistName.trim()) {
      await convertQueueToPlaylist(playlistName.trim());
    }
  };

  const currentSong = playQueue[currentTrackIndex];
  const hasNext = currentTrackIndex < playQueue.length - 1;
  const hasPrevious = currentTrackIndex > 0;
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Hidden YouTube player */}
      <div style={{ position: "fixed", top: "-1000px", left: "-1000px" }}>
        <YouTube
          videoId={videoId}
          opts={opts}
          onEnd={playNext}
          onReady={onReady}
          onStateChange={onStateChange}
        />
      </div>

      {/* Visible Player UI */}
      <div className={styles.playerContainer}>
        <div className={styles.playerContent}>
          {/* Song Info */}
          <div className={styles.songInfo}>
            {currentSong && (
              <div className={styles.songDetails}>
                <div className={styles.songTitle}>{currentSong.title}</div>
                <div className={styles.songArtist}>{currentSong.artist}</div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className={styles.playerControls}>
            <button
              className={styles.controlBtn}
              onClick={playPrevious}
              disabled={!hasPrevious}
              title="Previous track"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.588a.7.7 0 0 1-1.05.606L4 8.149V13.3a.7.7 0 0 1-1.4 0V1.7a.7.7 0 0 1 .7-.7z" />
              </svg>
            </button>

            <button
              className={`${styles.controlBtn} ${styles.playPauseBtn}`}
              onClick={togglePlayPause}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                </svg>
              )}
            </button>

            <button
              className={styles.controlBtn}
              onClick={playNext}
              disabled={!hasNext}
              title="Next track"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.588a.7.7 0 0 0 1.05.606L12 8.149V13.3a.7.7 0 0 0 1.4 0V1.7a.7.7 0 0 0-.7-.7z" />
              </svg>
            </button>
          </div>

          {/* Queue Button */}
          <div className={styles.queueControls}>
            <button
              className={`${styles.controlBtn} ${styles.queueBtn} ${
                showQueue ? styles.active : ""
              }`}
              onClick={toggleQueue}
              title="Toggle queue"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M2.5 3.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11zm0 3a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11zm0 3a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11zm0 3a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11z" />
              </svg>
              <span className={styles.queueCount}>{playQueue.length}</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressContainer}>
          <span className={styles.timeDisplay}>{formatTime(currentTime)}</span>
          <div
            className={styles.progressBar}
            onClick={handleProgressClick}
            onMouseDown={handleMouseDown}
          >
            <div
              className={styles.progressFill}
              style={{ width: `${progressPercentage}%` }}
            />
            <div
              className={styles.progressHandle}
              style={{ left: `${progressPercentage}%` }}
            />
          </div>
          <span className={styles.timeDisplay}>{formatTime(duration)}</span>
        </div>

        {/* Queue Display */}
        {showQueue && (
          <div className={styles.queueDisplay}>
            <div className={styles.queueHeader}>
              <h3>Current Queue ({playQueue.length} songs)</h3>
              <div className={styles.queueHeaderActions}>
                {playQueue.length > 0 && (
                  <button
                    className={styles.saveQueueButton}
                    onClick={handleConvertQueueToPlaylist}
                    title="Save queue as playlist"
                  >
                    💾 Save as Playlist
                  </button>
                )}
                <button className={styles.closeQueue} onClick={toggleQueue}>
                  ✕
                </button>
              </div>
            </div>
            <div className={styles.queueList}>
              {playQueue.map((song, index) => (
                <div
                  key={index}
                  className={`${styles.queueItem} ${
                    index === currentTrackIndex ? styles.current : ""
                  }`}
                >
                  <div className={styles.queueSongInfo}>
                    <div className={styles.queueSongTitle}>{song.title}</div>
                    <div className={styles.queueSongArtist}>{song.artist}</div>
                  </div>
                  {index === currentTrackIndex && (
                    <span className={styles.nowPlayingIndicator}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path d="M6.271 5.055a.5.5 0 0 1 .52.038L11 7.055a.5.5 0 0 1 0 .89L6.791 9.907a.5.5 0 0 1-.791-.39V5.604a.5.5 0 0 1 .271-.549z" />
                      </svg>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Player;
