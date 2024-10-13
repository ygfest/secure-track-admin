const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,  // Ensure this is referencing a valid User model
    ref: 'User',
    required: [true, 'User is required'],  // Adding a custom error message for validation
  },
  type: {
    type: String,
    required: [true, 'Report type is required'], // Custom error message
  },
  title: {
    type: String,
    required: [true, 'Title is required'], // Custom error message
    trim: true,  // Trims any extra whitespace
  },
  description: {
    type: String,
    required: [true, 'Description is required'], // Custom error message
    trim: true,  // Trims any extra whitespace
  },
  luggageId: {
    type: mongoose.Schema.Types.ObjectId, 
  },
  status: {
    type: String,
    default:"In Progress"
  }
}, { timestamps: true });  // Adds createdAt and updatedAt fields

module.exports = mongoose.model('Report', ReportSchema);
