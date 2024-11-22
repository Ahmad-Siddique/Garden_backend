const mongoose = require('mongoose')

const nutritionSchema = new mongoose.Schema({
  image: {
    type: String, // URL for the nutrition image
    required: true,
    trim: true,
  },
  affectedPlants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant', // References to affected Plant IDs
    },
  ],
})

const Nutrition = mongoose.model('Nutrition', nutritionSchema)

module.exports = Nutrition
