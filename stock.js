const fs = require('fs');
const { MongoClient } = require('mongodb');

const filePath = 'companies.csv';
const dbName = 'Companies'; // Your database name
const collectionName = 'Companies'; // Your collection name

// MongoDB connection URL with authentication
const mongoURL = 'mongodb://abdi:1%40Abdi6057@localhost:27017/?authSource=admin';

// Reading the CSV file line by line
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const lines = data.split('\n');
  const documents = [];

  lines.forEach((line) => {
    const [companyName, stockTicker, stockPrice] = line.split(',');

    const companyDocument = {
      companyName,
      stockTicker,
      stockPrice: parseFloat(stockPrice),
    };

    documents.push(companyDocument);
  });

  // Connect to MongoDB with authentication
  MongoClient.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
      console.error('Error connecting to MongoDB:', err);
      return;
    }

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Insert the documents into the collection
    collection.insertMany(documents, (err, result) => {
      if (err) {
        console.error('Error inserting documents:', err);
      } else {
        console.log(`${result.insertedCount} documents inserted successfully.`);
      }

      // Close the connection
      client.close();
    });
  });
});
