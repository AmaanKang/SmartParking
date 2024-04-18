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
    const collection = db.collection('parkingspots');

    // Insert some parkingSpots
    const spots = [];
    const columns = ['A', 'B', 'C', 'D', 'E', 'F'];
    const rows = [1, 2, 3, 4, 5, 6, 7, 8];
    const subColumns = ['left', 'right'];

    columns.forEach(column => {
      rows.forEach(row => {
        subColumns.forEach(subColumn => {
          const status = Math.random() < 0.5 ? 'free' : 'occupied';
          spots.push({
            spotId: `${column}${row}`,
            status: status,
            subColumn: subColumn
          });
        });
      });
    });

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
