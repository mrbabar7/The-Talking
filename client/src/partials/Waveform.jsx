import { useEffect, useRef } from "react";

const Waveform = ({ analyser, isPlayback = false, progress = 0 }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  /* ============================
     🎙 LIVE RECORDING WAVEFORM
     ============================ */
  const drawLiveWaveform = (analyser) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i += 10) {
        const barHeight = dataArray[i] / 2;
        ctx.fillStyle = "#4f46e5";
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    draw();
  };

  /* ============================
     ▶️ PLAYBACK WAVEFORM
     ============================ */
  const drawPlaybackWaveform = (progress) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bars = 40;
    const gap = 2;
    const barWidth = (canvas.width - bars * gap) / bars;
    const playedBars = Math.floor(bars * progress);

    for (let i = 0; i < bars; i++) {
      const barHeight = Math.random() * 20 + 6;
      const x = i * (barWidth + gap);
      const y = canvas.height - barHeight;

      ctx.fillStyle = i < playedBars ? "#4f46e5" : "#c7d2fe";
      ctx.fillRect(x, y, barWidth, barHeight);
    }
  };

  /* ============================
     EFFECT HANDLER
     ============================ */
  useEffect(() => {
    cancelAnimationFrame(animationRef.current);

    if (isPlayback) {
      drawPlaybackWaveform(progress);
      return;
    }

    if (analyser) {
      drawLiveWaveform(analyser);
    }

    return () => cancelAnimationFrame(animationRef.current);
  }, [analyser, isPlayback, progress]);

  return (
    <canvas ref={canvasRef} width={200} height={35} className="rounded-md" />
  );
};

export default Waveform;
