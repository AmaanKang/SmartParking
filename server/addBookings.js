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
    const collection = db.collection('bookings');

    console.log();
  } catch (err) {
    console.error(err);
  } finally {
    // Ensure that the client will close when finish/error
    await client.close();
  }
}

run().catch(console.dir);
