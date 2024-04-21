import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage.js';
import MapPage from './components/MapPage.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/map" element={<MapPage isAdmin={true}/>} />
      </Routes>
    </Router>
  );
}

export default App;