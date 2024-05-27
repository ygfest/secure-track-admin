const mysql = require('mysql');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
dotenv.config();
const UserRouter = require('./routes/user');
const LuggageRouter = require('./routes/luggage')  

const app = express();
const router = express.Router();

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
}));
app.use(cookieParser());
app.use('/auth', UserRouter);  // Use UserRouter middleware
app.use('/luggage-router', LuggageRouter)

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/secure_track_db')
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });







// MySQL connection
{/*const connection = mysql.createConnection({
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

{/*router.get('/users', (req, res) => {
    connection.query('SELECT * FROM users_tbl', (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});*/}

{/*router.get('/luggage', (req, res) => {
    connection.query('SELECT * FROM luggage_tbl', (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

router.get('/luggage-fall', (req, res) => {
    connection.query('SELECT * FROM fall_detection_tbl', (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

router.get('/luggage-intrusion', (req, res) => {
    connection.query('SELECT * FROM intrusion_detection_tbl', (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

router.get('/luggage-temp', (req, res) => {
    connection.query('SELECT * FROM temperature_log_tbl', (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});*/}

app.use('/', router);

const port = process.env.PORT || 3001;  // Change to a different port if needed, e.g., 3002

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
