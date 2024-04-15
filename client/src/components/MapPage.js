import React, {useEffect, useState} from 'react';
import {Stage, Layer, Rect, Text, Circle} from 'react-konva';

function MapPage() {
    const [nearestSpot, setNearestSpot] = useState(null);
    const [parkingSpots, setParkingSpots] = useState([]);
  /**
  useEffect(() => {
    fetch('https://server.com/api/parking-spots')
      .then(response => response.json())
      .then(data => setParkingSpots(data));
  }, []);
   */
  useEffect(() => {
    const spots = [
        { spotId: 'A1', status: 'free', lat: 43.675396, lng: -79.633214 },
        { spotId: 'A2', status: 'occupied', lat: 43.675396, lng: -79.633214 },
        { spotId: 'A3', status: 'free', lat: 43.675396, lng: -79.633214 },
        { spotId: 'B1', status: 'occupied', lat: 43.675396, lng: -79.633214 },
        { spotId: 'B2', status: 'free', lat: 43.675396, lng: -79.633214 },
        { spotId: 'B3', status: 'free', lat: 43.675396, lng: -79.633214 },
        { spotId: 'C1', status: 'occupied', lat: 43.675396, lng: -79.633214 },
        { spotId: 'C2', status: 'free', lat: 43.675396, lng: -79.633214 },
        { spotId: 'C3', status: 'occupied', lat: 43.675396, lng: -79.633214 },
        { spotId: 'D1', status: 'free', lat: 43.675396, lng: -79.633214 },
        { spotId: 'D2', status: 'free', lat: 43.675396, lng: -79.633214 },
        { spotId: 'D3', status: 'occupied', lat: 43.675396, lng: -79.633214 },
        { spotId: 'E1', status: 'free', lat: 43.675396, lng: -79.633214 },
        { spotId: 'E2', status: 'free', lat: 43.675396, lng: -79.633214 },
        { spotId: 'E3', status: 'occupied', lat: 43.675396, lng: -79.633214 },
        { spotId: 'F1', status: 'free', lat: 43.675396, lng: -79.633214 },
        { spotId: 'F2', status: 'occupied', lat: 43.675396, lng: -79.633214 },
        { spotId: 'F3', status: 'free', lat: 43.675396, lng: -79.633214 },
        // Add more parking spots here
      ];
      setParkingSpots(spots);
      console.log(spots.length);
      // Find the nearest free parking spot to the car
      let nearest = null;
      let minDistance = Infinity;
      spots.forEach(spot => {
        if(spot.status === 'free') {
            const col = spot.spotId.charCodeAt(0) - 'A'.charCodeAt(0);
            const r = parseInt(spot.spotId.slice(1) - 1);
            const spotPosition = {x: xNum + col * xMultiplier, y: yNum + r * yMultiplier};
            const distance = Math.hypot(spotPosition.x - carPosition.x, spotPosition.y - carPosition.y);
            if(distance < minDistance) {
                minDistance = distance;
                nearest = spot;
                console.log(nearest.spotId.toString());
            }
        }
      });
      setNearestSpot(nearest);
  },[]);
  
  const xNum = 10;
  const yNum = 70;
  const xMultiplier = 130;
  const yMultiplier = 80;
  const carPosition = {x: 400, y: 500};

  return (
    <div>
      <h1>Parking Spots Map</h1>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
            {/* Draw the car */}
            <Circle
                x={carPosition.x}
                y={carPosition.y}
                radius={20}
                fill='yellow'
                stroke='black'
                strokeWidth={2}
            />
        {parkingSpots.map((parkingSpot) => {
            // Parse the spot ID to get the row and column
            const column = parkingSpot.spotId.charCodeAt(0) - 'A'.charCodeAt(0);
            const row = parseInt(parkingSpot.spotId.slice(1)) - 1;
            const fillColor = parkingSpot === nearestSpot ? 'green' : (parkingSpot.status === 'free' ? 'white' : 'red');
            return (
              <React.Fragment key={parkingSpot.spotId}>
                {/* Draw the parking spots */}
                <Rect
                  x={xNum + column * xMultiplier} // Adjust the x position based on the column
                  y={yNum + row * yMultiplier} // Adjust the y position based on the row
                  width={100}
                  height={50}
                  fill={fillColor}
                  stroke='black'
                  strokeWidth={4}
                />
                <Text
                  x={xNum + column * xMultiplier + 10} // Adjust the x position based on the column
                  y={yNum + row * yMultiplier + 10} // Adjust the y position based on the row
                  text={parkingSpot.spotId}
                  fontSize={20}
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