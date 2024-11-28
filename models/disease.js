const mongoose = require('mongoose')

const diseaseSchema = new mongoose.Schema({
  image: {
    type: String, // URL for the disease image
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    // required: true,
    unique: true,
    trim: true,
  },
  affectedPlants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant', // References to affected Plant IDs
    },
  ],
  identification: {
    type: String, // Details on how to identify the disease
    required: true,
    trim: true,
  },
  damage: {
    type: String, // Information on the damage caused by the disease
    // required: true,
    trim: true,
  },
  damagePrevention: {
    type: String, // Prevention measures for the damage caused by the disease
    required: true,
    trim: true,
  },
  physicalControl: {
    type: String, // Physical methods to control the disease
    required: true,
    trim: true,
  },
  chemicalControl: {
    type: String, // Chemical methods to control the disease
    required: true,
    trim: true,
  },
})


diseaseSchema.pre('save', function (next) {
  this.name = this.name.toLowerCase() // Normalize to lowercase
  next()
})
diseaseSchema.pre('save', function (next) {
  this.slug = this.name.toLowerCase().replace(/ /g, '-')
  next()
})
const Disease = mongoose.model('Disease', diseaseSchema)

module.exports = Disease
