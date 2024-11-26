const Pests = require('../models/pestsModel')

// Create new pest
const createPest = async (req, res) => {
  try {
    const {
      image,
      name,
      affectedPlants,
      identification,
      damage,
      prevention,
      physicalControl,
      chemicalControl,
    } = req.body

    const pest = new Pests({
      image,
      name,
      affectedPlants,
      identification,
      damage,
      prevention,
      physicalControl,
      chemicalControl,
    })

    await pest.save()

    res.status(201).json({ success: true, data: pest })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get all pests
const getAllPests = async (req, res) => {
  try {
    const pests = await Pests.find().populate('affectedPlants')
    res.status(200).json({ success: true, data: pests })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get pest by ID
const getPestById = async (req, res) => {
  try {
    const { id } = req.params

    const pest = await Pests.findById(id).populate('affectedPlants')
    if (!pest) {
      return res.status(404).json({ success: false, message: 'Pest not found' })
    }

    res.status(200).json({ success: true, data: pest })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Update pest by ID
const updatePest = async (req, res) => {
  try {
    const { id } = req.params
    const {
      image,
      name,
      affectedPlants,
      identification,
      damage,
      prevention,
      physicalControl,
      chemicalControl,
    } = req.body

    const pest = await Pests.findByIdAndUpdate(
      id,
      {
        image,
        name,
        affectedPlants,
        identification,
        damage,
        prevention,
        physicalControl,
        chemicalControl,
      },
      { new: true, runValidators: true },
    )

    if (!pest) {
      return res.status(404).json({ success: false, message: 'Pest not found' })
    }

    res.status(200).json({ success: true, data: pest })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Delete pest by ID
const deletePest = async (req, res) => {
  try {
    const { id } = req.params

    const pest = await Pests.findByIdAndDelete(id)
    if (!pest) {
      return res.status(404).json({ success: false, message: 'Pest not found' })
    }

    res
      .status(200)
      .json({ success: true, message: 'Pest deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = {
  createPest,
  getAllPests,
  getPestById,
  updatePest,
  deletePest,
}
