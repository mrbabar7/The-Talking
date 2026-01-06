import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

const VoiceMessageBubble = ({ audio }) => {
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const duration = audio.duration || 0;

  const formatTime = (sec = 1) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(1, "0")}`;
  };
  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      await audioRef.current.play();
    }
  };

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const update = () => setCurrent(el.currentTime);
    const end = () => {
      setIsPlaying(false);
      setCurrent(0);
    };

    el.addEventListener("timeupdate", update);
    el.addEventListener("ended", end);
    el.addEventListener("play", () => setIsPlaying(true));
    el.addEventListener("pause", () => setIsPlaying(false));

    return () => {
      el.removeEventListener("timeupdate", update);
      el.removeEventListener("ended", end);
    };
  }, []);

  const progress = duration ? (current / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-4xl w-40 bg-indigo-900 text-white">
      {/* Play / Pause */}
      <button onClick={togglePlay}>
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>

      {/* Waveform (Progress) */}
      <div className="flex-1">
        <div className="h-2 bg-gray-100 rounded overflow-hidden">
          <div
            className="h-full bg-green-400"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs mt-1 flex justify-end items-center">
          <span>{formatTime(current)}/</span>
          <span>{formatTime(duration)}s</span>
        </div>
      </div>

      <audio ref={audioRef} src={audio.url} preload="metadata" />
    </div>
  );
};

export default VoiceMessageBubble;
