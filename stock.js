const http = require('http');
const readline = require('readline');
const fs = require('fs');
const { MongoClient } = require('mongodb');

const filePath = 'companies.csv'; // Change this to your CSV file path
const connectionString = 'mongodb+srv://abdi:<password>@companies.jyfn4ka.mongodb.net/Companies?retryWrites=true&w=majority';

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

  const server = http.createServer((req, res) => {
    if (req.url === '/') {
      // Read the CSV file and process data
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
        collection.insertOne(newData, function(err, result) {
          if (err) {
            console.error("Error inserting document:", err);
          } else {
            console.log("New document inserted:", newData);
          }
        });
      });

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Data insertion process initiated.\n');
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found\n');
    }
  });

  const PORT = process.env.PORT || 3000; // Use the environment port or default to 3000

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});




