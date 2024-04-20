const express = require('express');
const router = express.Router();
const parkingSpotController = require('../controllers/parkingSpotController');

// Route to get all parking spots
router.get('/',parkingSpotController.getAllParkingSpots);

// Route to add a new parking spot
router.post('/',parkingSpotController.addParkingSpot);

// Controller functions
const { addParkingSpot, removeParkingSpot, updateParkingSpot } = require('../controllers/adminController');

// Routes
router.post('/admin/parking-spots', addParkingSpot);
router.delete('/admin/parking-spots/:id', removeParkingSpot);
router.put('/admin/parking-spots/:id', updateParkingSpot);

module.exports = router;
