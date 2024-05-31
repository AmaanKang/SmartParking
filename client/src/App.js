import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage.js';
import MapPage from './components/MapPage.js';
import Login from './components/login.js';
import Analytics from './components/Analytics.js';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged} from "firebase/auth";

// Get the configuration from the Firebase Console
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  // When the user logs in or logs out, switch the isAdmin boolean
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  },[auth,isAdmin]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage isAdmin={isAdmin} setIsAdmin={setIsAdmin} onAuth={auth}/>} />
        <Route path="/home" element={<HomePage isAdmin={isAdmin} setIsAdmin={setIsAdmin} onAuth={auth}/>} />
        <Route path="/map" element={<MapPage isAdmin={isAdmin}/>} />
        <Route path="/login" element={<Login onAuth={auth} />}/>
        <Route path="/analytics" element={<Analytics isAdmin={isAdmin} />}/>
      </Routes>
    </Router>
  );
}

export default App;