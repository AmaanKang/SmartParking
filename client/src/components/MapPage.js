import React, {useEffect, useState} from 'react';
import {Stage, Layer, Rect, Text} from 'react-konva';

function MapPage() {
  // TODO: Fetch the available parking spots from the server
  /**
   * const [parkingSpots, setParkingSpots] = useState([]);

  useEffect(() => {
    // TODO: Replace with server's URL
    fetch('https://server.com/api/parking-spots')
      .then(response => response.json())
      .then(data => setParkingSpots(data));
  }, []);
   */
  const parkingSpots = [
    { spotId: 'A1', status: 'free', lat: 43.675396, lng: -79.633214 },
    { spotId: 'A2', status: 'occupied', lat: 43.675396, lng: -79.633214 },
    { spotId: 'A3', status: 'free', lat: 43.675396, lng: -79.633214 },
    { spotId: 'B1', status: 'occupied', lat: 43.675396, lng: -79.633214 },
    { spotId: 'B2', status: 'free', lat: 43.675396, lng: -79.633214 },
    { spotId: 'B3', status: 'free', lat: 43.675396, lng: -79.633214 },
    { spotId: 'C1', status: 'occupied', lat: 43.675396, lng: -79.633214 },
    { spotId: 'C2', status: 'free', lat: 43.675396, lng: -79.633214 },
    { spotId: 'C3', status: 'free', lat: 43.675396, lng: -79.633214 },
    // Add more parking spots here
  ];

  return (
    <div>
      <h1>Parking Spots Map</h1>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
        {parkingSpots.map((parkingSpot) => {
            // Parse the spot ID to get the row and column
            const column = parkingSpot.spotId.charCodeAt(0) - 'A'.charCodeAt(0);
            const row = parseInt(parkingSpot.spotId.slice(1)) - 1;

            return (
              <React.Fragment key={parkingSpot.spotId}>
                <Rect
                  x={100 + column * 110} // Adjust the x position based on the column
                  y={100 + row * 60} // Adjust the y position based on the row
                  width={100}
                  height={50}
                  fill={parkingSpot.status === 'free' ? 'green' : 'red'}
                  stroke='black'
                  strokeWidth={4}
                />
                <Text
                  x={100 + column * 110} // Adjust the x position based on the column
                  y={120 + row * 60} // Adjust the y position based on the row
                  text={`Spot ${parkingSpot.spotId}`}
                  fontSize={20}
                  width={100}
                  align='center'
                />
              </React.Fragment>
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
}

export default MapPage;