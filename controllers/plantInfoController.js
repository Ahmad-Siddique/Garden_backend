const PlantInfo = require('../models/PlantInfo')

// Create new plant info
const createPlantInfo = async (req, res) => {
  try {
    const { name } = req.body
    const image = req.file ? req.file.path : null // Save the uploaded file path (URL from Cloudinary)

    const plantInfo = new PlantInfo({
      name,
      image,
    })

    await plantInfo.save()
    res.status(201).json({ success: true, data: plantInfo })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get all plant info
const getAllPlantInfo = async (req, res) => {
  try {
    const plantInfos = await PlantInfo.find()
    res.status(200).json({ success: true, data: plantInfos })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get plant info by ID
const getPlantInfoById = async (req, res) => {
  try {
    const { id } = req.params
    const plantInfo = await PlantInfo.findById(id)

    if (!plantInfo) {
      return res
        .status(404)
        .json({ success: false, message: 'Plant Info not found' })
    }

    res.status(200).json({ success: true, data: plantInfo })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Update plant info by ID
const updatePlantInfo = async (req, res) => {
  try {
    const { id } = req.params
    const { name } = req.body
    const image = req.file ? req.file.path : undefined // Check for new uploaded file

    const updateData = { name }
    if (image) {
      updateData.image = image // Update image only if a new file is uploaded
    }

    const plantInfo = await PlantInfo.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }, // Return updated document and validate updates
    )

    if (!plantInfo) {
      return res
        .status(404)
        .json({ success: false, message: 'Plant Info not found' })
    }

    res.status(200).json({ success: true, data: plantInfo })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Delete plant info by ID
const deletePlantInfo = async (req, res) => {
  try {
    const { id } = req.params

    const plantInfo = await PlantInfo.findByIdAndDelete(id)

    if (!plantInfo) {
      return res
        .status(404)
        .json({ success: false, message: 'Plant Info not found' })
    }

    res
      .status(200)
      .json({ success: true, message: 'Plant Info deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = {
  createPlantInfo,
  getAllPlantInfo,
  getPlantInfoById,
  updatePlantInfo,
  deletePlantInfo,
}
