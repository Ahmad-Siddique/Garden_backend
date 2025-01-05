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
        ref: 'PlantInfo',
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

  pests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pest',
    },
  ],
  diseases: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Disease',
    },
  ],
  beneficialCritters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BeneficialCritter',
    },
  ],
  nutrients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Nutrient',
    },
  ],

  vitamins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vitamin',
    },
  ],

  combativeRelationships: [
    {
      plant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plant', // The plant that has effects on this plant
        required: true,
      },
      effects: [
        {
          effect: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Effect', // Reference to the predefined effect
            required: true,
          },
          description: {
            type: String,
            trim: true,
            maxlength: 1000, // Custom description for this effect
            required: true,
          },
          causedBy: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Plant', // Plants causing the effect
            },
          ],
          affectedPlants: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Plant', // Plants affected by the effect
            },
          ],
        },
      ],
    },
  ],

  companionRelationships: [
    {
      plant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plant', // The plant that has effects on this plant
        required: true,
      },
      effects: [
        {
          effect: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Effect', // Reference to the predefined effect
            required: true,
          },
          description: {
            type: String,
            trim: true,
            maxlength: 1000, // Custom description for this effect
            required: true,
          },
          causedBy: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Plant', // Plants causing the effect
            },
          ],
          affectedPlants: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Plant', // Plants affected by the effect
            },
          ],
        },
      ],
    },
  ]
})

plantSchema.pre('save', function (next) {
  this.name = this.name.toLowerCase() // Normalize to lowercase
  next()
})
plantSchema.pre('save', function (next) {
  this.slug = this.name.toLowerCase().replace(/ /g, '-')
  next()
})

plantSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate()
  if (update.name) {
    // Normalize name and generate slug if name is being updated
    update.name = update.name.toLowerCase()
    update.slug = update.name.replace(/ /g, '-')
  }
  next()
})

module.exports = mongoose.model('Plant', plantSchema)
