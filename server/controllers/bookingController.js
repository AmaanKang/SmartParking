const bookingModel = require('../models/booking');

// Get all parking lot bookings from database
exports.getAllBookings = async(req,res) => {
    try{
        const bookings = await bookingModel.find();
        res.json(bookings);
    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message});
    }
}

// Add a new parking spot Booking
exports.addBooking = async(req,res) => {
    const bookingAdd = new bookingModel({
        parkingSpot: req.body.parkingSpot,
        email: req.body.email
    });

    try{
        const newBooking = await bookingAdd.save();
        res.status(201).json(newBooking);
    }catch(err){
        res.status(400).json({message: err.message});
    }
}

// Access one booking for the customer
exports.getOneBooking = async(req, res) => {
    try{
        const booking = await bookingModel.findOne({email: req.params.email});
        res.json(booking);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

