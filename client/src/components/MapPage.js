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
    // Add more parking spots here
  ];

  return (
    <div>
      <h1>Parking Spots Map</h1>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {parkingSpots.map((parkingSpot,index) => (
            <React.Fragment key={parkingSpot.spotId}>
            <Rect
              x={100}
              y={100}
              width={100}
              height={50}
              fill={parkingSpot.status === 'free' ? 'green' : 'red'}
              stroke='black'
              strokeWidth={4}
            />
            <Text
                x={50}
                y={120}
                text={`Spot ${parkingSpot.spotId}`}
                fontSize={20}
                width={200}
                align='center'
            />
            </React.Fragment>
            
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

export default MapPage;