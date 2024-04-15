const mongoose = require('mongoose');

// Create schema for the Parking Spot Collection
const ParkingSpotSchema = new mongoose.Schema({
    spotId:{type: String, required: true, unique: true},
    subColumn:{type: String, required: true, enum: ['left', 'right']},
    status: {type: String, default: 'free', enum: ['free','occupied']}
});

module.exports = mongoose.model('ParkingSpots',ParkingSpotSchema);