const express = require('express');
const Luggage = require('../models/Luggage');
const User = require('../models/User')
const FallDetectionLog = require('../models/FallDetectionLog');
const TamperDetectionLog = require('../models/TamperDetectionLog');
const TempLog = require('../models/TempLog')
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');

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
  console.log(req.user.email)
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const luggageList = await Luggage.find({ user_id: user._id });
    if (luggageList.length === 0) {
      return res.status(404).json({ status: false, message: "Luggage not found" });
    }

    const fallLogs = [];
    for (const luggage of luggageList) {
      const logs = await FallDetectionLog.find({ luggage_tag_number: luggage.luggage_tag_number }).lean();
      logs.forEach(log => {
        log.luggage_custom_name = luggage.luggage_custom_name;
        //console.log('Fall Time:', log.fall_time); 
      });
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
   
    res.json(tempLogs);
  } catch (error) {
    console.error('Error fetching temperature logs:', error);
    res.status(500).send('Server error');
  }
});




router.post('/addluggage', verifyUser, async (req, res) => {
  const { luggage_custom_name, luggage_tag_number, user_id } = req.body;
  console.log('Add Luggage Request:', req.body);


  if (!luggage_custom_name || !luggage_tag_number || !user_id) {
    return res.status(400).json({ status: false, message: "All fields are required" });
  }

  try {
    const newLuggage = new Luggage({
      luggage_custom_name,
      luggage_tag_number,
      user_id,
      updatedAt: Date.now(),
    });

    const savedLuggage = await newLuggage.save();
    res.status(201).json(savedLuggage);
  } catch (error) {
    console.error('Error adding new luggage:', error);
    res.status(500).json({ status: false, message: 'Server error' }); 
  }
});

// Update luggage route
router.put('/updateluggage/:id', verifyUser, async (req, res) => {
  const { luggage_custom_name, luggage_tag_number, status, user_id } = req.body;
  const luggageId = req.params.id;

  // Validate the input data
  if (!luggage_custom_name || !luggage_tag_number || !status || !user_id) {
    return res.status(400).json({ status: false, message: "All fields are required" });
  }

  try {
    // Update luggage in database
    const updatedLuggage = await Luggage.findByIdAndUpdate(luggageId, {
      luggage_custom_name,
      luggage_tag_number,
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

router.delete('/delete-tracking-data/:tagNumber', verifyUser, async (req, res) => {
  const luggageTagNumber = req.params.tagNumber;

  const refTamper = admin.database().ref('tamperData');
  const refTemp = admin.database().ref('Temperature');
  const refFall = admin.database().ref('movementData');

  try {
    const deletedFallData = await FallDetectionLog.deleteMany({ luggage_tag_number: luggageTagNumber });
    const deletedTamperData = await TamperDetectionLog.deleteMany({ luggage_tag_number: luggageTagNumber });
    const deletedTempData = await TempLog.deleteMany({ luggage_tag_number: luggageTagNumber });
    const deleteLocationdata = await Luggage.findOneAndUpdate({luggage_tag_number: luggageTagNumber}, {latitude: null, longitude: null}, {new: true})

    if (
      deletedFallData.deletedCount === 0 &&
      deletedTamperData.deletedCount === 0 &&
      deletedTempData.deletedCount === 0 && deleteLocationdata.deletedCount === 0
    ) {
      return res.status(404).json({ status: false, message: "Luggage not found" });
    }

    // Remove all data from each reference
    await Promise.all([
      refTamper.remove(),
      refTemp.remove(),
      refFall.remove()
    ]);


    return res.status(200).json({ status: true, message: "Data deleted successfully" });
  } catch (error) {
    console.error("Error deleting luggage tracking data:", error);
    return res.status(500).json({ status: false, message: "Error deleting luggage tracking data" });
  }
});



// Update geofence status route
router.post('/luggage/:id/updateStatus', verifyUser, async (req, res) => {
  const { status, luggageId } = req.body;  // Extract status and luggageId from the request body

  // Validate the input data
  if (!status || !luggageId) {
    return res.status(400).json({ status: false, message: "Status and luggageId are required" });
  }

  try {
    // Find the luggage by the provided luggageId and update its geofence status
    const updatedLuggage = await Luggage.findByIdAndUpdate(luggageId, {
      status: status
    }, { new: true });

    if (!updatedLuggage) {
      return res.status(404).json({ status: false, message: "Luggage not found" });
    }

    res.json({ status: true, message: "Geofence status updated successfully", luggage: updatedLuggage });
  } catch (error) {
    console.error('Error updating geofence status:', error);
    res.status(500).send('Server error');
  }
});


router.put('/update-location', verifyUser, async (req, res) => {
  const { latitude, longitude, locationUpdatedAt } = req.body;
  const luggage_tag_number = "ST123456789";

  try {
    const updatedLuggageLocation = await Luggage.findOneAndUpdate(
      { luggage_tag_number: luggage_tag_number },
      {
        latitude,
        longitude,
        updatedAt: locationUpdatedAt,
      },
      { new: true }
    );

    if (!updatedLuggageLocation) {

      return res
        .status(404)
        .json({ status: false, message: "Luggage not found", luggage: updatedLuggageLocation });
    }
    console.log("LUGGAGE LOCATION UPDATED")
    return res.json({ 
      status: true, 
      message: "Luggage location status updated successfully", 
      luggage: updatedLuggageLocation 
    });
    
  } catch (error) {
    console.error('Error updating location:', error);

    return res.status(500).send('Server error');
  }
});

router.put('/update-current-location', verifyUser, async (req, res) => {
  const { luggageId, currentLocation, stationary_since } = req.body;

  if (currentLocation === null) {
    console.log("Current location reset to null for luggage:", luggageId);
  }


  if (!luggageId) {
    return res.status(400).json({
      status: false,
      message: "Missing required fields: luggageId or currentLocation",
    });
  }

  console.log("Request to update current location received.");

  try {
    const updatedLuggageCurrentLocations = await Luggage.findByIdAndUpdate(
      luggageId,
      { currentLocation, stationary_since, },
      { new: true } // Return the updated document
    );

    if (!updatedLuggageCurrentLocations) {
      return res.status(404).json({
        status: false,
        message: "Luggage not found",
      });
    }

    console.log("LUGGAGE LOCATION UPDATED");
    return res.json({
      status: true,
      message: "Luggage location updated successfully",
      luggage: updatedLuggageCurrentLocations,
    });
  } catch (error) {
    console.error('Error updating luggage current location:', error);
    return res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
});



module.exports = router;
