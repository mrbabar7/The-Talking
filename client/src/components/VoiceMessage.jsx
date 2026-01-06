import {
  Mic,
  Trash2,
  SendHorizonal,
  Play,
  Pause,
  StopCircle,
  // SendHorizonal,
} from "lucide-react";
import Waveform from "../partials/WaveForm";
import { useVoiceRecorder } from "../custom/useVoiceRecorder";
import { useEffect, useRef, useState, useContext } from "react";
import { ChatContext } from "../provider/ChatProvider";
const VoiceMessage = () => {
  const { postVoiceMessage } = useContext(ChatContext);
  const {
    startRecording,
    stopRecording,
    resetRecording,
    recording,
    audioBlob,
    audioUrl,
    analyserRef,
  } = useVoiceRecorder();
  const audioRef = useRef(null);
  const recordTimerRef = useRef(null);

  const [recordDuration, setRecordDuration] = useState(0);
  const [playDuration, setPlayDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  /* ============================
     ⏱ Time formatter
     ============================ */
  const formatTime = (sec = 0) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  /* ============================
     🎙 RECORDING TIMER
     ============================ */
  useEffect(() => {
    if (recording) {
      recordTimerRef.current = setInterval(() => {
        setRecordDuration((t) => t + 1);
      }, 1000);
    } else {
      clearInterval(recordTimerRef.current);
    }

    return () => clearInterval(recordTimerRef.current);
  }, [recording]);

  /* ============================
     ▶️ PLAY / PAUSE
     ============================ */
  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      await audioRef.current.play();
      setIsPlaying(true);
    }
  };

  /* ============================
     🧹 RESET
     ============================ */
  const handleReset = () => {
    resetRecording();
    setRecordDuration(0);
    setPlayDuration(0);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  return (
    <div className="flex items-center gap-4 ">
      {/* 🎙 RECORDING MODE */}
      {recording && (
        <div className="flex items-center gap-3 flex-1">
          <Waveform analyser={analyserRef.current} />
          <span className="text-red-500 font-semibold animate-pulse">
            {formatTime(recordDuration)}
          </span>
          <button
            onClick={stopRecording}
            className="p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
          >
            <StopCircle />
          </button>
        </div>
      )}

      {/* 🎧 PREVIEW / PLAYBACK MODE */}
      {!recording && audioUrl && (
        <div className="flex items-center gap-3 flex-1 bg-gray-100 rounded-full px-4 py-1">
          <button className="cursor-pointer" onClick={togglePlay}>
            {isPlaying ? <Pause /> : <Play />}
          </button>

          <Waveform
            isPlayback
            progress={playDuration ? currentTime / playDuration : 0}
          />

          <span className="text-xs text-gray-600 min-w-[40 px]">
            {formatTime(isPlaying ? currentTime : playDuration)}
          </span>

          <audio
            ref={audioRef}
            src={audioUrl}
            preload="metadata"
            onLoadedMetadata={(e) => setPlayDuration(e.target.duration)}
            onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
            onEnded={() => {
              setIsPlaying(false);
              setCurrentTime(0);
            }}
          />

          <button className="cursor-pointer" onClick={handleReset}>
            <Trash2 className="text-red-700" />
          </button>

          <button
            onClick={() => {
              console.log("Send audio:", audioBlob);
              postVoiceMessage(audioBlob);
              handleReset();
            }}
          >
            <SendHorizonal className="text-indigo-900 cursor-pointer" />
          </button>
        </div>
      )}

      {/* 🎤 IDLE MIC */}
      {!audioUrl && !recording && (
        <button
          className="cursor-pointer hover:scale-105 transition-transform hover:bg-indigo-900 p-2 rounded-full"
          onPointerDown={startRecording}
          onPointerUp={stopRecording}
          onPointerCancel={stopRecording}
        >
          <Mic className="text-indigo-900 hover:text-white" />
        </button>
      )}
    </div>
  );
};

export default VoiceMessage;
