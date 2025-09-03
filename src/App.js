import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Recorder from "./pages/Recorder";
import Library from "./pages/Library";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <h1>MERN Screen Recorder</h1>
        <nav>
          <Link to="/">🎥 Record</Link>
          <Link to="/library">📂 Library</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Recorder />} />
          <Route path="/library" element={<Library />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
