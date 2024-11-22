const PlantCategory = require('../models/PlantCategories')

// Create a new plant category
exports.createPlantCategory = async (req, res) => {
  try {
    const plantCategory = new PlantCategory(req.body)
    await plantCategory.save()
    res
      .status(201)
      .json({
        message: 'Plant category created successfully!',
        data: plantCategory,
      })
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Error creating plant category', error: error.message })
  }
}

// Get all plant categories
exports.getPlantCategories = async (req, res) => {
  try {
    const plantCategories = await PlantCategory.find()
    res.status(200).json({ data: plantCategories })
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Error fetching plant categories',
        error: error.message,
      })
  }
}

// Get a single plant category by ID
exports.getPlantCategoryById = async (req, res) => {
  try {
    const plantCategory = await PlantCategory.findById(req.params.id)
    if (!plantCategory) {
      return res.status(404).json({ message: 'Plant category not found' })
    }
    res.status(200).json({ data: plantCategory })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching plant category', error: error.message })
  }
}

// Update a plant category by ID
exports.updatePlantCategory = async (req, res) => {
  try {
    const plantCategory = await PlantCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    )
    if (!plantCategory) {
      return res.status(404).json({ message: 'Plant category not found' })
    }
    res
      .status(200)
      .json({
        message: 'Plant category updated successfully',
        data: plantCategory,
      })
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Error updating plant category', error: error.message })
  }
}

// Delete a plant category by ID
exports.deletePlantCategory = async (req, res) => {
  try {
    const plantCategory = await PlantCategory.findByIdAndDelete(req.params.id)
    if (!plantCategory) {
      return res.status(404).json({ message: 'Plant category not found' })
    }
    res.status(200).json({ message: 'Plant category deleted successfully' })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting plant category', error: error.message })
  }
}



