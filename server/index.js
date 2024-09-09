const mysql = require('mysql');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
dotenv.config();
const UserRouter = require('./routes/user');
const LuggageRouter = require('./routes/luggage');

const app = express();
const router = express.Router();

//app.set('trust proxy', 1);

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173", "https://secure-track-wa.vercel.app"],
    credentials: true,
}));
app.use(cookieParser());
app.use('/auth', UserRouter);  // Use UserRouter middleware
app.use('/luggage-router', LuggageRouter);

// Enable Mongoose debug mode
mongoose.set('debug', true);

// MongoDB Atlas connection using Mongoose
mongoose.connect(process.env.MONGO_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 10000 // 10 seconds timeout
})
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB Atlas:', err.message);
    });

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// Uncomment and update this block for MySQL connection if needed
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

// Additional Debugging for MongoClient Connection (if used)
const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGO_STRING);

async function run() {
    try {
        await client.connect();
        console.log("Successfully connected to Atlas using MongoClient");
    } catch (err) {
        console.error("MongoClient connection error:", err);
    } finally {
        await client.close();
    }
}

run().catch(console.dir);

app.use('/', router);

const port = process.env.PORT || 3001;  // Change to a different port if needed, e.g., 3002

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

