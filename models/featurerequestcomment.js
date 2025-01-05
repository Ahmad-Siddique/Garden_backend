const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Anonymous',
    trim: true,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  featureRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FeatureRequest',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('FeatureRequestComment', CommentSchema);

