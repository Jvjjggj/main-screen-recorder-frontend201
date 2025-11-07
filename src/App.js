import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Recorder from "./pages/Recorder";
import Library from "./pages/Library";
import "./App.css";
import { FaVideo, FaFolder } from "react-icons/fa";

function App() {
  return (
    <Router>
      <div className="app-container">
        <h1>MERN Screen Recorder</h1>

        <nav className="navbar">
          <Link to="/" className="nav-link">
            <FaVideo /> Record
          </Link>
          <Link to="/library" className="nav-link">
            <FaFolder /> Library
          </Link>
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
