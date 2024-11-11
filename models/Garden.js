const mongoose = require('mongoose')

const gardenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  area: String,
  createdAt: { type: Date, default: Date.now },
  layouts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GardenLayout' }],
})

module.exports = mongoose.model('Garden', gardenSchema)
