require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI+'SmartParking', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB'))
.then(() => {
    const parkingSpotRoutes = require('./routes/parkingSpotRoutes');
    app.use('/api/parking-spots',parkingSpotRoutes);

    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
})
.catch(err => console.error('Could not connect to MongoDB...', err));



