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
  slug: {
    type: String,
    // required: true,
    unique: true,
    trim: true,
  },
  affectedPlants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant', // References to plants that are affected or benefited by the critter
    },
  ],
  speciesCommonName: {
    type: String, // Common species name of the critter
    // required: true,
    trim: true,
  },
  roleInGarden: {
    type: String, // Explanation of why this critter is helpful for plants
    // required: true,
    trim: true,
  },
  identificationTips: {
    type: String, // Details on how to identify this critter
    // required: true,
    trim: true,
  },
  attractionMethods: {
    type: String, // How to attract this critter to your garden
    // required: true,
    trim: true,
  },
})

// Middleware to handle slug generation on save
beneficialCritterSchema.pre('save', function (next) {
  this.name = this.name.toLowerCase(); // Normalize name to lowercase
  this.slug = this.name.replace(/ /g, '-'); // Generate slug from name
  next();
});

// Middleware to handle slug generation on update
beneficialCritterSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.name) {
    // Normalize name and generate slug if name is being updated
    update.name = update.name.toLowerCase();
    update.slug = update.name.replace(/ /g, '-');
  }
  next();
});

const BeneficialCritter = mongoose.model(
  'BeneficialCritter',
  beneficialCritterSchema,
)

module.exports = BeneficialCritter
