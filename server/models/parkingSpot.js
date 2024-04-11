const mongoose = require('mongoose');

// Create schema for the Parking Spot Collection
const ParkingSpotSchema = new mongoose.Schema({
    spotId:{type: String, required: true, unique: true},
    status: {type: String, default: 'free', enum: ['free','occupied']},
    location: {
        lat: {type: Number, required: true},
        lng: {type: Number, required: true}
    }
});

module.exports = mongoose.model('ParkingSpot',ParkingSpotSchema);