const express = require('express');
const Luggage = require('../models/Luggage');
const User = require('../models/User')
const FallDetectionLog = require('../models/FallDetectionLog');
const TamperDetectionLog = require('../models/TamperDetectionLog');
const TempLog = require('../models/TempLog')
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
    req.user = decoded;  // Set req.user with decoded token
    next();
  } catch (err) {
    return res.status(401).json({ status: false, message: "Invalid token" });
  }
};


// Verify user route
router.get('/verify', verifyUser, async (req, res) => {
  
  return res.json({ status: true, message: "Authorized" });
});

// Fetch luggage data route for user side
router.get('/luggage', verifyUser, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    const luggage = await Luggage.find({ user_id: user._id });
    res.json(luggage);
  } catch (error) {
    console.error('Error fetching luggage data:', error);
    res.status(500).send('Server error');
  }
});

//Fetch luggage data route for  admin side
router.get('/luggage-admin', verifyUser, async(req, res) => {
  try {
    const luggage = await Luggage.find();
    if(!luggage){
      return res.status(404).json({status: false, message: "Luggage not found"});
    } 
    res.json(luggage)
  } catch (error) {
    console.log('Error fetching luggage data:', error);
    res.status(500).send("Server Error");
  }
})



// Fetch fall detection logs route for admin
router.get('/fall-logs1', verifyUser, async (req, res) => {
  try {
    const user = await User.findOne({email: req.user.email})
    if(!user){
      return res.status(404).json({status: false, message: "user not found"})
    }
    const luggageList = await Luggage.find({user_id: user._id})
    if(luggageList.length === 0){
      return res.status(404).json({status: false, message: "luggage not found"})
    }
    const fallLogs = [0];
    for (const luggage of luggageList){
      const logs = await FallDetectionLog.find({luggage_tag_number: luggage.luggage_tag_number})
      fallLogs.push(...logs);
    }
    res.json(fallLogs);
  } catch (error) {
    console.error('Error fetching fall detection logs:', error);
    res.status(500).send('Server error');
  }
});

// Fetch fall detection logs route for admin
router.get('/fall-logs2', verifyUser, async (req, res) => {
  try {
    const user = await User.findOne({email: req.user.email})
    if(!user){
      return res.status(404).json({status: false, message: "user not found"})
    }
    const luggageList = await Luggage.find({user_id: user._id})
    if(luggageList.length === 0){
      return res.status(404).json({status: false, message: "luggage not found"})
    }
    const fallLogs = [];
    for (const luggage of luggageList){
      const logs = await FallDetectionLog.find({luggage_tag_number: luggage.luggage_tag_number}).lean();
      logs.forEach(log => {
        log.luggage_custom_name = luggage.luggage_custom_name;
      })
      fallLogs.push(...logs);
    }
    res.json(fallLogs);
  } catch (error) {
    console.error('Error fetching fall detection logs:', error);
    res.status(500).send('Server error');
  }
});

// Fetch tamper detection logs route
router.get('/tamper-logs1', verifyUser, async (req, res) => {
  try {
    const user = await User.findOne({email: req.user.email})
    if(!user) {
      return res.status(404).json({status: false, message: "User not found"})
    }
    const luggageList = await Luggage.find({user_id: user._id})
    if(luggageList.length === 0){
      return res.status(404).json({status: false, message: "Luggage not found"})
    }
    const tamperLogs = [];
    for(const luggage of luggageList){
      const logs = await TamperDetectionLog.find({luggage_tag_number: luggage.luggage_tag_number})
      tamperLogs.push(...logs);
    }
    res.json(tamperLogs)
  } catch (error) {
    console.error('Error fetching tamper detection logs:', error);
    res.status(500).send('Server error');
  }
});

router.get('/tamper-logs2', verifyUser, async (req, res) => {
  try {
    const user = await User.findOne({email: req.user.email})
    if(!user) {
      return res.status(404).json({status: false, message: "User not found"})
    }
    const luggageList = await Luggage.find({user_id: user._id})
    if(luggageList.length === 0){
      return res.status(404).json({status: false, message: "Luggage not found"})
    }
    const tamperLogs = [];
    for(const luggage of luggageList){
      const logs = await TamperDetectionLog.find({luggage_tag_number: luggage.luggage_tag_number}).lean();
      logs.forEach(log => {
        log.luggage_custom_name = luggage.luggage_custom_name;
      })
      tamperLogs.push(...logs)
    }
    res.json(tamperLogs)
  } catch (error) {
    console.error('Error fetching tamper detection logs:', error);
    res.status(500).send('Server error');
  }
});

//fetch temp logs
// Fetch temp logs
router.get('/temp-logs', verifyUser, async(req, res) => {
  try {
    const user = await User.findOne({email: req.user.email});
    if(!user) {
      return res.status(404).json({status: false, message: 'User not found'});
    } 
    const luggageList = await Luggage.find({user_id: user._id});
    if(luggageList.length === 0){
      return res.status(404).json({status: false, message: 'No luggage found'});
    }
    const tempLogs = [];
    for(const luggage of luggageList){
      const logs = await TempLog.find({luggage_tag_number: luggage.luggage_tag_number}).lean();
      logs.forEach(log => {
        log.luggage_custom_name = luggage.luggage_custom_name;
      });
      tempLogs.push(...logs);
    }
    // Ensure we send the response back
    res.json(tempLogs);
  } catch (error) {
    console.error('Error fetching temperature logs:', error);
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
    res.status(500).json({ status: false, message: 'Server error' }); // Return error message
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
