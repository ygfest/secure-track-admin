const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Luggage = require("../models/Luggage");
const Report = require("../models/Report");

const router = express.Router();

const verifyUser = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ status: false, message: "No token" });
    }
    const decoded = jwt.verify(token, process.env.KEY);
    if (!decoded.id) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid token payload" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ status: false, message: "Invalid token" });
  }
};

router.get("/verify", verifyUser, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    return res.json({
      status: true,
      message: "Authorized",
      user: {
        firstname: user.firstname,
        email: user.email,
        lastname: user.lastname,
        role: user.role,
        userID: user._id,
        isLocationOn: user.isLocationOn,
        latitude: user.latitude,
        longitude: user.longitude,
        locationUpdatedAt: user.locationUpdatedAt,
        profile_dp: user.profile_dp,
        loggedInAt: user.loggedInAt,
        createdAt: user.createdAt,
        phone: user.phone,
        googleId: user.googleId,
        geofenceRadius: user.geofenceRadius,
      },
    });
  } catch (error) {
    console.error("Error verifying user:", error);
    return res.status(500).json({ status: false, message: "Server error" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users data:", error);
    res.status(500).send("Server error");
  }
});

// Import any notification service or use an event emitter here
const EventEmitter = require("events");
const notificationEmitter = new EventEmitter();

