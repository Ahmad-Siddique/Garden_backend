const mongoose = require('mongoose');

const effectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  image: {
    type: String, // URL for the effect's icon or image
    required: true,
  },
  type: {
    type: String,
    enum: ['companion', 'combative'], // Restrict to specific values
    required: true,
  },
});

module.exports = mongoose.model('Effect', effectSchema);
