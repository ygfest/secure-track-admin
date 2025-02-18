const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function() { return !this.googleId; }, // Password required if no Google ID
  },
  phone: {
    type: String,
  },
  role: {
    type: String,
    default: "user", 
  },
  loggedInAt: {
    type: Date,
    default: Date.now 
  },
  status: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  profile_dp: {
    type: String, 
  },
  isLocationOn: {
    type: Boolean,
    default: true,
  },
  latitude: {
    type: Number,
    default: null
  },
  longitude: {
    type: Number,
    default: null
  },
  locationUpdatedAt: {
    type: Date,
    default: null,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows for users with either Google ID or email, but not both
  },
  geofenceRadius: {
    type: Number,
    required: true,
    default: 50,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
