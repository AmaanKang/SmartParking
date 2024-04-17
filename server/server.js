require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI+'SmartParking', { useNewUrlParser: true, useUnifiedTopology: true });

const express = require('express');
const cors = require('cors');
const parkingSpotRoutes = require('./routes/parkingSpotRoutes');

const app = express();
app.use(cors());
app.use('/api/parking-spots',parkingSpotRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});