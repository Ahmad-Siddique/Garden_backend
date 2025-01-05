const mongoose = require('mongoose');

const featureRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String, // Will store rich text as HTML or markdown
    required: true,
  },
  requestType: {
    type: String,
    enum: ['Feature', 'Plant', 'Variety', 'Bug', 'Other'],
    required: true,
  },
  name: {
    type: String,
    default: 'Anonymous',
  },
  status: {
    type: String,
    enum: ['In Progress', 'In Review', 'Planned'],
    default: 'In Review',
  },
  upvote: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('FeatureRequest', featureRequestSchema);
