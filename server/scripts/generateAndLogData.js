// generateAndLogData.js
const mongoose = require("mongoose");
const Luggage = require("./Luggage"); // Assuming Luggage.js is in the same directory
const TempLog = require("./TempLog"); // Assuming TempLog.js is in the same directory

// Function to generate mock data
const generateMockData = async () => {
  const luggageItems = await Luggage.find(); // Fetch all luggage items from the database
  const logs = [];

  const timeStamp = new Date();

  luggageItems.forEach(luggage => {
    const temperature = Math.random() * 8 + 25; // Random temperature between 25 and 33 degrees Celsius

    logs.push({
      luggage_tag_number: luggage.luggage_tag_number,
      temperature,
      timeStamp,
      latitude: luggage.latitude,
      longitude: luggage.longitude,
    });
  });

  return logs;
};

// Function to save data to MongoDB
const saveDataToMongoDB = async () => {
  const logs = await generateMockData();

  try {
    await TempLog.insertMany(logs);
    console.log(`Inserted ${logs.length} logs at ${new Date()}`);
  } catch (error) {
    console.error("Error inserting logs:", error);
  }
};

// Connect to MongoDB and start logging data every 5 minutes
const startLogging = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/yourDatabaseName", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Insert data every 5 minutes
    setInterval(saveDataToMongoDB, 5 * 60 * 1000);

    // Insert initial data immediately
    await saveDataToMongoDB();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

startLogging();
