import React, { useState, useRef } from "react";

function Recorder() {
  const [recording, setRecording] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const videoRef = useRef();

  const API_URL = "https://main-screen-record-backend201-2.onrender.com/api/recordings";

  // --- start recording ---
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

        // upload
        const formData = new FormData();
        formData.append("video", blob, "recording.webm");

        fetch(API_URL, { method: "POST", body: formData })
          .then((res) => res.json())
          .then((data) => {
            console.log("✅ Upload success:", data);
            alert("Upload successful! Check Library page.");
          })
          .catch((err) => {
            console.error("❌ Upload error:", err);
            alert("Upload failed");
          });
      };

      recorder.start();
      setMediaRecorder(recorder);

      let seconds = 0;
      const id = setInterval(() => {
        seconds++;
        setTimer(seconds);
      }, 1000);
      setIntervalId(id);

    } catch (err) {
      console.error("❌ Error accessing screen:", err);
      alert("Screen recording not allowed!");
    }
  };

  // --- stop recording ---
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

  return (
    <div>
      <h2>🎥 Record Screen</h2>
      <p>Timer: {timer}s</p>
      {!mediaRecorder ? (
        <button onClick={startRecording}>Start Recording</button>
      ) : (
        <button onClick={stopRecording}>Stop Recording</button>
      )}

      <h3 style={{ marginTop: "20px" }}>Preview</h3>
      <video
        ref={videoRef}
        controls
        style={{ width: "80%", maxWidth: "800px", marginTop: "10px" }}
      ></video>
    </div>
  );
}

export default Recorder;
