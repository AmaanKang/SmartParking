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

/**
 * Below code is specially added to assist in the sockets connection
 */
const faker = require('faker');
const { fetchAllParkingSpots } = require('./controllers/parkingSpotController');
const ParkingSpot = require('./models/parkingSpot');
const http = require('http');
const httpServer = http.createServer(app);
const socketIo = require('socket.io');

// Program socket IO by using the http server
const io = socketIo(httpServer,{
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"]
      }
});

// When a client connects
io.on('connection', (socket) => {
    console.log('A user connected');

    // Emit update events with randon sensor data every minute
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
            
            // Emit the updated spots to the client
            socket.emit('update', parkingSpots);
        } catch (err) {
            console.log(err);
        }
    }, 60000);
});

// The below code helps in setting up a job thats runs every hour to check the number of occupied spots in the lot
const cron = require('node-cron');
const WeeklyData = require('./models/weeklyData');

cron.schedule('* * * * *', async () => {
    try {
        let parkingSpots = await fetchAllParkingSpots();
        const occupiedSpots = parkingSpots.filter(spot => spot.status === 'occupied').length;
        console.log(`Number of occupied spots: ${occupiedSpots}`);
        // TO DO: Save the weekly data
        const todaysDate = new Date();
        const day = todaysDate.getDay();
        const hour = todaysDate.getHours().toString();
        console.log(day);
        console.log(hour);
        const updatedData = await WeeklyData.findOneAndUpdate(
            {dayId: day},
            {[`${hour}`]: occupiedSpots},
            {new: true}
        );
        console.log(updatedData[`${hour}`]);
        const allData = await WeeklyData.find();
        let sum = 0;
        for(let j=0; j<7; j++){
            sum += allData[j][`${hour}`];
        }
        const hourlyAverage = await WeeklyData.findOneAndUpdate(
            {dayId: 7},
            {[`${hour}`]: sum/7},
            {new: true}
        );
        console.log(hourlyAverage[`${hour}`]);
        let maxAvg = -1;
        let minAvg = 10000000;
        let maxHour = 0;
        let minHour = 0;
        for(let i=1; i<=24; i++){
            const hourAvg = allData[7][`${i}`];
            if(hourAvg > maxAvg){
                maxAvg = hourAvg;
                maxHour = i;
            }
            if(hourAvg < minAvg){
                minAvg = hourAvg;
                minHour = i;
            }
        }
        console.log("Most Busy: " + maxHour);
        console.log("Min Busy: "+ minHour);
        
    } catch (err) {
        console.log(err);
    }
});


// Using the httpServer here and NOT app because the socket io configuration is related to the httpServer
httpServer.listen(3000, () => {
    console.log('Server is running on port 3000');
});


