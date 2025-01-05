const mongoose = require('mongoose');

const BugReportSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
  image: {
    type: String, // URL or path to the uploaded screenshot
  },
  emailUpdates: {
    type: String,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address.',
    ],
  },
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Resolved', 'Closed'],
    default: 'New',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('BugReport', BugReportSchema);
