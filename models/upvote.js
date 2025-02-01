const mongoose = require('mongoose');

const upvoteSchema = new mongoose.Schema({
  featureRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FeatureRequest',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Ensures each user can upvote only once per feature request
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Upvote', upvoteSchema);
