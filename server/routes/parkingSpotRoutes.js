const express = require('express');
const router = express.Router();
const { getAllParkingSpots, addParkingSpot, removeParkingSpot, updateParkingSpot } = require('../controllers/parkingSpotController');
const isAdmin = require('./middleware');

// Route to get all parking spots
router.get('/', getAllParkingSpots);

// Admin Routes
// TODO: Check if the user accessing these routes is logged in as admin
router.post('/admin', addParkingSpot);
router.delete('/admin', removeParkingSpot);
router.put('/admin', updateParkingSpot);

module.exports = router;
