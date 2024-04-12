const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');

// Route to get all sensors
router.get('/',sensorController.getAllSensors);

// Route to add a new sensor
router.post('/',sensorController.addSensor);

module.exports = router;