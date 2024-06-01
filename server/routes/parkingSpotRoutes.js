const express = require('express');
const router = express.Router();
const fs = require('fs');
const { getAllParkingSpots, addParkingSpot, removeParkingSpot, updateParkingSpot } = require('../controllers/parkingSpotController');
const { getAllBookings, addBooking, getOneBooking } = require('../controllers/bookingController');
const { getWeeklyData } = require('../controllers/weeklyDataController');

// Route to get all parking spots
router.get('/', getAllParkingSpots);

// Admin Routes
// TODO: Check if the user accessing these routes is logged in as admin
router.post('/admin/add/', addParkingSpot);
router.delete('/admin/delete/', removeParkingSpot);
router.put('/admin/update/', updateParkingSpot);
router.get('/admin/analytics/', getWeeklyData);
router.get('/admin/predictions/', (req,res) => {
  fs.readFile('./future_predictions.json', 'utf8', (err, data) => {
      if(err) {
          console.log(err);
          return
      }
      else{
          let predictions = [];
          const eachDayPredictions = JSON.parse(data);
          let hourlyTotal = 0;
          for(let i = 0; i < 24; i++){
              for(let j = 0; j+i < 168; j += 24){
                  hourlyTotal += eachDayPredictions[j+i];
              }
              predictions.push(hourlyTotal/7);
              hourlyTotal = 0;
          }
          res.send(predictions);
      }
  });
});

// User routes
router.get('/user/', getAllBookings);
router.post('/user/add/', addBooking);
router.get('/user/:email', getOneBooking);

module.exports = router;
