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
  createdAt: {
    type: Date,
    default: Date.now
  },
  profile_dp: {
    type: String, 
  },
  latitude: {
    type: Number,
    default: null
  },
  longitude: {
    type: Number,
    default: null
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows for users with either Google ID or email, but not both
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
