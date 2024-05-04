const mongoose = require('mongoose');

// Create schema for the Parking Spot Reservation
const BookingSchema = new mongoose.Schema({
    parkingSpot: {type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSpot'},
    email: {type: String, required: true}
});

module.exports = mongoose.model('ParkingSpots',ParkingSpotSchema);