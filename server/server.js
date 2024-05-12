require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI+'SmartParking', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB'))
.then(() => {
    const parkingSpotRoutes = require('./routes/parkingSpotRoutes');
    app.use('/api/parking-spots',parkingSpotRoutes);
})
.catch(err => console.error('Could not connect to MongoDB...', err));


const faker = require('faker');
const { fetchAllParkingSpots } = require('./controllers/parkingSpotController');
const ParkingSpot = require('./models/parkingSpot');

const http = require('http');
const httpServer = http.createServer(app);
const socketIo = require('socket.io');

// Program socket emitting on the server
const io = socketIo(httpServer,{
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"]
      }
});

// When a client connects
io.on('connection', (socket) => {
    console.log('a user connected');

    // Emit update events with randon sensor data every second
    setInterval(async() => {
        try {
            let parkingSpots = await fetchAllParkingSpots();
            const updatedSpots = parkingSpots.map(spot => {
              spot.status = faker.random.arrayElement(['free', 'occupied']);
              //await spot.save();
              return spot;
            });
      
            // Save the updated spots to the database
            for (let spot of updatedSpots) {
              await ParkingSpot.updateOne({ _id: spot._id }, {status: spot.status});
            }
      
            // Fetch the updated spots from the database
            parkingSpots = await fetchAllParkingSpots();
      
            socket.emit('update', parkingSpots);
        } catch (err) {
            console.log(err);
        }
    }, 10000);
});


httpServer.listen(3000, () => {
    console.log('Server is running on port 3000');
});


