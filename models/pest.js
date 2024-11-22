const mongoose = require('mongoose')

const pestsSchema = new mongoose.Schema({
  image: {
    type: String, // URL for the pest image
    required: true,
    trim: true,
  },
  affectedPlants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant', // References to affected Plant IDs
    },
  ],
  identification: {
    type: String, // Details on how to identify the pest
    required: true,
    trim: true,
  },
  damage: {
    type: String, // Information on the damage caused by the pest
    required: true,
    trim: true,
  },
  prevention: {
    type: String, // Preventative measures to avoid the pest
    required: true,
    trim: true,
  },
  physicalControl: {
    type: String, // Non-chemical methods to control the pest
    required: true,
    trim: true,
  },
  chemicalControl: {
    type: String, // Chemical methods to control the pest
    required: true,
    trim: true,
  },
})

const Pests = mongoose.model('Pests', pestsSchema)

module.exports = Pests
