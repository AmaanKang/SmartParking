import React from 'react';
import QRCode from 'qrcode.react';
import { signOut } from "firebase/auth";
import './HomePage.css';
// The image reference - https://images.adsttc.com/media/images/61f8/7e55/3e4b/3159/ff00/0053/large_jpg/image_via_parking_industry.jpg?1643675216
import backgroundImage from './images/a_parking_lot.jpg';

function HomePage({isAdmin, setIsAdmin, onAuth}) {
  const baseUrl = window.location.origin;
  const url = baseUrl + '/map';
  const loginUrl = baseUrl + '/login';
  const analyticsUrl = baseUrl + '/analytics';

  // When the logout button is clicked
  const logout = async () => {
    try {
      await signOut(onAuth);
    } catch (error) {
      console.log('Error signing out:', error);
    }
  }

  return (
    <div className="home-page">
      <h1>Welcome to Our Parking Lot</h1>
      {
        /**Display the login or logout button depending on if the admin is logged in or logged out right now. */
      }
      {!isAdmin && (
          <div className='login-link'>
            <a href={loginUrl}>Login as Adminstrator</a> <br/>
          </div>
      )}
      {isAdmin && (
        <div>
          <span className='logout-link'>
            <a onClick={() => {
              logout();
            }}>Logout as Administrator</a>
          </span>
          <span className='analytics-link'>
            <a href={analyticsUrl}>Check Parking Lot Analytics</a>
          </span>
        </div>
          
      )}
      <div className='picture'>
        <img src={backgroundImage}/>
      </div>
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