const mongoose = require('mongoose')

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  scientificName: {
    type: String,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlantCategories',
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

  // calendar: {
  //   startInside: {
  //     type: {
  //       startDate: { type: Date },
  //       endDate: { type: Date },
  //     },
  //     default: 'N/A', // Indicates not applicable if no dates provided
  //   },
  //   transplant: {
  //     type: {
  //       startDate: { type: Date },
  //       endDate: { type: Date },
  //     },
  //     default: 'N/A',
  //   },
  //   sowOutside: {
  //     type: {
  //       startDate: { type: Date },
  //       endDate: { type: Date },
  //     },
  //     default: 'N/A',
  //   },
  // },

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
})

plantSchema.pre('save', function (next) {
  this.name = this.name.toLowerCase() // Normalize to lowercase
  next()
})


module.exports = mongoose.model('Plant', plantSchema)


