const ParkingSpot = require('../models/parkingSpot');

// Get all parking spots in a lot
exports.getAllParkingSpots = async(req, res) => {
    try{
        console.log("I am parking spot controller");
        const parkingSpots = await ParkingSpot.find();
        res.json(parkingSpots);
    } catch(err){
        console.log(err);
        res.status(500).json({message: err.message});
    }
};

// Add a new parking spot
exports.addParkingSpot = async(req, res) => {
    const parkingSpot = new ParkingSpot({
        spotId: req.body.spotId
    });

    try{
        const newParkingSpot = await parkingSpot.save();
        res.status(201).json(newParkingSpot);
    } catch(err){
        res.status(400).json({message: err.message});
    }
};

// Remove a parking spot
exports.removeParkingSpot = async (req, res) => {
    const removedSpot = await ParkingSpot.findByIdAndRemove(req.params.id);
    res.json(removedSpot);
  };
  
  // Update a parking spot
  exports.updateParkingSpot = async (req, res) => {
    const updatedSpot = await ParkingSpot.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSpot);
  };

