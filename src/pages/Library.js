import React, { useEffect, useState } from "react";

const API_BASE = process.env.REACT_APP_API_URL;

function Library() {
  const [recordings, setRecordings] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/recordings`)
      .then((res) => res.json())
      .then((data) => setRecordings(data))
      .catch((err) => console.error("❌ Error fetching recordings:", err));
  }, []);

  return (
    <div className="library-container">
      <h2>📂 Saved Recordings</h2>
      {recordings.length === 0 ? (
        <p>No recordings yet</p>
      ) : (
        <ul>
          {recordings.map((rec) => (
            <li key={rec.id}>
              <video
                src={`${API_BASE}/api/recordings/${rec.id}`}
                controls
                width="400"
              />
              <p>{rec.filename}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Library;
