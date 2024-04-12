import React from 'react';
import QRCode from 'qrcode.react';

function HomePage() {
  const url = window.location.href + 'map';

  return (
    <div>
      <h1>Welcome to Our Parking Lot</h1>
      <p>Scan the QR code below to view the parking spots map:</p>
      <QRCode value={url} />
    </div>
  );
}

export default HomePage;