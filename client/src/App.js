import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage.js';
import MapPage from './components/MapPage.js';
import Login from './components/login.js';
import firebase from 'firebase/app';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword} from "firebase/auth";


function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    /**firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });*/
  },[])
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/map" element={<MapPage isAdmin={isAdmin}/>} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </Router>
  );
}

export default App;