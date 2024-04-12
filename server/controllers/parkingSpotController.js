const ParkingSpot = require('../models/parkingSpot');

// Get all parking spots in a lot
exports.getAllParkingSpots = async(req, res) => {
    try{
        const parkingSpots = await ParkingSpot.find();
        res.json(parkingSpots);
    } catch(err){
        res.status(500).json({message: err.message});
    }
};

// Add a new parking spot
exports.addParkingSpot = async(req, res) => {
    const parkingSpot = new ParkingSpot({
        spotId: req.body.spotId,
        location: req.body.location
    });

    try{
        const newParkingSpot = await parkingSpot.save();
        res.status(201).json(newParkingSpot);
    } catch(err){
        res.status(400).json({message: err.message});
    }
};

