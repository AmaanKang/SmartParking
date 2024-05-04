const mongoose = require('mongoose');

// Create schema for the Parking Spot Reservation
const BookingSchema = new mongoose.Schema({
    email: {type: String, required: true}
});

module.exports = mongoose.model('bookings',BookingSchema);