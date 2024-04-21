const express = require('express');
const router = express.Router();
const { getAllParkingSpots, addParkingSpot, removeParkingSpot, updateParkingSpot } = require('../controllers/parkingSpotController');
const isAdmin = require('./middleware');
const parkingSpot = require('../models/parkingSpot');

// Route to get all parking spots
router.get('/', getAllParkingSpots);

// Admin Routes
// TODO: Check if the user accessing these routes is logged in as admin
router.post('/admin', addParkingSpot);
router.delete('/admin', removeParkingSpot);
router.put('/admin', updateParkingSpot);

// Route to update parking spot status
// TODO: Modify the function to get the data from sensor
router.put('/:spotId/status', async (req, res) => {
    try {
      // Get sensor data from request body
      const sensorData = req.body.sensorData;
  
      // Determine status based on sensor data
      const status = sensorData.carPresent ? 'occupied' : 'free';
  
      // Update parking spot status in database
      const parkingSpot = await ParkingSpot.findOneAndUpdate(
        { spotId: req.params.spotId },
        { status: status },
        { new: true }
      );
  
      res.json(parkingSpot);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;
