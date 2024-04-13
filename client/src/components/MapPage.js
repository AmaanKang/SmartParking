import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function MapPage() {
  // TODO: Fetch the available parking spots from the server
  const parkingSpots = [
    { id: '1', lat: 51.505, lng: -0.09 },
    // Add more parking spots here
  ];

  return (
    <div>
      <h1>Parking Spots Map</h1>
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100vh", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {parkingSpots.map(spot => (
          <Marker key={spot.id} position={[spot.lat, spot.lng]}>
            <Popup>
              Parking Spot {spot.id}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapPage;