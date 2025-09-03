import React, { useState, useEffect } from "react";

function Library() {
  const [savedRecordings, setSavedRecordings] = useState([]);
  const API_URL = "https://main-screen-record-backend201-2.onrender.com/api/recordings";

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setSavedRecordings(data))
      .catch((err) => console.error("❌ Failed to fetch recordings:", err));
  }, []);

  return (
    <div>
      <h2>📂 Saved Recordings</h2>
      {savedRecordings.length === 0 ? (
        <p>No recordings found.</p>
      ) : (
        <div>
          {savedRecordings.map((rec) => (
            <div key={rec.id} style={{ marginBottom: "20px" }}>
              <p>
                <b>{rec.filename}</b> ({Math.round(rec.filesize / 1024)} KB) <br />
                Saved at: {new Date(rec.createdAt).toLocaleString()}
              </p>
              <video
                src={`https://main-screen-record-backend201-2.onrender.com/api/recordings/${rec.id}`}
                controls
                style={{ width: "60%", maxWidth: "600px" }}
              />
              <br />
              <a
                href={`https://main-screen-record-backend201-2.onrender.com/api/recordings/${rec.id}`}
                download={rec.filename}
              >
                ⬇️ Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Library;
