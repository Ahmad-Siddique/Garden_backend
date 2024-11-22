const PlantVariety = require('../models/plantVarietyModel')

// Create a new plant variety
const createPlantVariety = async (req, res) => {
  try {
    const {
      plantId,
      title,
      varietyImage,
      titleImage,
      description,
      purchaseLink,
      spacing,
    } = req.body

    const plantVariety = new PlantVariety({
      plantId,
      title,
      varietyImage,
      titleImage,
      description,
      purchaseLink,
      spacing,
    })

    await plantVariety.save()
    res.status(201).json({ success: true, data: plantVariety })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get all plant varieties
const getAllPlantVarieties = async (req, res) => {
  try {
    const { plantId } = req.query

    // Optionally filter by plantId
    const filter = {}
    if (plantId) filter.plantId = plantId

    const plantVarieties = await PlantVariety.find(filter).populate('plantId')
    res.status(200).json({ success: true, data: plantVarieties })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get a single plant variety by ID
const getPlantVarietyById = async (req, res) => {
  try {
    const { id } = req.params

    const plantVariety = await PlantVariety.findById(id).populate('plantId')

    if (!plantVariety) {
      return res
        .status(404)
        .json({ success: false, message: 'Plant Variety not found' })
    }

    res.status(200).json({ success: true, data: plantVariety })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Update a plant variety by ID
const updatePlantVariety = async (req, res) => {
  try {
    const { id } = req.params
    const {
      plantId,
      title,
      varietyImage,
      titleImage,
      description,
      purchaseLink,
      spacing,
    } = req.body

    const plantVariety = await PlantVariety.findByIdAndUpdate(
      id,
      {
        plantId,
        title,
        varietyImage,
        titleImage,
        description,
        purchaseLink,
        spacing,
      },
      { new: true, runValidators: true },
    )

    if (!plantVariety) {
      return res
        .status(404)
        .json({ success: false, message: 'Plant Variety not found' })
    }

    res.status(200).json({ success: true, data: plantVariety })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Delete a plant variety by ID
const deletePlantVariety = async (req, res) => {
  try {
    const { id } = req.params

    const plantVariety = await PlantVariety.findByIdAndDelete(id)

    if (!plantVariety) {
      return res
        .status(404)
        .json({ success: false, message: 'Plant Variety not found' })
    }

    res
      .status(200)
      .json({ success: true, message: 'Plant Variety deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = {
  createPlantVariety,
  getAllPlantVarieties,
  getPlantVarietyById,
  updatePlantVariety,
  deletePlantVariety,
}
