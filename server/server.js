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

// The below code helps in setting up a job thats runs every hour to check the number of occupied spots in the lot
const cron = require('node-cron');
const WeeklyData = require('./models/weeklyData');
let maxAvg = -1;
let minAvg = 10000000;
let maxHour = 0;
let minHour = 0;
let hourlyAverage = null;

// Setup the job scheduler 
cron.schedule('0 * * * *', async () => {
    try {
        console.log('Job run');
        // Fetch parking spots to see how many are occupied at this time
        let parkingSpots = await fetchAllParkingSpots();
        const occupiedSpots = parkingSpots.filter(spot => spot.status === 'occupied').length;

        // Find todays date and day and hour
        const todaysDate = new Date();
        const day = todaysDate.getDay();
        const hour = todaysDate.getHours().toString();

        // Set the todays day/hour with the current occupied spots
        const updatedData = await WeeklyData.findOneAndUpdate(
            {dayId: day},
            {[`${hour}`]: occupiedSpots},
            {new: true}
        );

        // Get the whole week's data and find sum of the occupied spots at current hour of the day. Example - This adds the filled spots at 1 pm each of the 7 days.
        const allData = await WeeklyData.find();
        let sum = 0;
        for(let j=0; j<7; j++){
            sum += allData[j][`${hour}`];
        }

        // Set the average of the spots across 7 days in the database
        hourlyAverage = await WeeklyData.findOneAndUpdate(
            {dayId: 7},
            {[`${hour}`]: sum/7},
            {new: true}
        );

        // Loop through the averages recorded for each hour of the day and find the busiest hour and the least busy hour
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
    } catch (err) {
        console.log(err);
    }
});


/**
 * Below code is specially added to assist in the sockets connection
 */
const faker = require('faker');
const { fetchAllParkingSpots } = require('./controllers/parkingSpotController');
const ParkingSpot = require('./models/parkingSpot');
const socketIo = require('socket.io');
const http = require('http');
const httpServer = http.createServer(app);

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

/** 
 * The below code will run the python file for the predictions
 */
const {spawn} = require('child_process');
port = 3000;
let predictions = [];
const fs = require('fs');

// Using the httpServer here and NOT app because the socket io configuration is related to the httpServer
httpServer.listen(port, () => {
    console.log('Server is running on port 3000');

    cron.schedule('* * * * *',() => {
        const python = spawn('python',['predictOccupancy.py']);
        python.stdout.on('data',(data) => {
            console.log(`stdout: ${data}`);
            fs.readFile('future_predictions.json', 'utf8', (err, data) => {
                if(err) {
                    console.log(err);
                    return
                }
                else{
                    predictions = JSON.parse(data);

                    // When a client connects from analytics page
                    io.on('connection', (socket) => {
                        console.log('A user connected');
                        socket.emit('predictions',predictions);
                    });
                }
            });
        });
        python.stderr.on('data',(data) => {
            console.log(`stderr: ${data}`);
        });
        python.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    });
});



