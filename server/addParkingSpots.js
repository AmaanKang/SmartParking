const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'SmartParking';

// Create a new MongoClient
const client = new MongoClient(url);

// Use connect method to connect to the Server
client.connect(function(err) {
  if (err) throw err;
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  // Get the parkingSpots collection
  const collection = db.collection('ParkingSpots');

  // Insert some parkingSpots
  const spots = [
    { spotId: 'A1', subColumn: 'left', status: 'free'},
        { spotId: 'A1', subColumn: 'right', status: 'free'},
        { spotId: 'A2', subColumn: 'left', status: 'occupied' },
        { spotId: 'A2', subColumn: 'right', status: 'free'},
        { spotId: 'A3', subColumn: 'left', status: 'free' },
        { spotId: 'A3', subColumn: 'right', status: 'occupied'},
        { spotId: 'B1', subColumn: 'left', status: 'occupied'},
        { spotId: 'B1', subColumn: 'right', status: 'free'},
        { spotId: 'B2', subColumn: 'left', status: 'free'},
        { spotId: 'B2', subColumn: 'right', status: 'occupied'},
        { spotId: 'B3', subColumn: 'left', status: 'free'},
        { spotId: 'B3', subColumn: 'right', status: 'occupied'},
        { spotId: 'C1', subColumn: 'left', status: 'occupied'},
        { spotId: 'C2', subColumn: 'left', status: 'free'},
        { spotId: 'C3', subColumn: 'left', status: 'occupied'},
        { spotId: 'C1', subColumn: 'right', status: 'free'},
        { spotId: 'C2', subColumn: 'right', status: 'free'},
        { spotId: 'C3', subColumn: 'right', status: 'occupied'},
        { spotId: 'D1', subColumn: 'left', status: 'free'},
        { spotId: 'D2', subColumn: 'left', status: 'free'},
        { spotId: 'D3', subColumn: 'left',status: 'occupied'},
        { spotId: 'D1', subColumn: 'right', status: 'free'},
        { spotId: 'D2', subColumn: 'right', status: 'occupied'},
        { spotId: 'D3', subColumn: 'right',status: 'free'},
    // Add more parking spots here
  ];

  collection.insertMany(spots, function(err, result) {
    if (err) throw err;
    console.log("Inserted documents into the collection");
    client.close();
  });
});