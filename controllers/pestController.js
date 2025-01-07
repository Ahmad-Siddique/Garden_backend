const Pests = require('../models/pest')
const Plant = require('../models/Plant')
 const mongoose = require('mongoose')
// Create new pest
const createPest = async (req, res) => {
  try {
    const {
      name,
      affectedPlants,
      identification,
      damage,
      prevention,
      physicalControl,
      chemicalControl,
    } = req.body

    const parsedAffectedPlants = Array.isArray(affectedPlants)
      ? affectedPlants // Already an array
      : JSON.parse(affectedPlants || '[]') // Parse if stringified

    // Convert to ObjectId if necessary

    const convertedAffectedPlants = parsedAffectedPlants.map(
      (plantId) => new mongoose.Types.ObjectId(plantId),
    )
    // Check if file exists
    let imageUrl = ''
    if (req.file) {
      imageUrl = req.file.path // Cloudinary URL
    }

    const pest = new Pests({
      image: imageUrl,
      name,
      affectedPlants: convertedAffectedPlants,
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
  const { search, page = 1, limit = 10 } = req.query // Extract search, page, and limit from query params

  try {
    // Build the search query
    const searchQuery = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } }, // Case insensitive search by pest name
            { description: { $regex: search, $options: 'i' } }, // Case insensitive search by description
          ],
        }
      : {} // No search criteria if no search query is provided

    // Pagination logic
    const skip = (page - 1) * limit // Calculate how many records to skip

    // Fetch pests based on search criteria and apply pagination
    const pests = await Pests.find(searchQuery)
      .skip(skip)
      .limit(parseInt(limit))

    // Get the total number of pests that match the search query
    const totalPests = await Pests.countDocuments(searchQuery)

    // Return the pests along with the pagination data
    res.status(200).json({
      success: true,
      pests: pests,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPests / limit),
      totalPests,
    })
  } catch (error) {
    console.error('Error fetching pests:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}


const getAllAllPests = async (req, res) => {
  try {
    // Fetch all pests with only `name`, `slug`, and `image` fields
    const pests = await Pests.find({}, 'name slug image');

    // Return the pests
    res.status(200).json({
      success: true,
      pests,
    });
  } catch (error) {
    console.error('Error fetching pests:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


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



const getPestByIdAdmin = async (req, res) => {
  try {
    const { id } = req.params

    const pest = await Pests.findById(id)
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
      name,
      affectedPlants,
      identification,
      damage,
      prevention,
      physicalControl,
      chemicalControl,
    } = req.body

    // Parse affectedPlants to ensure it's an array
    const parsedAffectedPlants = Array.isArray(affectedPlants)
      ? affectedPlants // Already an array
      : JSON.parse(affectedPlants || '[]') // Parse if stringified

    // Convert to ObjectId if necessary
   
    const convertedAffectedPlants = parsedAffectedPlants.map(
      (plantId) => new mongoose.Types.ObjectId(plantId),
    )

    // Handle image update
    let imageUrl = null
    if (req.file) {
      imageUrl = req.file.path // New Cloudinary URL
    }

    console.log('PARSED AFFECTED PLANTS:', convertedAffectedPlants)

    const updatedData = {
      name,
      affectedPlants: convertedAffectedPlants,
      identification,
      damage,
      prevention,
      physicalControl,
      chemicalControl,
    }

    if (imageUrl) {
      updatedData.image = imageUrl // Only add image if updated
    }

    const pest = await Pests.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    })

    if (!pest) {
      return res.status(404).json({ success: false, message: 'Pest not found' })
    }

    res.status(200).json({ success: true, data: pest })
  } catch (error) {
    console.log(error)
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

const getPestsByPlantSlug = async (req, res) => {
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
    const pests = await Pests.find({ affectedPlants: plant._id })
      .populate('affectedPlants', 'name') // Optionally populate the plant name
      .exec()

    if (!pests || pests.length === 0) {
      return res
        .status(404)
        .json({ message: 'No pests found for the specified plant.' })
    }

    res.status(200).json(pests)
  } catch (error) {
    console.error('Error fetching pests:', error)
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message })
  }
}

module.exports = {
  createPest,
  getAllPests,
  getPestById,
  getPestByIdAdmin,
  updatePest,
  deletePest,
  getPestsByPlantSlug,
  getAllAllPests
}
