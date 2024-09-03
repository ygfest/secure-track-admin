const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const router = express.Router();


const verifyUser = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ status: false, message: "No token" });
    }
    const decoded = jwt.verify(token, process.env.KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ status: false, message: "Invalid token" });
  }
};

router.get('/verify', verifyUser, async (req, res) => {
  try {
     // Add this line for logging
    const user = await User.findOne({ email: req.user.email });
    //console.log('Decoded user:', user);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    return res.json({ status: true, message: "Authorized", user: { firstname: user.firstname, email: user.email, lastname: user.lastname, userID: user._id } });
    
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({ status: false, message: "Server error" });
  }
});


router.get('/users', async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (error) {
    console.error('Error fetching users data:', error);
    res.status(500).send('Server error');
  }
});

router.post('/signup', async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });  
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    user = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role: 'user', // Default role for new users
    });

    await user.save();

    // Generate JWT token with 60 minutes expiration
    const token = jwt.sign({ email: user.email }, process.env.KEY, { expiresIn: '60m' });

    // Log the token to the console
    console.log("Generated Token (Signup):", token);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 1000, // 60 minutes
      sameSite: 'None', // 'None' if cross-origin requests, 'Lax' or 'Strict' otherwise
      domain: 'secure-track-server.onrender.com'
    });
    
    // Set the JWT token in a cookie with a maxAge of 60 minutes
   

    return res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User is not registered" });
    }

    // Check if password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    // Update loggedInAt time
    user.loggedInAt = Date.now();
    await user.save();

    // Generate JWT token with 60 minutes expiration
    const token = jwt.sign({ email: user.email }, process.env.KEY, { expiresIn: '60m' });

    // Log the token to the console
    console.log("Generated Token (Signin):", token);

    // Set the JWT token in a cookie with a maxAge of 60 minutes
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 1000, // 60 minutes
      sameSite: 'None', // 'None' if cross-origin requests, 'Lax' or 'Strict' otherwise
      domain: 'secure-track-server.onrender.com'
    }); // 60 minutes in milliseconds

    return res.json({ status: true, message: "Login successful", token });
  } catch (error) {
    console.error("Error signing in:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not registered" });
    }

    const token = jwt.sign({ id: user._id }, process.env.KEY, { expiresIn: '5m' });

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'stefanosanesteban1018@gmail.com',
        pass: 'okzt xvlg gdqu jqsa'
      }
    });


    var mailOptions = {
      from: 'stefanosanesteban1018@gmail.com',
      to: email,
      subject: 'Reset Password',
      text: `http://localhost:5173/u/reset-password/${token}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.json({ message: "Email sent successfully" });
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
    await User.findByIdAndUpdate({ _id: id }, { password: hashedPassword });
    return res.json({ status: true, message: "Updated password" });
  } catch (err) {
    return res.status(400).json({ status: false, message: "Invalid token" });
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('token')
  return res.json({status: true})
})

module.exports = router;
