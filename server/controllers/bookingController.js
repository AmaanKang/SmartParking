const booking = require('../models/booking');

// Get all parking lot bookings from database
exports.getAllBookings = async(req,res) => {
    try{
        const bookings = await booking.find();
        res.json(bookings);
    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message});
    }
}

// Add a new parking spot Booking
exports.addBooking = async(req,res) => {
    const bookingAdd = new booking({
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
