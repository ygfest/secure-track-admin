const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Luggage = require('../models/Luggage');
const Report = require('../models/Report');

const router = express.Router();

const verifyUser = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ status: false, message: "No token" });
    }
    const decoded = jwt.verify(token, process.env.KEY);
    if (!decoded.id) {
      return res.status(401).json({ status: false, message: "Invalid token payload" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ status: false, message: "Invalid token" });
  }
};

router.get('/verify', verifyUser, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    return res.json({ status: true, message: "Authorized", user: { firstname: user.firstname, email: user.email, lastname: user.lastname,role: user.role, userID: user._id, latitude: user.latitude, longitude: user.longitude, profile_dp: user.profile_dp, logggedInAt: user.loggedInAt, createdAt: user.createdAt, phone: user.phone} });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({ status: false, message: "Server error" });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users data:', error);
    res.status(500).send('Server error');
  }
});


router.post('/signup', async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role: 'user',
    });

    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.KEY, { expiresIn: '60m' });

    console.log("Generated Token (Signup):", token);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 1000, // 60 minutes
      sameSite: 'None',
    });

    return res.status(201).json({ status: true, message: "User registered successfully", token, user: {email: user.email, role: user.role} });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post('/admin-user-register', async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role: 'user',
    });

    await user.save();

    return res.status(201).json({ status: true, message: "User registered successfully", user: {email: user.email, role: user.role} });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User is not registered" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    user.loggedInAt = Date.now();
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email}, process.env.KEY, { expiresIn: '60m' });

    console.log("Generated Token (Signin):", token);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 1000, // 60 minutes
      sameSite: 'None',
    });

    console.log("Cookies sent:", req.cookies);


    return res.json({ status: true, message: "Login successful", token, user: {email: user.email, role: user.role } });
  } catch (error) {
    console.error("Error signing in:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post('/save-google-user', async (req, res) => {
  console.log("Received request to /save-google-user");
  const { googleId, email, firstName, lastName, picture } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ googleId });

    if (!user) {
      // If the user doesn't exist, create a new user
      user = new User({
        googleId,
        email,
        firstname: firstName,
        lastname: lastName,
        role: 'user', // Default role for new users
        profile_dp: picture,
        loggedInAt: Date.now(), // Track the time user logged in
      });

      await user.save();
      console.log("User saved to MongoDB:", user);
    } else {
     
      user.email = email; 
      user.firstname = firstName; 
      user.lastname = lastName; 
      user.profile_dp = picture; 
      user.loggedInAt = Date.now(); 
      await user.save();
      console.log("Existing user updated in MongoDB:", user);
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.KEY, { expiresIn: '60m' });

    console.log("Generated Token (Signin):", token);

    // Set the cookie with the generated token
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 1000, // 60 minutes
      sameSite: 'None',
    });

    console.log("Cookies sent:", req.cookies);

    return res.status(200).json({ message: "User information processed successfully", token });
  } catch (error) {
    console.error("Error saving user information:", error);
    res.status(500).json({ message: "Server error" });
  }
});



