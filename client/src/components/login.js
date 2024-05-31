
import 'firebase/auth';
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import './login.css';
// The image reference - https://images.adsttc.com/media/images/61f8/7e55/3e4b/3159/ff00/0053/large_jpg/image_via_parking_industry.jpg?1643675216
import backgroundImage from './images/a_parking_lot.jpg';

function Login({onAuth}){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const baseUrl = window.location.origin;

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
            <div className='home-link'>
                <a href={baseUrl}>Go to Home</a>
                </div>
            <div className='picture'>
                <img src={backgroundImage}/>
            </div>
        </div>
    )
}

export default Login;