import React, {useEffect, useState} from 'react';
import {Stage, Layer, Rect, Text, Circle} from 'react-konva';

function MapPage() {
    const [nearestSpot, setNearestSpot] = useState(null);
    const [parkingSpots, setParkingSpots] = useState([]);
    // All variables are dependent on the lotWidth. If the parking lot size needs to be controlled, just change lotWidth
    const lotWidth = 80;
    const lotHeight = lotWidth / 2;
    const xMultiplier = lotWidth * 2 + lotWidth / 3;
    const xNum = lotWidth / 6;
    const yNum = lotWidth;
    const yMultiplier = lotWidth / 2;
    const carPosition = {x: 400, y: 500};
    
  /**
  useEffect(() => {
    fetch('https://server.com/api/parking-spots')
      .then(response => response.json())
      .then(data => setParkingSpots(data));
  }, []);
   */
  useEffect(() => {
    const spots = [
        { spotId: 'A1', subColumn: 'left', status: 'free'},
        { spotId: 'A1', subColumn: 'right', status: 'free'},
        { spotId: 'A2', subColumn: 'left', status: 'occupied' },
        { spotId: 'A2', subColumn: 'right', status: 'free'},
        { spotId: 'A3', subColumn: 'left', status: 'free' },
        { spotId: 'A3', subColumn: 'right', status: 'occupied'},
        { spotId: 'B1', subColumn: 'left', status: 'occupied'},
        { spotId: 'B1', subColumn: 'right', status: 'free'},
        { spotId: 'B2', subColumn: 'left', status: 'free'},
        { spotId: 'B2', subColumn: 'right', status: 'occupied'},
        { spotId: 'B3', subColumn: 'left', status: 'free'},
        { spotId: 'B3', subColumn: 'right', status: 'occupied'},
        { spotId: 'C1', subColumn: 'left', status: 'occupied'},
        { spotId: 'C2', subColumn: 'left', status: 'free'},
        { spotId: 'C3', subColumn: 'left', status: 'occupied'},
        { spotId: 'C1', subColumn: 'right', status: 'free'},
        { spotId: 'C2', subColumn: 'right', status: 'free'},
        { spotId: 'C3', subColumn: 'right', status: 'occupied'},
        { spotId: 'D1', subColumn: 'left', status: 'free'},
        { spotId: 'D2', subColumn: 'left', status: 'free'},
        { spotId: 'D3', subColumn: 'left',status: 'occupied'},
        { spotId: 'D1', subColumn: 'right', status: 'free'},
        { spotId: 'D2', subColumn: 'right', status: 'occupied'},
        { spotId: 'D3', subColumn: 'right',status: 'free'},
        
        // Add more parking spots here
      ];
      setParkingSpots(spots);
      // Find the nearest free parking spot to the car
      let nearest = null;
      let minDistance = Infinity;
      spots.forEach(spot => {
        if(spot.status === 'free') {
            const col = spot.spotId.charCodeAt(0) - 'A'.charCodeAt(0);
            const r = parseInt(spot.spotId.slice(1) - 1);
            let rightCol = spot.subColumn === 'right' ? lotWidth : 0;
            const spotPosition = {x: xNum + col * xMultiplier + rightCol, y: yNum + r * yMultiplier};
            const distance = Math.abs(carPosition.x - spotPosition.x) + Math.abs(carPosition.y - spotPosition.y);
            if(distance < minDistance) {
                minDistance = distance;
                nearest = spot;
            }
        }
      });
      setNearestSpot(nearest);
  },[]);


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
            //If the current column is on right, then the lot should be drawn after left column, so adjust the x position by adding lotWidth to it.
            let rightColumn = parkingSpot.subColumn === 'right' ? lotWidth : 0;
            const fillColor = parkingSpot === nearestSpot ? 'green' : (parkingSpot.status === 'free' ? 'white' : 'red');
            return (
              <React.Fragment key={parkingSpot.spotId+parkingSpot.subColumn}>
                {/* Draw the parking spots */}
                <Rect
                  x={xNum + column * (xMultiplier) + rightColumn} // Adjust the x position based on the column
                  y={yNum + row * yMultiplier} // Adjust the y position based on the row
                  width={lotWidth}
                  height={lotHeight}
                  fill={fillColor}
                  stroke='black'
                  strokeWidth={4}
                />
                <Text
                  x={xNum + column * (xMultiplier) + xNum + rightColumn} // Adjust the x position based on the column
                  y={yNum + row * yMultiplier + xNum} // Adjust the y position based on the row
                  text={parkingSpot.spotId}
                  fontSize={15}
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