const mongoose = require('mongoose')

const plantVarietySchema = new mongoose.Schema({
  plantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  varietyImage: {
    type: String, // URL to an image of this specific variety
  },
  titleImage: {
    type: String, // URL to an image representing the title of this variety
  },
  description: {
    type: String,
    maxlength: 1000,
  },
  spacing: {
    type: String,
    
  },
  purchaseLink: {
    type: String, // URL to a purchase page for this variety
  },
})

module.exports = mongoose.model('PlantVariety', plantVarietySchema)
