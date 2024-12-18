const crypto = require('crypto')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const plantInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    ref: 'Info',
    required: true,
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
  
})

const User = mongoose.model('PlantInfo', plantInfoSchema)

// Export the 'User' model for use in other parts of the application
module.exports = User