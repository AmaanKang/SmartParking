const express = require('express');
const router = express.Router();
const parkingSpotController = require('../controllers/parkingSpotController');

console.log("I am parking spot routes");
// Route to get all parking spots
router.get('/',parkingSpotController.getAllParkingSpots);

// Route to add a new parking spot
router.post('/',parkingSpotController.addParkingSpot);

module.exports = router;
