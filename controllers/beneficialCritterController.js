const BeneficialCritter = require('../models/beneficialCritterModel')

// Create new beneficial critter
const createBeneficialCritter = async (req, res) => {
  try {
    const {
      imageUrl,
      affectedPlants,
      speciesCommonName,
      roleInGarden,
      identificationTips,
      attractionMethods,
    } = req.body

    const beneficialCritter = new BeneficialCritter({
      imageUrl,
      affectedPlants,
      speciesCommonName,
      roleInGarden,
      identificationTips,
      attractionMethods,
    })

    await beneficialCritter.save()

    res.status(201).json({ success: true, data: beneficialCritter })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get all beneficial critters
const getAllBeneficialCritters = async (req, res) => {
  try {
    const beneficialCritters =
      await BeneficialCritter.find().populate('affectedPlants')
    res.status(200).json({ success: true, data: beneficialCritters })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get beneficial critter by ID
const getBeneficialCritterById = async (req, res) => {
  try {
    const { id } = req.params

    const beneficialCritter =
      await BeneficialCritter.findById(id).populate('affectedPlants')
    if (!beneficialCritter) {
      return res
        .status(404)
        .json({ success: false, message: 'Beneficial Critter not found' })
    }

    res.status(200).json({ success: true, data: beneficialCritter })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Update beneficial critter by ID
const updateBeneficialCritter = async (req, res) => {
  try {
    const { id } = req.params
    const {
      imageUrl,
      affectedPlants,
      speciesCommonName,
      roleInGarden,
      identificationTips,
      attractionMethods,
    } = req.body

    const beneficialCritter = await BeneficialCritter.findByIdAndUpdate(
      id,
      {
        imageUrl,
        affectedPlants,
        speciesCommonName,
        roleInGarden,
        identificationTips,
        attractionMethods,
      },
      { new: true, runValidators: true },
    )

    if (!beneficialCritter) {
      return res
        .status(404)
        .json({ success: false, message: 'Beneficial Critter not found' })
    }

    res.status(200).json({ success: true, data: beneficialCritter })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Delete beneficial critter by ID
const deleteBeneficialCritter = async (req, res) => {
  try {
    const { id } = req.params

    const beneficialCritter = await BeneficialCritter.findByIdAndDelete(id)
    if (!beneficialCritter) {
      return res
        .status(404)
        .json({ success: false, message: 'Beneficial Critter not found' })
    }

    res
      .status(200)
      .json({
        success: true,
        message: 'Beneficial Critter deleted successfully',
      })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = {
  createBeneficialCritter,
  getAllBeneficialCritters,
  getBeneficialCritterById,
  updateBeneficialCritter,
  deleteBeneficialCritter,
}
