import React, { useState, useRef } from "react";

const API_BASE = process.env.REACT_APP_API_URL;

function Recorder() {
  const [recording, setRecording] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const videoRef = useRef();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setRecording(blob);
        videoRef.current.src = URL.createObjectURL(blob);

        // upload to backend
        const formData = new FormData();
        formData.append("recording", blob, "recording.webm");

        fetch(`${API_BASE}/api/recordings`, {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("✅ Upload success:", data);
            alert("Upload successful!");
          })
          .catch((err) => {
            console.error("❌ Upload error:", err);
            alert("Upload failed");
          });
      };

      recorder.start();
      setMediaRecorder(recorder);

      // timer
      let seconds = 0;
      const id = setInterval(() => {
        seconds++;
        setTimer(seconds);
      }, 1000);
      setIntervalId(id);
    } catch (err) {
      console.error("Error accessing screen:", err);
      alert("Screen recording not allowed!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      setMediaRecorder(null);
      clearInterval(intervalId);
      setIntervalId(null);
      setTimer(0);
    }
  };

  const downloadRecording = () => {
    if (recording) {
      const url = URL.createObjectURL(recording);
      const a = document.createElement("a");
      a.href = url;
      a.download = "recording.webm";
      a.click();
    }
  };

  return (
    <div className="recorder-container">
      <h2>🎥 Record Screen</h2>
      <p>⏱️ Timer: {timer}s</p>
      {!mediaRecorder ? (
        <button onClick={startRecording}>Start Recording</button>
      ) : (
        <button onClick={stopRecording}>Stop Recording</button>
      )}

      <h3>Preview</h3>
      <video ref={videoRef} controls className="video-preview"></video>
      <br />
      {recording && <button onClick={downloadRecording}>Download</button>}
    </div>
  );
}

export default Recorder;
