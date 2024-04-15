const mongoose = require('mongoose');

// Create schema for the Sensor collection
const SensorSchema = new mongoose.Schema({
    sensorId: {type: String, required: true, unique: true},
    parkingSpot: {type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSpot'},
    status: {type: String, default: 'working', enum: ['working','not working']},
    parkingStatus: {type: String, default: 'free', enum: ['free','occupied']}
});

module.exports = mongoose.model('Sensors', SensorSchema);