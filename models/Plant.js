const mongoose = require('mongoose')

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  slug: {
    type: String,
    // required: true,
    unique: true,
    trim: true,
  },
  scientificName: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
  },
  family: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    maxlength: 1000,
  },
  image1: {
    type: String, // URL to plant image
  },
  image2: {
    type: String, // URL to plant image
  },
  image3: {
    type: String, // URL to plant image
  },
  image4: {
    type: String, // URL to plant image
  },
  gardenImage: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  quickInfo: [
    {
      infoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'plantinfo',
        required: true,
      },
      title: {
        type: String,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
        maxlength: 500,
      },
    },
  ], // Array of associated Info with additional details

  // New fields with longer string capacity
  growingFromSeed: {
    type: String,
    maxlength: 5000, // Allows for long text entries
  },
  plantingConsiderations: {
    type: String,
    maxlength: 5000,
  },
  feeding: {
    type: String,
    maxlength: 5000,
  },
  harvest: {
    type: String,
    maxlength: 5000,
  },
  storage: {
    type: String,
    maxlength: 5000,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true,
  },
})

plantSchema.pre('save', function (next) {
  this.name = this.name.toLowerCase() // Normalize to lowercase
  next()
})
plantSchema.pre('save', function (next) {
  this.slug = this.name.toLowerCase().replace(/ /g, '-')
  next()
})

module.exports = mongoose.model('Plant', plantSchema)


