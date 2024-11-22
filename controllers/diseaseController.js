const Disease = require('../models/diseaseModel')

// Create new disease
const createDisease = async (req, res) => {
  try {
    const {
      image,
      affectedPlants,
      identification,
      damage,
      damagePrevention,
      physicalControl,
      chemicalControl,
    } = req.body

    const disease = new Disease({
      image,
      affectedPlants,
      identification,
      damage,
      damagePrevention,
      physicalControl,
      chemicalControl,
    })

    await disease.save()

    res.status(201).json({ success: true, data: disease })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get all diseases
const getAllDiseases = async (req, res) => {
  try {
    const diseases = await Disease.find().populate('affectedPlants')
    res.status(200).json({ success: true, data: diseases })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get disease by ID
const getDiseaseById = async (req, res) => {
  try {
    const { id } = req.params

    const disease = await Disease.findById(id).populate('affectedPlants')
    if (!disease) {
      return res
        .status(404)
        .json({ success: false, message: 'Disease not found' })
    }

    res.status(200).json({ success: true, data: disease })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Update disease by ID
const updateDisease = async (req, res) => {
  try {
    const { id } = req.params
    const {
      image,
      affectedPlants,
      identification,
      damage,
      damagePrevention,
      physicalControl,
      chemicalControl,
    } = req.body

    const disease = await Disease.findByIdAndUpdate(
      id,
      {
        image,
        affectedPlants,
        identification,
        damage,
        damagePrevention,
        physicalControl,
        chemicalControl,
      },
      { new: true, runValidators: true },
    )

    if (!disease) {
      return res
        .status(404)
        .json({ success: false, message: 'Disease not found' })
    }

    res.status(200).json({ success: true, data: disease })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Delete disease by ID
const deleteDisease = async (req, res) => {
  try {
    const { id } = req.params

    const disease = await Disease.findByIdAndDelete(id)
    if (!disease) {
      return res
        .status(404)
        .json({ success: false, message: 'Disease not found' })
    }

    res
      .status(200)
      .json({ success: true, message: 'Disease deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = {
  createDisease,
  getAllDiseases,
  getDiseaseById,
  updateDisease,
  deleteDisease,
}
