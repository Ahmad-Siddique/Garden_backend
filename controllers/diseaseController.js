const Disease = require('../models/disease')
const Plant = require('../models/Plant')

// Create new disease
const createDisease = async (req, res) => {
  try {
    const {
      name,
      affectedPlants,
      identification,
      damage,
      damagePrevention,
      physicalControl,
      chemicalControl,
    } = req.body

     let imageUrl = ''
     if (req.file) {
       imageUrl = req.file.path // Cloudinary URL
     }

    const disease = new Disease({
      image: imageUrl,
      name,
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
      name,
      affectedPlants,
      identification,
      damage,
      damagePrevention,
      physicalControl,
      chemicalControl,
    } = req.body


     let imageUrl = null
     if (req.file) {
       imageUrl = req.file.path // New Cloudinary URL
     }

       const updatedData = {
         name,
         affectedPlants,
         identification,
         damage,
         damagePrevention,
         physicalControl,
         chemicalControl,
       }

       if (imageUrl) {
         updatedData.image = imageUrl // Only add image if updated
       }
    
    const disease = await Disease.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    })

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

const getDiseaseByPlantSlug = async (req, res) => {
  try {
    const { name } = req.params

    // Convert the slug back to the proper plant name
    const plantName = name.replace(/-/g, ' ') // Replace hyphens with spaces

    // Find the plant by its name
    const plant = await Plant.findOne({
      name: new RegExp(`^${plantName}$`, 'i'),
    }).exec()
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found.' })
    }

    // Use the plant's _id to find pests
    const pests = await Disease.find({ affectedPlants: plant._id })
      .populate('affectedPlants', 'name') // Optionally populate the plant name
      .exec()

    if (!pests || pests.length === 0) {
      return res
        .status(404)
        .json({ message: 'No diseases found for the specified plant.' })
    }

    res.status(200).json(pests)
  } catch (error) {
    console.error('Error fetching diseases:', error)
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message })
  }
}

module.exports = {
  createDisease,
  getAllDiseases,
  getDiseaseById,
  updateDisease,
  deleteDisease,
  getDiseaseByPlantSlug,
}
