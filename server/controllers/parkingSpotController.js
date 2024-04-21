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
        spotId: req.body.spotId,
        subColumn: re.body.subColumn
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
    try{
        const removedSpot = await ParkingSpot.findByIdAndRemove(req.body.id);
        res.json(removedSpot);
    }catch(err){
        res.status(400).json({message: err.message});
    }
  };
  
// Update a parking spot
exports.updateParkingSpot = async (req, res) => {
    const parkingSpot = new ParkingSpot({
        spotId: req.body.spotId,
        subColumn: re.body.subColumn,
        status: req.body.status
    });
    try{
        const updatedSpot = await ParkingSpot.findByIdAndUpdate(req.body.id, parkingSpot, { new: true });
        res.json(updatedSpot);
    }catch(err){
        res.status(400).json({message: err.message});
    }
  };

