const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const admin = require("firebase-admin");
dotenv.config();

const UserRouter = require("./routes/user");
const LuggageRouter = require("./routes/luggage");
const uploadRouter = require("./routes/uploadthing");
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://secure-track-sse.vercel.app"],
    credentials: true,
  })
);
app.use(cookieParser());

// Routes
app.use("/auth", UserRouter);
app.use("/luggage-router", LuggageRouter);
app.use("/api/uploadthing", uploadRouter);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_STRING, { connectTimeoutMS: 10000 })
  .then(() => console.log("Successfully connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

mongoose.connection.on("connected", () =>
  console.log("Mongoose connected to MongoDB Atlas")
);
mongoose.connection.on("error", (err) =>
  console.error("Mongoose connection error:", err)
);
mongoose.connection.on("disconnected", () =>
  console.log("Mongoose disconnected")
);

// Firebase Admin SDK Initialization
const serviceAccount = {
  type: "service_account",
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.GOOGLE_CLIENT_EMAIL}`,
  universe_domain: "googleapis.com",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://track-bedd0-default-rtdb.asia-southeast1.firebasedatabase.app",
});

const db = admin.database();
const ref = db.ref("tamperData");
const ref2 = db.ref("Temperature");
const ref3 = db.ref("movementData");

// Models and Schemas
const TamperDataModel =
  mongoose.models.TamperDetectionLog ||
  mongoose.model(
    "TamperDetectionLog",
    new mongoose.Schema({
      firebaseId: { type: String, required: true, unique: true },
      luggage_tag_number: { type: String, default: "ST123456789" },
      alert: String,
      tamperTime: { type: Date, required: true },
    })
  );

const TempDataModel =
  mongoose.models.TempLog ||
  mongoose.model(
    "TempLog",
    new mongoose.Schema(
      {
        firebaseId: { type: String, required: true, unique: true },
        luggage_tag_number: { type: String, default: "ST123456789" },
        temperature: { type: Number },
        timeStamp: { type: Date, required: true },
      },
      { collection: "tempLogzzz" }
    )
  );

const FallDataModel =
  mongoose.models.FallDetectionLog ||
  mongoose.model(
    "FallDetectionLog",
    new mongoose.Schema(
      {
        firebaseId: { type: String, required: true, unique: true },
        luggage_tag_number: { type: String, default: "ST123456789" },
        message: { type: String, required: true },
        fall_time: { type: Date, required: true },
        severity: { type: String, required: true },
      },
      { collection: "fallDatazz" }
    )
  );

// Sync Data on Startup
async function syncAllData() {
  await syncInitialTamperData();
  await syncInitialTempData();
  await syncInitialFallData();

  // After syncing initial data, start listening for real-time updates
  startRealTimeListeners();
}

// Sync Functions
async function syncInitialTamperData() {
  try {
    const snapshot = await ref.once("value");
    const tamperData = snapshot.val();
    if (tamperData) {
      for (const key in tamperData) {
        if (!(await TamperDataModel.findOne({ firebaseId: key }))) {
          await TamperDataModel.create({
            firebaseId: key,
            luggage_tag_number: "ST123456789",
            alert: tamperData[key].alert,
            tamperTime: Date.now(),
          });
        }
      }
      console.log("Initial tamper data synced successfully.");
    } else {
      console.log("No initial tamper data found.");
    }
  } catch (error) {
    console.error("Error syncing tamper data:", error);
  }
}

async function syncInitialTempData() {
  try {
    const snapshot = await ref2.once("value");
    const tempData = snapshot.val();

    if (tempData) {
      for (const key in tempData) {
        const existingDoc = await TempDataModel.findOne({ firebaseId: key });
        if (!existingDoc) {
          await TempDataModel.create({
            firebaseId: key,
            luggage_tag_number: "ST123456789",
            temperature: tempData[key].Temperature,
            timeStamp: Date.now(),
          });
        }
      }
      console.log("Initial temp data synced to MongoDB successfully");
    } else {
      console.log("No initial temp data found in Firebase");
    }
  } catch (error) {
    console.error("Error syncing initial data:", error);
  }
}

async function syncInitialFallData() {
  try {
    const snapshot = await ref3.once("value");
    const fallData = snapshot.val();
    if (fallData) {
      for (const key in fallData) {
        if (!(await FallDataModel.findOne({ firebaseId: key }))) {
          await FallDataModel.create({
            firebaseId: key,
            luggage_tag_number: "ST123456789",
            message: fallData[key].movement,
            severity: fallData[key].severity,
            fall_time: Date.now(),
          });
        }
      }
      console.log("Initial fall data synced successfully.");
    } else {
      console.log("No initial fall data found.");
    }
  } catch (error) {
    console.error("Error syncing fall data:", error);
  }
}

// Start Real-Time Listeners
function startRealTimeListeners() {
  // Impact Data Listener
  ref.on("child_added", async (snapshot) => {
    const newData = snapshot.val();
    const firebaseId = snapshot.key;
    try {
      const existingDoc = await TamperDataModel.findOne({
        firebaseId: firebaseId,
      });
      if (!existingDoc) {
        await TamperDataModel.create({
          firebaseId: firebaseId,
          luggage_tag_number: "ST123456789",
          alert: newData.alert,
          tamperTime: Date.now(),
        });
        console.log("New tamper data added to MongoDB");
      }
    } catch (error) {
      console.error("Error adding new tamper data to MongoDB:", error);
    }
  });

  ref2.on("child_added", async (snapshot) => {
    const newData = snapshot.val();
    const firebaseId = snapshot.key;
    try {
      const existingDoc = await TempDataModel.findOne({
        firebaseId: firebaseId,
      });
      if (!existingDoc) {
        await TempDataModel.create({
          firebaseId: firebaseId,
          luggage_tag_number: "ST123456789",
          temperature: newData.Temperature,
          timeStamp: Date.now(),
        });
        console.log("New Temp data added to MongoDB");
      }
    } catch (error) {
      console.error("Error adding new Temp data to MongoDB:", error);
    }
  });

  ref3.on("child_added", async (snapshot) => {
    const newData = snapshot.val();
    const firebaseId = snapshot.key;
    try {
      const existingDoc = await FallDataModel.findOne({
        firebaseId: firebaseId,
      });
      if (!existingDoc) {
        await FallDataModel.create({
          firebaseId: firebaseId,
          luggage_tag_number: "ST123456789",
          message: newData.movement,
          severity: newData.severity,
          fall_time: Date.now(),
        });
        console.log("New Fall data added to MongoDB");
      }
    } catch (error) {
      console.error("Error adding new Fall data to MongoDB:", error);
    }
  });

  // Child Changed Listeners
  ref.on("child_changed", async (snapshot) => {
    const firebaseId = snapshot.key;
    const updatedData = snapshot.val();
    try {
      const doc = await TamperDataModel.findOne({ firebaseId });
      if (doc) {
        await doc.updateOne({ alert: updatedData.alert });
        console.log("Impact data updated in MongoDB.");
      }
    } catch (error) {
      console.error("Error updating impact data:", error);
    }
  });

  ref2.on("child_changed", async (snapshot) => {
    const firebaseId = snapshot.key;
    const updatedData = snapshot.val();
    try {
      const doc = await TempDataModel.findOne({ firebaseId });
      if (doc) {
        await doc.updateOne({ temperature: updatedData.Temperature });
        console.log("Temperature data updated in MongoDB.");
      }
    } catch (error) {
      console.error("Error updating temperature data:", error);
    }
  });

  ref3.on("child_changed", async (snapshot) => {
    const firebaseId = snapshot.key;
    const updatedData = snapshot.val();
    try {
      const doc = await FallDataModel.findOne({ firebaseId });
      if (doc) {
        await doc.updateOne({ message: updatedData.movement });
        console.log("Fall data updated in MongoDB.");
      }
    } catch (error) {
      console.error("Error updating fall data:", error);
    }
  });

  ref.on("child_removed", async (snapshot) => {
    const firebaseId = snapshot.key;
    try {
      await TamperDataModel.deleteOne({ firebaseId: firebaseId });
      console.log("Impact Data removed from MongoDB");
    } catch (error) {
      console.error("Error removing impact data from MongoDB:", error);
    }
  });

  ref2.on("child_removed", async (snapshot) => {
    const firebaseId = snapshot.key;
    try {
      await TempDataModel.deleteOne({ firebaseId: firebaseId });
      console.log("Temp Data removed from MongoDB");
    } catch (error) {
      console.error("Error removing temp data from MongoDB:", error);
    }
  });

  ref3.on("child_removed", async (snapshot) => {
    const firebaseId = snapshot.key;
    try {
      await FallDataModel.deleteOne({ firebaseId: firebaseId });
      console.log("Fall Data removed from MongoDB");
    } catch (error) {
      console.error("Error removing fall data from MongoDB:", error);
    }
  });
}

syncAllData();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

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
