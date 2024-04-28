
import 'firebase/auth';
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

function Login({onAuth}){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(onAuth, email, password);
            setEmail('');
            setPassword('');
            navigate('/home');
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    /**useEffect(() => {
        const unsubscribe = onAuthStateChanged(onAuth, (user) => {
          if (user) {
            navigate('/home');
          }
        });
    
        // Cleanup subscription on unmount
        return () => unsubscribe();
      },[onAuth,navigate])*/

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