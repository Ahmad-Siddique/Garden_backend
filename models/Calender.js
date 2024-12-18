const mongoose = require('mongoose')

const dateValidator = {
  validator: function (value) {
    return (
      (this.startDate === 'N/A' && this.endDate === 'N/A') ||
      (this.startDate && this.endDate)
    )
  },
  message: 'Both startDate and endDate should be provided or set to "N/A".',
}

const subSchema = {
  startDate: { type: String, default: 'N/A' },
  endDate: { type: String, default: 'N/A', validate: dateValidator },
  description: { type: String },
}

const calendarSchema = new mongoose.Schema({
  startInside: subSchema,
  transplant: subSchema,
  sowOutside: subSchema,
  harvest: subSchema,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  country:{
    type:String,
    default:null
  },
  state:{
    type:String,
    default:null
  },
  city:{
    type:String,
    default:null
  },
  place:{
    type:String,
    default:null
  },
  plantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant',
    required: true,
  },
})

const Calendar = mongoose.model('Calendar', calendarSchema)

module.exports = Calendar
