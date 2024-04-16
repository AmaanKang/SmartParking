require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = process.env.MONGODB_URI;
// Database Name
const dbName = 'SmartParking';

// Create a new MongoClient
const client = new MongoClient(url);

async function run() {
  try {
    // Use connect method to connect to the Server
    await client.connect();
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    // Get the parkingSpots collection
    const collection = db.collection('ParkingSpots');
    console.log(collection);

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

    // Insert the spots into the collection
    const result = await collection.insertMany(spots);
    console.log(result);
  } catch (err) {
    console.error(err);
  } finally {
    // Ensure that the client will close when finish/error
    await client.close();
  }
}

run().catch(console.dir);
