const mongoose = require('mongoose');

// Create schema for the Weekly data collection
const WeeklyDataSchema = new mongoose.Schema({
    parkingSpot: {type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSpot'},
    sunday:{type: [Number]},
    monday: {type: [Number]},
    tuesday: {type: [Number]},
    wednesday: {type: [Number]},
    thursday: {type: [Number]},
    friday: {type: [Number]},
    saturday: {type: [Number]}
});

module.exports = mongoose.model('WeeklyData',WeeklyDataSchema);