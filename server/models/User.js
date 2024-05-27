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
    required: true,
  },
  role: {
    type: String,
    default: "user", // Default role is "user"
  },
  loggedInAt: {
    type: Date,
    default: Date.now // Default loggedInAt to current date and time
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
