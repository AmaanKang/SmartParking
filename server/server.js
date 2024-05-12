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
const { getAllParkingSpots } = require('./controllers/parkingSpotController');

const http = require('http');
const httpServer = http.createServer(app);

// Program socket emitting on the server
const io = require('socket.io')(httpServer,{
    cors: {
        origin: '*',
    }
});

// When a client connects
io.on('connection', (socket) => {
    console.log('a user connected');

    // Emit update events with randon sensor data every second
    setInterval(() => {
        getAllParkingSpots().then(parkingSpots => {
            const updatedSpots = parkingSpots.map(spot => ({
                ...spot,
                status: faker.random.arrayElement(['free', 'occupied']),
              }));
            socket.emit('update', updatedSpots);
        });
    }, 5000);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


