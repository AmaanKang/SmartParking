import firebase from 'firebase/app';
import 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState} from 'react';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

//const app = initializeApp(firebaseConfig);
//const auth = getAuth();

const login = async (email, password) => {
    /**try {
        await firebase.auth().signInWithEmailAndPassword(auth, email, password);
        return true;
    } catch (error) {
        return false;
    }*/
}

function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    return(
        <div>
            <form onSubmit={e => {
                e.preventDefault();
                login(email, password)
            }}>
                Email: <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required/>
                <br/>
                Password: <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required/>
                <br/>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login;