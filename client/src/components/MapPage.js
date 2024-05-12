import React, {useEffect, useState} from 'react';
import {Stage, Layer, Rect, Text, Circle} from 'react-konva';
import './MapPage.css';
import Modal from 'react-modal';
import io from 'socket.io-client';

// To make sure that the modals are having app root element as the actual parent
Modal.setAppElement('#root');

function MapPage({isAdmin}) {
  const baseUrl = window.location.origin;
    const [nearestSpot, setNearestSpot] = useState(null);
    const [parkingSpots, setParkingSpots] = useState([]);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showRemovePopup, setShowRemovePopup] = useState(false);
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const [spotId, setSpotId] = useState('');
    const [subCol, setSubCol] = useState('left');
    const [status, setStatus] = useState('free');
    const [openEntrancePopup, setOpenEntrancePopup] = useState(false);
    const [carPositionX, setCarPositionX] = useState(600);
    const [carPositionY, setCarPositionY] = useState(600);
    const [occupiedCount, setOccupiedCount] = useState(0);
    const [freeCount, setFreeCount] = useState(0);
    const [showBookingPopup, setShowBookingPopup] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [emailAddress, setEmailAddress] = useState('');
    const [message, setMessage] = useState('');

    // All variables are dependent on the lotWidth. If the parking lot size needs to be controlled, just change lotWidth
    const lotWidth = 80;
    const lotHeight = lotWidth / 2;
    const xMultiplier = lotWidth * 2 + lotWidth / 3;
    const xNum = lotWidth / 6;
    const yNum = lotWidth;
    const yMultiplier = lotWidth / 2;
    
    // Access all bookings saved in database. These bookings consist of the registrations that customers have made before coming to parking lot
    function getAllBookings(){
      fetch('http://localhost:3000/api/parking-spots/user')
      .then(response => response.json())
      .then(data => {
        setBookings(data);
      });
    }

  // The spots are fetched from backend every time there is a change on the page
  useEffect(() => {
    // Get the updatedSpots from the parking lot based on the sensors data captured
    const socket = io('http://localhost:3000');


    socket.on('update', (updatedSpots) => {
      console.log("Inside map page socket");
      setParkingSpots(updatedSpots);
    });
      fetch('http://localhost:3000/api/parking-spots')
      .then(response => response.json())
      .then(data => {
        setParkingSpots(data);
      })
      .then(getAllBookings());

      // Disconnect the socket at the end of the function call
    return () => {
      socket.disconnect();
    };
  },[]);


  // Calculate the nearest spot after any change in the parkingSpots array
  useEffect(() => {
    // Find the nearest free parking spot to the car
    let nearest = null;
    let minDistance = Infinity;
    var occupied = 0;
    var free = 0;
    parkingSpots.forEach(spot => {
      if(spot.status === 'free') {
          free++;
          const col = spot.spotId.charCodeAt(0) - 'A'.charCodeAt(0);
          const r = parseInt(spot.spotId.slice(1) - 1);
          let rightCol = spot.subColumn === 'right' ? lotWidth : 0;
          const spotPosition = {x: xNum + col * xMultiplier + rightCol, y: yNum + r * yMultiplier};
          const distance = Math.hypot(carPositionX - spotPosition.x, carPositionY - spotPosition.y);
          if(distance < minDistance) {
              minDistance = distance;
              nearest = spot;
          }
      }else{
        occupied++;
      }
    });
    setOccupiedCount(occupied);
    setFreeCount(free);
    setNearestSpot(nearest);

  },[parkingSpots,carPositionX,carPositionY]);

  // Add Parking Spot once the Add Parking Spot form is submitted
  function addParkingSpot(spotId, subCol){
    fetch('http://localhost:3000/api/parking-spots/admin/add', {
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

  // Delete the Parking Spot once the Delete Parking Spot form is submitted
  function removeParkingSpot(spotId, subCol){
    fetch('http://localhost:3000/api/parking-spots/admin/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({spotId, subCol})
    }).then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
        });
      }
      return response.json();
    })
    .then(data => {
      const updatedSpots = parkingSpots.filter(spot => spot.spotId !== data.spotId || spot.subColumn !== data.subColumn);
      setParkingSpots(updatedSpots);
      setSpotId('');
      setSubCol('left');
    })
    .catch(error => console.log('There was a problem with the fetch operation: ' + error.message));
  }

  // Update the status of a parking spot based on the request sent
  function updateParkingSpot(spotId, subCol, status){
    fetch('http://localhost:3000/api/parking-spots/admin/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({spotId, subCol, status})
    }).then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
        });
      }
      return response.json();
    })
    .then(data => {
      const updatedSpots = parkingSpots.filter(spot => spot.spotId !== data.spotId || spot.subColumn !== data.subColumn);
      setParkingSpots([...updatedSpots, data]);
      setSpotId('');
      setSubCol('left');
      setStatus('free');
    })
    .catch(error => console.log('There was a problem with the fetch operation: ' + error.message));
  }

  // Access one booking based on the email address that user has entered
  function getOneBooking(emailAddress){
    fetch('http://localhost:3000/api/parking-spots/user/'+emailAddress)
    .then(response => response.json())
    .then(data => {
      if(data != null){
        setMessage("Please go ahead and park at the green spot....");
      }else{
        setMessage("We cannot find any booking associated with this email address....");
      }
    });
  }

  // Run this function when any of the admin hyperlinks are clicked on the page
  function openAdminPopup(type){
    if(type === 'add'){
      setShowAddPopup(true);
      setShowRemovePopup(false);
      setShowUpdatePopup(false);
    }
    else if(type === 'remove'){
      setShowRemovePopup(true);
      setShowAddPopup(false);
      setShowUpdatePopup(false);
    }
    else{
      setShowUpdatePopup(true);
      setShowAddPopup(false);
      setShowRemovePopup(false);
    }
  }

  // Run this function when the user clicks on Close button to close the current Admin Form
  function closeAdminPopup(type){
    if(type === 'add'){
      setShowAddPopup(false);
    }
    else if(type === 'remove'){
      setShowRemovePopup(false);
    }
    else{
      setShowUpdatePopup(false);
    }
  }

  // The admins can change the entrance location by using pixel values.
  function changeEntrance(){
    setOpenEntrancePopup(true);
  }

  // When the users want to access their booking after reaching the parking lot, they can submit email address to do so.
  function openBookingPopup(){
    setShowBookingPopup(true);
  }
  
  // All below functions are used to handle the form submission and call the appropriate function
  function handleAddSubmit(e){
    e.preventDefault();
    addParkingSpot(spotId, subCol);
    closeAdminPopup('add');
  }
  function handleRemoveSubmit(e){
    e.preventDefault();
    removeParkingSpot(spotId, subCol);
    closeAdminPopup('remove');
  }
  function handleUpdateSubmit(e){
    e.preventDefault();
    updateParkingSpot(spotId, subCol, status);
    closeAdminPopup('update');
  }
  function handleBookingSubmit(e){
    e.preventDefault();
    const bookingGet = getOneBooking(emailAddress);
  }

  return (
    <div className='map-page'>
      <h1>Parking Spots</h1>
      <div className='home-link'>
      <a href={baseUrl}>Go to Home</a>
      </div>
      
      {/**
       * Below buttons will only show up if it is an admin logged into the application.
       */
      isAdmin &&(
        
        <div className="admin-link">
          
            <ul style={{ listStyleType: "none", padding: 0 }}>
              <li><a href="#" onClick={() => openAdminPopup('add')}>New Parking Spot</a></li>
              <li><a href="#" onClick={() => openAdminPopup('remove')}>Remove Parking Spot</a></li>
              <li><a href="#" onClick={() => openAdminPopup('update')}>Update Parking Spot</a></li>
              <li><a href="#" onClick={() => changeEntrance()}>Change the Entrance</a></li>
              <br/><br/>
            </ul>
        </div>
      )}

      {/**
       * The modals will show up depending on which button or hyperlink the admin clicks on
       */
      showAddPopup && (
        <div className='add-popup'>
          <Modal
          isOpen={showAddPopup}
          onRequestClose={() => closeAdminPopup('add')}
          contentLabel='Add Parking Spot'
          className='add-popup'
          >
            <h2>Add Parking Spot</h2>
            <form onSubmit={handleAddSubmit}>
              <label>
              Enter Spot Id: <input type="text" value={spotId} onChange={e => setSpotId(e.target.value)} placeholder="Spot Id"/> i.e. A8
              </label>
             <label>
             Select column:
              <select value={subCol} onChange={e => setSubCol(e.target.value)}>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
             </label>
              <button type="submit" className='submit-button'>Submit</button>
              <button onClick={() => closeAdminPopup('add')} className='close-button'>Close</button>
            </form>
            
          </Modal>
        </div>

      )}

      {showRemovePopup && (
        <div className="remove-popup">
          <Modal
          isOpen={showRemovePopup}
          onRequestClose={() => closeAdminPopup('remove')}
          contentLabel='Remove Parking Spot'
          className='remove-popup'
          >
            <h2>Remove Parking Spot</h2>
            <form onSubmit={handleRemoveSubmit}>
              <label>
              Enter Spot Id: <input type="text" value={spotId} onChange={e => setSpotId(e.target.value)} placeholder="Spot Id"/>
              </label>
              <label>
              Select column:
              <select value={subCol} onChange={e => setSubCol(e.target.value)}>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
              </label>
              <button type="submit" className='submit-button'>Submit</button>
              <button onClick={() => closeAdminPopup('remove')} className='close-button'>Close</button>
            </form>
          </Modal>
        </div>
      )}

      {showUpdatePopup && (
        <div className="update-popup">
          <Modal
          isOpen={showUpdatePopup}
          onRequestClose={() => closeAdminPopup('update')}
          contentLabel='Update Parking Spot'
          className='update-popup'
          >
            <h2>Update Parking Spot</h2>
            <form onSubmit={handleUpdateSubmit}>
              <label>
              Enter Spot Id: <input type="text" value={spotId} onChange={e => setSpotId(e.target.value)} placeholder="Spot Id"/>
              </label>
              <label>
              Select column:
              <select value={subCol} onChange={e => setSubCol(e.target.value)}>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
              </label>
              <label>
              Select Parking Status:
              <select value={status} onChange={e => setStatus(e.target.value)}>
                <option value="free">Free</option>
                <option value="occupied">Occupied</option>
                <option value="reserved">Reserved</option>
              </select>
              </label>
              <button type="submit" className='submit-button'>Submit</button>
              <button onClick={() => closeAdminPopup('update')} className='close-button'>Close</button>
            </form>
          </Modal>
          
        </div>

      )}

      {openEntrancePopup && (
        <div className="entrance-popup">
          <Modal
          isOpen={openEntrancePopup}
          onRequestClose={() => setOpenEntrancePopup(false)}
          contentLabel='Change Entrance'
          className='entrance-popup'
          >
            <h2>Change Entrance</h2>
            <span>If the current parking entrance is incorrect, change it by entering the
            x and y coordinates of the entrance position. The entrance is indicated by yellow circle.</span>
            <form>
              <label>
              Enter x coordinate: <input type="number" value={carPositionX} onChange={e => setCarPositionX(e.target.value)} placeholder="x coordinate"/>
              </label>
              <label>
              Enter y coordinate: <input type="number" value={carPositionY} onChange={e => setCarPositionY(e.target.value)} placeholder="y coordinate"/>
              </label>
              <button onClick={() => setOpenEntrancePopup(false)} className='close-button'>Close</button>
            </form>
          </Modal>
        </div>
      )}

      {showBookingPopup && (
          <div className="booking-popup">
            <Modal
              isOpen={showBookingPopup}
              onRequestClose={() => setShowBookingPopup(false)}
              contentLabel='Book a Parking Spot'
              style={{
                content:{
                  top: '30%',
                  left:'30%',
                  right:'auto',
                  bottom: 'auto'
                }
              }}
            >
              <h2>Access a Parking Spot Booking</h2>
              <form onSubmit={handleBookingSubmit}>
                Enter your email: <input type="email" value={emailAddress} onChange={e => setEmailAddress(e.target.value)} placeholder="Email"/>
                <br/>
                <button type="submit" className='submit-button'>Submit</button>
                <button onClick={() => {
                setShowBookingPopup(false);
                setMessage('');
                setEmailAddress('');
              }} className='close-button'>Close</button>
              </form>
              <p>{message}</p>
            </Modal>
          </div>
        )
      }

      {// If the bookings have exceeded the available spots, then no new cars can enter the lot
      (freeCount <= bookings.length) && (
        <div>
          <h2 style={{color:"red"}}>There are no available parking spots at the minute. Sorry for any inconvenience...</h2>
        </div>
      )}

      {// If the spots are plenty for the bookings made, then new cars can enter the lot and use that for parking
      (freeCount > bookings.length) && (
        <div>
          <p>The red parking spots have cars parked in there, the white ones are available, green one is the suggested parking spot for you.</p>
      <p>Number of occupied spots: {occupiedCount}</p>
      <p>Number of free spots: {freeCount}</p>
      {/*<a href="#" onClick={() => openBookingPopup()}>Access a Parking Spot Booking</a>*/}
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
            {/* Draw the car */}
            <Circle
                x={carPositionX}
                y={carPositionY}
                radius={50}
                fill='yellow'
                stroke='black'
                strokeWidth={2}
            />
            <Text
                  x={carPositionX-30}
                  y={carPositionY}
                  text='Entrance'
                  fontSize={15}
                  align='center'
                />
        {parkingSpots.map((parkingSpot) => {
            // Parse the spot ID to get the row and column
            const column = parkingSpot.spotId.charCodeAt(0) - 'A'.charCodeAt(0);
            const row = parseInt(parkingSpot.spotId.slice(1)) - 1;
            //If the current column is on right, then the lot should be drawn after left column, so adjust the x position by adding lotWidth to it.
            let rightColumn = parkingSpot.subColumn === 'right' ? lotWidth : 0;
            const fillColor = parkingSpot === nearestSpot ? 'green' : (parkingSpot.status === 'free' ? 'white' : (parkingSpot.status === 'reserved' ? 'yellow' : 'red'));
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
      )}
    </div>
  );
}

export default MapPage;