router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: false, message: "User not registered" });
    }

    const token = jwt.sign({ id: user._id }, process.env.KEY, { expiresIn: '5m' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_PASS_KEY,
      }
    });

    const mailOptions = {
      from: process.env.GOOGLE_USER,
      to: email,
      subject: 'Secure Track Account Reset Password',
      text: `http://localhost:5173/reset-password/${token}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.json({status: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("Error in forgot password:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.KEY);
    const id = decoded.id;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(id, { password: hashedPassword });
    return res.json({ status: true, message: "Updated password" });
  } catch (err) {
    return res.status(400).json({ status: false, message: "Invalid token" });
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ status: true });
});

router.post('/update-location', verifyUser, async (req, res) => {
  const { latitude, longitude } = req.body;
  const userId = req.user.id; // Extracted from the verified token

  console.log("Updating location for user ID:", userId); // Add this line to log the userId

  if (!userId) {
    return res.status(400).json({ status: 'error', message: 'User ID is missing' });
  }

  try {
    await User.findByIdAndUpdate(userId, {
      latitude,
      longitude,
    });

    res.json({ status: 'success', message: 'Location updated successfully' });
  } catch (error) {
    console.error('Failed to update location:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update location' });
  }
});

router.delete('/delete-location', verifyUser, async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ status: 'error', message: 'User ID not found' });
  }

  try {
    await User.findByIdAndUpdate(userId, {
      $unset: { latitude: '', longitude: '' } 
    });

    res.json({ status: 'success', message: 'Location deleted successfully' });
  } catch (error) {
    console.error('Failed to delete location:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete location' });
  }
});


router.put('/updateuser/:id', verifyUser, async (req, res) => {
  const { firstname, lastname, email, phone } = req.body;
  const userId = req.params.id;

  // Corrected the conditional to only check if any required fields are missing
  if (!firstname || !lastname || !email) {
    return res.status(400).json({ status: false, message: "All fields are required" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstname,
        lastname,
        email,
        phone
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Server error");
  }
});

router.delete('/deleteuser/:id', verifyUser, async(req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if(!deletedUser) {
      return res.status(404).json({status: false, message: "User not found"});
    }
    res.json({status: true, message: "User deleted successfully"});
  } catch (error) {
    console.error("Error deleting user:", error)
    res.status(500).send("Server error");
  }
})

router.post('/user-report', verifyUser, async(req, res) => {
  const {type, title, description, luggageId, userId} = req.body;
  console.log(req.body)

  if (!type || !title || !description ||  !userId) {
    console.error("Missing fields:", {type, title, description, userId});
    return res.status(400).json({status: false, message: "All fields are required"});
  }
  try {
    const newReport = new Report({
      type,
      title,
      description,
      userId,
      ...(type === "device-anomaly" && {luggageId})
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (error) {
    console.error("Error registering report:", error);
    res.status(500).json({status: false, message: "Server error"});
  }
});

router.get('/reports', async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports)
  } catch (error) {
    console.error("Error fetching reports:", error)
  }
})


router.put('/resolve-reports/:id', verifyUser, async (req, res) => {
  const status = req.body; 
  const reportId = req.params.id;

  try {
    const resolvedReport = await User.findByIdAndUpdate(reportId, {
      status
    }, { new: true });

    if (!resolvedReport) {
      return res.status(404).json({ status: false, message: "Report not found" }); 
    }
    res.status(200).json(resolvedReport); 
  } catch (error) {
    console.error('Error resolving report:', error);
    res.status(500).send('Server error');
  }
});

router.put('/update-reports/:id', verifyUser, async (req, res) => {
  const { status } = req.body; 
  const reportId = req.params.id; 
  console.log(status)

  try {
    const updatedReport = await Report.findByIdAndUpdate(reportId, {
      status
    }, { new: true }); 

    if (!updatedReport) {
      return res.status(404).json({ status: false, message: "Report not found" });
    }
    res.status(200).json(updatedReport); 
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).send('Server error');
  }
});


router.delete('/delete-report/:id', verifyUser, async (req, res) => {
  const reportId = req.params.id;
  try {
    const deletedReport = await Report.findByIdAndDelete(reportId)

    if(!deletedReport) {
      res.status(400).json({status: false, message: "Error deleting report"});
    }
    res.json(deletedReport)
  } catch (error) {
    res.status(500).send("Server error");
  }
})


router.put('/edit-profile', async (req, res) => {
  const { profile_dp, firstname, lastname, phone, userId } = req.body; // Extract userId here
  console.log("req body:",req.body);

  try {
    const editedProfileData = await User.findByIdAndUpdate(
      userId, // Use the userId from the request body
      { profile_dp, firstname, lastname, phone },
      { new: true } // Return the updated document
    );

    if (!editedProfileData) {
      return res.status(400).json({ status: false, message: "User not found" });
    }

    res.status(200).json({ status: true, message: "Profile updated successfully", user: editedProfileData });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
});

router.put('/modify-role/:id', verifyUser, async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body; 
  console.log(req.params)

  if (!userId || !role) {
    return res.status(400).json({ status: false, message: "User ID and role are required" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).send("Server error");
  }
});



module.exports = router;
