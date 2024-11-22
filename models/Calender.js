const mongoose = require('mongoose')

const calendarSchema = new mongoose.Schema({
  startInside: {
    startDate: { type: String, default: 'N/A' },
    endDate: { type: String, default: 'N/A' },
    description: {
      type: String,
    },
  },
  transplant: {
    startDate: { type: String, default: 'N/A' },
    endDate: { type: String, default: 'N/A' },
    description: {
      type: String,
    },
  },
  sowOutside: {
    startDate: { type: String, default: 'N/A' },
    endDate: { type: String, default: 'N/A' },
    description: {
      type: String,
    },
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  plantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlantInfo',
    required: true,
  },
})

const Calendar = mongoose.model('Calendar', calendarSchema)

module.exports = Calendar
