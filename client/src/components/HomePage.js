import React from 'react';
import QRCode from 'qrcode.react';
import { signOut } from "firebase/auth";

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
            }}>Logout as Administrator</button> <br/>
          </div>
      )}
      <p>Below is the QR code which can be printed and put at the front of the parking lot. Customers can scan this QR code and it will take them to the 
        map of the parking lot.
      </p>
      <a href={url}>
        <QRCode value={url} />
      </a>
    </div>
  );
}

export default HomePage;