const express = require('express');
const Luggage = require('../models/Luggage');
const FallDetectionLog = require('../models/FallDetectionLog');
const TamperDetectionLog = require('../models/TamperDetectionLog');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify user authentication
const verifyUser = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ status: false, message: "No token" });
    }
    const decoded = jwt.verify(token, process.env.KEY);
    next();
  } catch (err) {
    return res.status(401).json({ status: false, message: "Invalid token" });
  }
};

// Verify user route
router.get('/verify', verifyUser, async (req, res) => {
  return res.json({ status: true, message: "Authorized" });
});

// Fetch luggage data route
router.get('/luggage', async (req, res) => {
  try {
    const luggage = await Luggage.find();
    res.json(luggage);
  } catch (error) {
    console.error('Error fetching luggage data:', error);
    res.status(500).send('Server error');
  }
});

// Fetch fall detection logs route
router.get('/fall-logs', async (req, res) => {
  try {
    const fallLogs = await FallDetectionLog.find();
    res.json(fallLogs);
  } catch (error) {
    console.error('Error fetching fall detection logs:', error);
    res.status(500).send('Server error');
  }
});

// Fetch tamper detection logs route
router.get('/tamper-logs', async (req, res) => {
  try {
    const tamperLogs = await TamperDetectionLog.find();
    res.json(tamperLogs);
  } catch (error) {
    console.error('Error fetching tamper detection logs:', error);
    res.status(500).send('Server error');
  }
});

// Add new luggage route
router.post('/addluggage', verifyUser, async (req, res) => {
  const { luggage_custom_name, luggage_tag_number, destination, user_id } = req.body;

  // Validate the input data
  if (!luggage_custom_name || !luggage_tag_number || !destination || !user_id) {
    return res.status(400).json({ status: false, message: "All fields are required" });
  }

  try {
    const newLuggage = new Luggage({
      luggage_custom_name,
      luggage_tag_number,
      destination,
      user_id
    });

    const savedLuggage = await newLuggage.save();
    res.status(201).json(savedLuggage);
  } catch (error) {
    console.error('Error adding new luggage:', error);
    res.status(500).send('Server error');
  }
});

// Update luggage route
router.put('/updateluggage/:id', verifyUser, async (req, res) => {
  const { luggage_custom_name, luggage_tag_number, destination, status, user_id } = req.body;
  const luggageId = req.params.id;

  // Validate the input data
  if (!luggage_custom_name || !luggage_tag_number || !destination || !status || !user_id) {
    return res.status(400).json({ status: false, message: "All fields are required" });
  }

  try {
    const updatedLuggage = await Luggage.findByIdAndUpdate(luggageId, {
      luggage_custom_name,
      luggage_tag_number,
      destination,
      status,
      user_id
    }, { new: true });

    if (!updatedLuggage) {
      return res.status(404).json({ status: false, message: "Luggage not found" });
    }

    res.json(updatedLuggage);
  } catch (error) {
    console.error('Error updating luggage:', error);
    res.status(500).send('Server error');
  }
});

// Delete luggage route
router.delete('/deleteluggage/:id', verifyUser, async (req, res) => {
  const luggageId = req.params.id;

  try {
    const deletedLuggage = await Luggage.findByIdAndDelete(luggageId);

    if (!deletedLuggage) {
      return res.status(404).json({ status: false, message: "Luggage not found" });
    }

    res.json({ status: true, message: "Luggage deleted successfully" });
  } catch (error) {
    console.error('Error deleting luggage:', error);
    res.status(500).send('Server error');
  }
});


module.exports = router;
