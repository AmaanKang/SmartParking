import React from 'react';
import QRCode from 'qrcode.react';
import { signOut } from "firebase/auth";
import './HomePage.css';

function HomePage({isAdmin, setIsAdmin, onAuth}) {
  const baseUrl = window.location.origin;
  const url = baseUrl + '/map';
  const loginUrl = baseUrl + '/login';

  // When the logout button is clicked
  const logout = async () => {
    try {
      await signOut(onAuth);
      setIsAdmin(false);
    } catch (error) {
      console.log('Error signing out:', error);
    }
  }

  return (
    <div className="home-page">
      <h1>Welcome to Our Parking Lot</h1>
      {!isAdmin && (
          <div className='login-link'>
            <a href={loginUrl}>Login as Adminstrator</a> <br/>
          </div>
      )}
      {isAdmin && (
          <div className='logout-link'>
            <a onClick={() => {
              logout();
            }}>Logout as Administrator</a> <br/>
          </div>
      )}
      <div className='qr-code'>
      <p>Below is the QR code which can be printed and put at the front of the parking lot. Customers can scan this QR code and it will take them to the 
        map of the parking lot.
      </p>
      </div>
      
      <div >
      <a href={url}>
        <QRCode value={url} />
      </a>
      </div>
      
    </div>
  );
}

export default HomePage;