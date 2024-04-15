const Sensor = require('../models/sensor');
const parkingSpot = require('../models/parkingSpot');

// Get all sensors
exports.getAllSensors = async(req, res) => {
    try{
        const sesors = await Sensor.find();
        res.json(sensors);
    } catch (err){
        res.status(500).json({message: err.message});
    }
};

// Add a new sensor
exports.addSensor = async(req, res) => {
    const sensor = new Sensor({
        sensorId: req.body.sensorId,
        parkingSpot: req.body.parkingSpot
    });

    try{
        const newSensor = await sensor.save();
        res.status(201).json(newSensor);
    } catch(err){
        res.status(400).json({message: err.message});
    }
};

// Find the parking spot status
exports.findParkingSpotStatus = async(req, res) => {
    try{
        const currentSpot = await parkingSpot.findOne({spotId: req.body.spotId});
        const sensor = await Sensor.findOne({parkingSpot: currentSpot});
        currentSpot.status = sensor.parkingStatus;
        currentSpot.save();
        res.json(parkingSpot);
    } catch(err){
        res.status(404).json({message: err.message});
    }
}