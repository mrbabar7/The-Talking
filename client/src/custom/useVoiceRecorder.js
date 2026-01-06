import { useRef, useState } from "react";

export const useVoiceRecorder = () => {
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);

  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const startRecording = async () => {
    if (recording) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    source.connect(analyser);
    analyserRef.current = analyser;

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);

      setAudioBlob(blob);
      setAudioUrl(url);

      stream.getTracks().forEach((t) => t.stop());
      audioContext.close();

      mediaRecorderRef.current = null;
      streamRef.current = null;
      chunksRef.current = [];
      setRecording(false);
    };

    recorder.start();
    setRecording(true);
  };

  // const stopRecording = () => {
  //   if (!mediaRecorderRef.current) return;
  //   mediaRecorderRef.current.stop();
  // };
  const stopRecording = () => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;

      if (!recorder || recorder.state !== "recording") {
        resolve(null);
        return;
      }

      recorder.onstop = () => {
        if (chunksRef.current.length === 0) {
          resolve(null);
          return;
        }

        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);

        setAudioBlob(blob);
        setAudioUrl(url);

        resolve(blob);

        // cleanup
        streamRef.current?.getTracks().forEach((t) => t.stop());
        audioContextRef.current?.close();

        mediaRecorderRef.current = null;
        streamRef.current = null;
        chunksRef.current = [];
        setRecording(false);
      };

      recorder.stop();
    });
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
  };

  return {
    startRecording,
    stopRecording,
    resetRecording,
    recording,
    audioBlob,
    audioUrl,
    analyserRef,
  };
};
