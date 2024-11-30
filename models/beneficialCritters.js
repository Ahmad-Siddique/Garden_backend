const mongoose = require('mongoose')

const beneficialCritterSchema = new mongoose.Schema({
  imageUrl: {
    type: String, // URL for the image of the beneficial critter
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required:true
  }
  ,
  affectedPlants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant', // References to plants that are affected or benefited by the critter
    },
  ],
  speciesCommonName: {
    type: String, // Common species name of the critter
    required: true,
    trim: true,
  },
  roleInGarden: {
    type: String, // Explanation of why this critter is helpful for plants
    required: true,
    trim: true,
  },
  identificationTips: {
    type: String, // Details on how to identify this critter
    required: true,
    trim: true,
  },
  attractionMethods: {
    type: String, // How to attract this critter to your garden
    required: true,
    trim: true,
  },
})

const BeneficialCritter = mongoose.model(
  'BeneficialCritter',
  beneficialCritterSchema,
)

module.exports = BeneficialCritter
