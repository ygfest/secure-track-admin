const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const admin = require('firebase-admin');

dotenv.config();

const UserRouter = require('./routes/user');
const LuggageRouter = require('./routes/luggage');
const uploadRouter = require('./routes/uploadthing');
const app = express();
const { createRouteHandler } = require('uploadthing/express');

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173", "https://secure-track-wa.vercel.app"],
    credentials: true,
}));
app.use(cookieParser());

// Routes
app.use('/auth', UserRouter);
app.use('/luggage-router', LuggageRouter);
app.use('/api/uploadthing', createRouteHandler({ router: uploadRouter, config: {} }));

// MongoDB connection
mongoose.connect(process.env.MONGO_STRING, {
    connectTimeoutMS: 10000,
})
.then(() => console.log('Successfully connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err.message));

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// Firebase Admin SDK Initialization
admin.initializeApp({
    credential: admin.credential.cert(require('./utils/serviceAccountKey.json')),
    databaseURL: "https://track-bedd0-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.database();
const ref = db.ref("impactData"); // Adjusted to point to the correct data path

// Define a Mongoose schema
const ImpactDataSchema = new mongoose.Schema({
    firebaseId: { type: String, required: true, unique: true }, // Add unique constraint to firebaseId
    impact: String, // You can add other fields here if needed
});
const ImpactDataModel = mongoose.model('ImpactData', ImpactDataSchema);

// Function to sync initial data from Firebase to MongoDB
async function syncInitialData() {
    try {
        const snapshot = await ref.once('value');
        const impactData = snapshot.val();

        if (impactData) {
            for (const key in impactData) {
                const existingDoc = await ImpactDataModel.findOne({ firebaseId: key });
                if (!existingDoc) {
                    // Only create a new document if it does not already exist
                    await ImpactDataModel.create({ firebaseId: key, impact: impactData[key].impact });
                }
            }
            console.log('Initial data synced to MongoDB successfully');
        } else {
            console.log('No initial data found in Firebase');
        }
    } catch (error) {
        console.error('Error syncing initial data:', error);
    }
}

// Sync initial data on server startup
syncInitialData();

// Sync Firebase Realtime Database changes to MongoDB
ref.on('child_changed', async (snapshot) => {
    const updatedData = snapshot.val();
    const firebaseId = snapshot.key; // Get the firebase ID from the snapshot key
    try {
        const existingDoc = await ImpactDataModel.findOne({ firebaseId: firebaseId });
        if (existingDoc) {
            // Update only if it exists
            await existingDoc.updateOne({ impact: updatedData.impact });
        } else {
            // Create a new document if it doesn't exist
            await ImpactDataModel.create({ firebaseId: firebaseId, impact: updatedData.impact });
        }
        console.log('Data synced to MongoDB successfully');
    } catch (error) {
        console.error('Error syncing data:', error);
    }
});

ref.on('child_added', async (snapshot) => {
    const newData = snapshot.val();
    const firebaseId = snapshot.key; // Get the firebase ID from the snapshot key
    try {
        // Only add new data if it does not already exist
        const existingDoc = await ImpactDataModel.findOne({ firebaseId: firebaseId });
        if (!existingDoc) {
            await ImpactDataModel.create({ firebaseId: firebaseId, impact: newData.impact });
            console.log('New data added to MongoDB');
        }
    } catch (error) {
        console.error('Error adding new data to MongoDB:', error);
    }
});

ref.on('child_removed', async (snapshot) => {
    const firebaseId = snapshot.key; // Get the firebase ID from the snapshot key
    try {
        await ImpactDataModel.deleteOne({ firebaseId: firebaseId });
        console.log('Data removed from MongoDB');
    } catch (error) {
        console.error('Error removing data from MongoDB:', error);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



/*
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'securetrack_db'
});

connection.connect((error) => {
    if (error) {
        console.error('Error connecting to the database:', error);
        return;
    }
    console.log('Connected to the database');
});

router.get('/strack', (req, res) => {
    connection.query('SELECT * FROM cargo_details', (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});
*/
