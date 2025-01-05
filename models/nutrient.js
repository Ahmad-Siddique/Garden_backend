const mongoose = require('mongoose')

const nutritionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    // required: true,
    unique: true,
    trim: true,
  },
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

nutritionSchema.pre('save', function (next) {
  this.name = this.name.toLowerCase() // Normalize to lowercase
  next()
})
nutritionSchema.pre('save', function (next) {
  this.slug = this.name.toLowerCase().replace(/ /g, '-')
  next()
})

nutritionSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.name) {
    // Normalize name and generate slug if name is being updated
    update.name = update.name.toLowerCase();
    update.slug = update.name.replace(/ /g, '-');
  }
  next();
});
const Nutrition = mongoose.model('Nutrient', nutritionSchema)

module.exports = Nutrition
