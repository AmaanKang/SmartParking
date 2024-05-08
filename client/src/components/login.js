
import 'firebase/auth';
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import './login.css';

function Login({onAuth}){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    // When Login Submit button is clicked
    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(onAuth, email, password);
            setEmail('');
            setPassword('');
            setMessage('');
            navigate('/home');
            return true;
        } catch (error) {
            setMessage("Invalid email or password!");
            return false;
        }
    }

    /** In case the user directly accesses the login page, check the login status
     * useEffect(() => {
        const unsubscribe = onAuthStateChanged(onAuth, (user) => {
          if (user) {
            navigate('/home');
          }
        });
    
        // Cleanup subscription on unmount
        return () => unsubscribe();
      },[onAuth,navigate])*/

    return(
        <div className='login-page'>
            <h1>Login as Admin</h1>
            <form onSubmit={e => {
                e.preventDefault();
                login(email, password)
            }}>
                <label>
                Email: <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required/>
                
                </label>
                <label>
                Password: <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required/>
                
                </label>
                <p style={{color:"red"}}>{message}</p>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login;