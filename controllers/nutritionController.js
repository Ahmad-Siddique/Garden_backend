const Nutrition = require('../models/nutritionModel')

// Create new nutrition
const createNutrition = async (req, res) => {
  try {
    const { image, affectedPlants } = req.body

    const nutrition = new Nutrition({ image, affectedPlants })
    await nutrition.save()

    res.status(201).json({ success: true, data: nutrition })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get all nutritions
const getAllNutritions = async (req, res) => {
  try {
    const nutritions = await Nutrition.find().populate('affectedPlants')
    res.status(200).json({ success: true, data: nutritions })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get nutrition by ID
const getNutritionById = async (req, res) => {
  try {
    const { id } = req.params

    const nutrition = await Nutrition.findById(id).populate('affectedPlants')
    if (!nutrition) {
      return res
        .status(404)
        .json({ success: false, message: 'Nutrition not found' })
    }

    res.status(200).json({ success: true, data: nutrition })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Update nutrition by ID
const updateNutrition = async (req, res) => {
  try {
    const { id } = req.params
    const { image, affectedPlants } = req.body

    const nutrition = await Nutrition.findByIdAndUpdate(
      id,
      { image, affectedPlants },
      { new: true, runValidators: true },
    )

    if (!nutrition) {
      return res
        .status(404)
        .json({ success: false, message: 'Nutrition not found' })
    }

    res.status(200).json({ success: true, data: nutrition })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Delete nutrition by ID
const deleteNutrition = async (req, res) => {
  try {
    const { id } = req.params

    const nutrition = await Nutrition.findByIdAndDelete(id)
    if (!nutrition) {
      return res
        .status(404)
        .json({ success: false, message: 'Nutrition not found' })
    }

    res
      .status(200)
      .json({ success: true, message: 'Nutrition deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = {
  createNutrition,
  getAllNutritions,
  getNutritionById,
  updateNutrition,
  deleteNutrition,
}