router.post("/signup", async (req, res) => {
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
      role: "user",
    });
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.KEY,
      { expiresIn: "60m" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 1000, // 60 minutes
      sameSite: "None",
    });

    // Emit new user registration event
    notificationEmitter.emit("newUser", {
      firstname,
      lastname,
      createdAt: user.createdAt,
    });

    return res.status(201).json({
      status: true,
      message: "User registered successfully",
      token,
      user: { email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/admin-user-register", async (req, res) => {
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
      role: "user",
    });

    await user.save();

    return res.status(201).json({
      status: true,
      message: "User registered successfully",
      user: { email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/signin", async (req, res) => {
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

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.KEY,
      { expiresIn: "60m" }
    );

    console.log("Generated Token (Signin):", token);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 1000, // 60 minutes
      sameSite: "None",
    });

    console.log("Cookies sent:", req.cookies);

    return res.json({
      status: true,
      message: "Login successful",
      token,
      user: { email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Error signing in:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/save-google-user", async (req, res) => {
  console.log("Received request to /save-google-user");
  const { googleId, email, firstName, lastName, picture } = req.body;
  console.log(req.body);

  try {
    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        user.googleId = googleId;
        user.firstname = firstName;
        user.lastname = lastName;
        user.profile_dp = picture;
        user.loggedInAt = Date.now();
        await user.save();
        console.log("Existing user updated in MongoDB:", user);
      } else {
        user = new User({
          googleId,
          email,
          firstname: firstName,
          lastname: lastName,
          role: "user",
          profile_dp: picture,
          loggedInAt: Date.now(),
        });
        await user.save();
        console.log("New user saved to MongoDB:", user);
      }
    } else {
      user.email = email;
      user.firstname = firstName;
      user.lastname = lastName;
      user.profile_dp = picture;
      user.loggedInAt = Date.now();
      await user.save();
      console.log("Existing user updated:", user);
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.KEY,
      { expiresIn: "60m" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 1000,
      sameSite: "None",
    });
    console.log("Cookies sent with token:", token);

    return res
      .status(200)
      .json({ message: "User information processed successfully", token });
  } catch (error) {
    console.error("Error in /save-google-user route:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not registered" });
    }

    const token = jwt.sign({ id: user._id }, process.env.KEY, {
      expiresIn: "5m",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_PASS_KEY,
      },
    });

    const mailOptions = {
      from: process.env.GOOGLE_USER,
      to: email,
      subject: "Secure Track Account Reset Password",
      text: `${process.env.REACT_APP_API_URL}reset-password/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.json({ status: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("Error in forgot password:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/reset-password", async (req, res) => {
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

router.post("/reset-password-edit", async (req, res) => {
  const { currentPassword, newPassword, userId } = req.body;

  try {
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // If the user has a googleId, skip current password validation
    if (!user.googleId) {
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ status: false, message: "Invalid current password" });
      }
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password in the database
    user.password = hashedPassword;
    await user.save();

    return res.json({ status: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Error resetting password:", err);
    return res.status(500).json({
      status: false,
      message: "An error occurred while resetting the password",
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ status: true });
});

router.put("/update-location", verifyUser, async (req, res) => {
  const { latitude, longitude, isLocationOn, locationUpdatedAt } = req.body;
  const userId = req.user.id; // Extracted from the verified token
  console.log(req.body);
  console.log("Updating location for user ID:", userId); // Add this line to log the userId

  if (!userId) {
    return res
      .status(400)
      .json({ status: "error", message: "User ID is missing" });
  }

  try {
    await User.findByIdAndUpdate(
      userId,
      {
        latitude,
        longitude,
        isLocationOn,
        locationUpdatedAt,
      },
      { new: true }
    );

    res.json({ status: "success", message: "Location updated successfully" });
  } catch (error) {
    console.error("Failed to update location:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to update location" });
  }
});

router.delete("/delete-location", verifyUser, async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res
      .status(400)
      .json({ status: "error", message: "User ID not found" });
  }

  try {
    await User.findByIdAndUpdate(userId, {
      $unset: { latitude: "", longitude: "" },
    });

    res.json({ status: "success", message: "Location deleted successfully" });
  } catch (error) {
    console.error("Failed to delete location:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to delete location" });
  }
});

router.put("/updateuser/:id", verifyUser, async (req, res) => {
  const { firstname, lastname, email, phone } = req.body;
  const userId = req.params.id;

  // Corrected the conditional to only check if any required fields are missing
  if (!firstname || !lastname || !email) {
    return res
      .status(400)
      .json({ status: false, message: "All fields are required" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstname,
        lastname,
        email,
        phone,
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

router.delete("/deleteuser/:id", verifyUser, async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    res.json({ status: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Server error");
  }
});

router.put("/update-user-status/:id", verifyUser, async (req, res) => {
  const { status } = req.body;
  const userId = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        status,
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

router.post("/user-report", verifyUser, async (req, res) => {
  const { type, title, description, luggageId, userId } = req.body;
  console.log(req.body);

  if (!type || !title || !description || !userId) {
    console.error("Missing fields:", { type, title, description, userId });
    return res
      .status(400)
      .json({ status: false, message: "All fields are required" });
  }
  try {
    const newReport = new Report({
      type,
      title,
      description,
      userId,
      ...(type === "device-anomaly" && { luggageId }),
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (error) {
    console.error("Error registering report:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
});
//get all reports
router.get("/reports", async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
  }
});

{
  /*router.get("/user-reports/", verifyUser, async (req, res) => {
  const userId = req.user.id;

  try {
    const userReports = await Report.find({ userId: userId });
    if (!userReports || userReports.length === 0) {
      res.status(404).json({ status: false, messgae: "No report found" });
    }
    res.status(200).json(userReports);
  } catch (error) {
    console.error("Error fetching user reports");
    res.status(400);
  }
});*/
}

router.get("/user-reports", verifyUser, async (req, res) => {
  try {
    // Set headers for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    // Function to fetch user reports based on userId
    const sendReportsUpdate = async () => {
      const userId = req.user.id; // Accessing userId from req.user.id after JWT authentication
      const userReports = await Report.find({ userId: userId });

      if (!userReports || userReports.length === 0) {
        const noReportsData = { reports: [] }; // Send empty reports if no data found
        res.write(`data: ${JSON.stringify(noReportsData)}\n\n`);
      } else {
        const data = { reports: userReports };
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      }
    };

    const intervalId = setInterval(sendReportsUpdate, 10000);

    // Initial report update when client connects
    sendReportsUpdate();

    req.on("close", () => {
      clearInterval(intervalId);
      res.end();
    });
  } catch (error) {
    console.error("Error in SSE route:", error);
    res.status(500).send("Server error");
  }
});

router.put("/resolve-reports/:id", verifyUser, async (req, res) => {
  const status = req.body;
  const reportId = req.params.id;

  try {
    const resolvedReport = await User.findByIdAndUpdate(
      reportId,
      {
        status,
      },
      { new: true }
    );

    if (!resolvedReport) {
      return res
        .status(404)
        .json({ status: false, message: "Report not found" });
    }
    res.status(200).json(resolvedReport);
  } catch (error) {
    console.error("Error resolving report:", error);
    res.status(500).send("Server error");
  }
});

router.put("/update-reports/:id", verifyUser, async (req, res) => {
  const { status } = req.body;
  const reportId = req.params.id;
  //console.log(status)

  try {
    const updatedReport = await Report.findByIdAndUpdate(
      reportId,
      {
        status,
      },
      { new: true }
    );

    if (!updatedReport) {
      return res
        .status(404)
        .json({ status: false, message: "Report not found" });
    }
    res.status(200).json(updatedReport);
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).send("Server error");
  }
});

router.delete("/delete-report/:id", verifyUser, async (req, res) => {
  const reportId = req.params.id;
  try {
    const deletedReport = await Report.findByIdAndDelete(reportId);

    if (!deletedReport) {
      res.status(400).json({ status: false, message: "Error deleting report" });
    }
    res.json(deletedReport);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.put("/edit-profile", async (req, res) => {
  const { profile_dp, firstname, lastname, phone, userId } = req.body; // Extract userId here
  console.log("req body:", req.body);

  try {
    const editedProfileData = await User.findByIdAndUpdate(
      userId, // Use the userId from the request body
      { profile_dp, firstname, lastname, phone },
      { new: true } // Return the updated document
    );

    if (!editedProfileData) {
      return res.status(400).json({ status: false, message: "User not found" });
    }

    res.status(200).json({
      status: true,
      message: "Profile updated successfully",
      user: editedProfileData,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
});

router.put("/modify-role/:id", verifyUser, async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;
  console.log(req.params);

  if (!userId || !role) {
    return res
      .status(400)
      .json({ status: false, message: "User ID and role are required" });
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

router.put("/select-radius/:id", verifyUser, async (req, res) => {
  const { radius } = req.body;
  const userId = req.params.id;

  try {
    const updatedRadius = await User.findByIdAndUpdate(
      userId,
      {
        geofenceRadius: radius,
      },
      { new: true }
    );

    if (!updatedRadius) {
      res.status(404).json({ status: false, message: "User not found" });
    }
    res.status(200).json(updatedRadius);
  } catch (error) {
    console.log("Error updating radius");
    res.status(500).json({ status: false, message: "Error updating radius" });
  }
});

module.exports = router;
