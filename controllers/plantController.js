const Plant = require('../models/Plant')

// Create Plant
exports.createPlant = async (req, res) => {
  try {
    const {
      name,
      scientificName,
      category,
      family,
      description,
      growingFromSeed,
      plantingConsiderations,
      feeding,
      harvest,
      storage,
    } = req.body

    const images = req.files

    // Check for case-insensitive duplicate name
    const existingPlant = await Plant.findOne({ name: name.toLowerCase() })
    if (existingPlant) {
      return res
        .status(400)
        .json({ error: 'A plant with this name already exists.' })
    }

    const plant = new Plant({
      name,
      scientificName,
      category,
      family,
      description,
      growingFromSeed,
      plantingConsiderations,
      feeding,
      harvest,
      storage,
      image1: images?.image1 ? images.image1[0].path : null,
      image2: images?.image2 ? images.image2[0].path : null,
      image3: images?.image3 ? images.image3[0].path : null,
      image4: images?.image4 ? images.image4[0].path : null,
      gardenImage: images?.gardenImage ? images.gardenImage[0].path : null,
    })

    const savedPlant = await plant.save()
    res
      .status(201)
      .json({ message: 'Plant created successfully', data: savedPlant })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Get All Plants
exports.getPlants = async (req, res) => {
  try {
    const plants = await Plant.find().populate('category quickInfo.infoId')
    res.status(200).json(plants)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get Plant By ID
exports.getPlantById = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id).populate(
      'category quickInfo.infoId',
    )
    if (!plant) return res.status(404).json({ message: 'Plant not found' })
    res.status(200).json(plant)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Update Plant
exports.updatePlant = async (req, res) => {
  try {
    const { name, ...updates } = req.body
    const images = req.files

    // Check if name is being updated
    if (name) {
      // Find a plant with the same name (case-insensitive) that is not the current plant
      const existingPlant = await Plant.findOne({
        name: name.toLowerCase(),
        _id: { $ne: req.params.id }, // Exclude the current plant
      })
      if (existingPlant) {
        return res
          .status(400)
          .json({ error: 'A plant with this name already exists.' })
      }
      updates.name = name.toLowerCase() // Normalize name to lowercase
    }

    // Handle image updates
    if (images) {
      if (images.image1) updates.image1 = images.image1[0].path
      if (images.image2) updates.image2 = images.image2[0].path
      if (images.image3) updates.image3 = images.image3[0].path
      if (images.image4) updates.image4 = images.image4[0].path
      if (images.gardenImage) updates.gardenImage = images.gardenImage[0].path
    }

    const updatedPlant = await Plant.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    })
    if (!updatedPlant) {
      return res.status(404).json({ error: 'Plant not found' })
    }

    res
      .status(200)
      .json({ message: 'Plant updated successfully', data: updatedPlant })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Delete Plant
exports.deletePlant = async (req, res) => {
  try {
    const plant = await Plant.findByIdAndDelete(req.params.id)
    if (!plant) return res.status(404).json({ message: 'Plant not found' })
    res.status(200).json({ message: 'Plant deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
