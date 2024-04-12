const Sensor = require('../models/sensor');

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