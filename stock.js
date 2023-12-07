const http = require('http');
const readline = require('readline');
const fs = require('fs');
const { MongoClient } = require('mongodb');

const filePath = 'companies-1.csv'; // Change this to your CSV file path
const connectionString = 'mongodb+srv://abdi:1@Abdi6057@companies.jyfn4ka.mongodb.net/Companies?retryWrites=true&w=majority';

const dbName = 'Companies'; // Your database name
const collectionName = 'companies'; // Your collection name

// Create a MongoDB client
MongoClient.connect(connectionString, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.log("Connection err: " + err);
    return;
  }

  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  var myFile = readline.createInterface({
    input: fs.createReadStream(filePath)
  });

  myFile.on('line', function (line) {
    const [companyName, stockTicker, stockPrice] = line.split(',');

    // Create a new document to be inserted into the collection
    const newData = {
      companyName,
      stockTicker,
      stockPrice: parseFloat(stockPrice) // Assuming stockPrice is a number in the CSV
    };

    // Insert the new document into the collection
    collection.insertOne(newData, function(err, res) {
      if (err) {
        console.error("can't insert document", err);
      } else {
        console.log("Documented inserted", newData);
      }
    });
  });

  // Close the MongoDB connection after all insertions are done
  client.close();
});



