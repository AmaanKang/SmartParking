import React, {useEffect, useState} from 'react';
import {Stage, Layer, Rect, Text, Circle} from 'react-konva';

function MapPage(isAdmin) {
    const [nearestSpot, setNearestSpot] = useState(null);
    const [parkingSpots, setParkingSpots] = useState([]);
    const [showAdminPopup, setShowAdminPopup] = useState(false);
    const [showRemovePopup, setShowRemovePopup] = useState(false);
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const [spotId, setSpotId] = useState('');
    const [subCol, setSubCol] = useState('left');

    // All variables are dependent on the lotWidth. If the parking lot size needs to be controlled, just change lotWidth
    const lotWidth = 80;
    const lotHeight = lotWidth / 2;
    const xMultiplier = lotWidth * 2 + lotWidth / 3;
    const xNum = lotWidth / 6;
    const yNum = lotWidth;
    const yMultiplier = lotWidth / 2;
    const carPosition = {x: 400, y: 500};
    
  useEffect(() => {
      fetch('http://localhost:3000/api/parking-spots')
      .then(response => response.json())
      .then(data => {
        setParkingSpots(data);
      });
  },[]);

  useEffect(() => {
    // Find the nearest free parking spot to the car
    let nearest = null;
    let minDistance = Infinity;
    parkingSpots.forEach(spot => {
      if(spot.status === 'free') {
          const col = spot.spotId.charCodeAt(0) - 'A'.charCodeAt(0);
          const r = parseInt(spot.spotId.slice(1) - 1);
          let rightCol = spot.subColumn === 'right' ? lotWidth : 0;
          const spotPosition = {x: xNum + col * xMultiplier + rightCol, y: yNum + r * yMultiplier};
          const distance = Math.hypot(carPosition.x - spotPosition.x, carPosition.y - spotPosition.y);
          if(distance < minDistance) {
              minDistance = distance;
              nearest = spot;
          }
      }
    });
    setNearestSpot(nearest);
  },[parkingSpots]);

  function openAdminPopup(type){
    console.log(type);
    if(type === 'add'){
      console.log("this is add");
      setShowAdminPopup(true);
    }
    else if(type === 'remove'){
      setShowRemovePopup(true);
    }
    else{
      setShowUpdatePopup(true);
    }
  }

  function closeAdminPopup(type){
    if(type === 'add'){
      setShowAdminPopup(false);
    }
    else if(type === 'remove'){
      setShowRemovePopup(false);
    }
    else{
      setShowUpdatePopup(false);
    }
  }

  function addParkingSpot(spotId, subCol){
    fetch('http://localhost:3000/api/parking-spots/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({spotId, subCol})
    })
    .then(response => response.json())
    .then(data => {
      setParkingSpots([...parkingSpots, data]);
      setSpotId('');
      setSubCol('left');
    });
  }

  function handleAddSubmit(e){
    e.preventDefault();
    console.log(spotId);
    console.log(subCol);
    addParkingSpot(spotId, subCol);
    closeAdminPopup();
  }
  function handleRemoveSubmit(e){
    e.preventDefault();
    console.log(spotId);
    console.log(subCol);
    //addParkingSpot(spotId, subCol);
    closeAdminPopup();
  }
  function handleUpdateSubmit(e){
    e.preventDefault();
    console.log(spotId);
    console.log(subCol);
    //addParkingSpot(spotId, subCol);
    closeAdminPopup();
  }

  return (
    <div>
      <h1>Parking Spots Map</h1>
      {isAdmin &&(
        <div className="admin-link">
          <a href="#" onClick={() => openAdminPopup('add')}>New Parking Spot</a> <br/>
          <a href="#" onClick={() => openAdminPopup('remove')}>Remove Parking Spot</a> <br/>
          <a href="#" onClick={() => openAdminPopup('update')}>Update Parking Spot</a>
        </div>
      )}

      {showAdminPopup && (
        <div className="add-popup">
          <h2>Add Parking Spot</h2>
            <form onSubmit={handleAddSubmit}>
              Enter Spot Id: <input type="text" value={spotId} onChange={e => setSpotId(e.target.value)} placeholder="Spot Id"/>
              <br/>
              Select column:
              <select value={subCol} onChange={e => setSubCol(e.target.value)}>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
              <br/>
              <button type="submit">Submit</button>

            </form>
            <button onClick={closeAdminPopup('add')}>Close</button>
        </div>

      )}

      {showRemovePopup && (
        <div className="remove-popup">
          <h2>Remove Parking Spot</h2>
            <form onSubmit={handleRemoveSubmit}>
              Enter Spot Id: <input type="text" value={spotId} onChange={e => setSpotId(e.target.value)} placeholder="Spot Id"/>
              <br/>
              Select column:
              <select value={subCol} onChange={e => setSubCol(e.target.value)}>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
              <br/>
              <button type="submit">Submit</button>

            </form>
            <button onClick={closeAdminPopup('remove')}>Close</button>
        </div>

      )}

      {showUpdatePopup && (
        <div className="update-popup">
          <h2>Update Parking Spot</h2>
            <form onSubmit={handleUpdateSubmit}>
              Enter Spot Id: <input type="text" value={spotId} onChange={e => setSpotId(e.target.value)} placeholder="Spot Id"/>
              <br/>
              Select column:
              <select value={subCol} onChange={e => setSubCol(e.target.value)}>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
              <br/>
              <button type="submit">Submit</button>

            </form>
            <button onClick={closeAdminPopup('update')}>Close</button>
        </div>

      )}

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