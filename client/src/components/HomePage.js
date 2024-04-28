import React from 'react';
import QRCode from 'qrcode.react';
import { signOut } from "firebase/auth";

function HomePage({isAdmin, setIsAdmin, onAuth}) {
  const baseUrl = window.location.origin;
  const url = baseUrl + '/map';
  const loginUrl = baseUrl + '/login';

  const logout = async () => {
    try {
      await signOut(onAuth);
      setIsAdmin(false);
    } catch (error) {
      console.log('Error signing out:', error);
    }
  }

  return (
    <div>
      <h1>Welcome to Our Parking Lot</h1>
      {!isAdmin && (
          <div>
            <a href={loginUrl}>Login as Adminstrator</a> <br/>
          </div>
      )}
      {isAdmin && (
          <div>
            <button onClick={() => {
              logout();
            }}>Logout</button> <br/>
          </div>
      )}
      <p>Scan the QR code below to view the parking spots map:</p>
      <a href={url}>
        <QRCode value={url} />
      </a>
    </div>
  );
}

export default HomePage;