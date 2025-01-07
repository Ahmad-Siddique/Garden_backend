const { default: mongoose } = require('mongoose')
const BeneficialCritter = require('../models/beneficialCritters')
const Plant = require('../models/Plant')

// Create new beneficial critter
const createBeneficialCritter = async (req, res) => {
  try {
    const {
     name,
      affectedPlants,
      speciesCommonName,
      roleInGarden,
      identificationTips,
      attractionMethods,
    } = req.body

     let imageUrl = ''
     if (req.file) {
       imageUrl = req.file.path // Cloudinary URL
    }
    
     const parsedAffectedPlants = Array.isArray(affectedPlants)
       ? affectedPlants // Already an array
       : JSON.parse(affectedPlants || '[]') // Parse if stringified

     // Convert to ObjectId if necessary

     const convertedAffectedPlants = parsedAffectedPlants.map(
       (plantId) => new mongoose.Types.ObjectId(plantId),
     )
    const beneficialCritter = new BeneficialCritter({
      name,
      imageUrl,
      affectedPlants: convertedAffectedPlants,
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
  const { search, page = 1, limit = 10 } = req.query // Extract search, page, and limit from query params

  try {
    // Build the search query
    const searchQuery = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } }, // Case insensitive search by name
            { description: { $regex: search, $options: 'i' } }, // Case insensitive search by description
          ],
        }
      : {} // No search criteria if no search query is provided

    // Pagination logic
    const skip = (page - 1) * limit // Calculate how many records to skip

    // Fetch beneficial critters based on search criteria and apply pagination
    const beneficialCritters = await BeneficialCritter.find(searchQuery)
      .populate('affectedPlants') // Populate the affectedPlants field
      .skip(skip)
      .limit(parseInt(limit))

    // Get the total number of beneficial critters that match the search query
    const totalCritters = await BeneficialCritter.countDocuments(searchQuery)

    // Return the beneficial critters along with the pagination data
    res.status(200).json({
      success: true,
      beneficialCritters,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCritters / limit),
      totalCritters,
    })
  } catch (error) {
    console.error('Error fetching beneficial critters:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}


const getAllAllCritters = async (req, res) => {
  try {
    // Fetch all pests with only `name`, `slug`, and `image` fields
    const beneficialCritters = await BeneficialCritter.find({}, 'name slug image');

    // Return the beneficialCritters
    res.status(200).json({
      success: true,
      beneficialCritters,
    });
  } catch (error) {
    console.error('Error fetching beneficialCritters:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


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

const getBeneficialCritterByIdAdmin = async (req, res) => {
  try {
    const { id } = req.params

    const critter = await BeneficialCritter.findById(id)
    if (!critter) {
      return res
        .status(404)
        .json({ success: false, message: 'Critter not found' })
    }

    res.status(200).json({ success: true, data: critter })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// Update beneficial critter by ID
const updateBeneficialCritter = async (req, res) => {
  try {
    const { id } = req.params
    const {
      name,
      affectedPlants,
      speciesCommonName,
      roleInGarden,
      identificationTips,
      attractionMethods,
    } = req.body

    // console.log(
    //   "GETTING DATA", req.file.path
    // )

     let imageUrl = ''
     if (req.file) {
       imageUrl = req.file.path // Cloudinary URL
    }
    
     const parsedAffectedPlants = Array.isArray(affectedPlants)
       ? affectedPlants // Already an array
       : JSON.parse(affectedPlants || '[]') // Parse if stringified

     // Convert to ObjectId if necessary

     const convertedAffectedPlants = parsedAffectedPlants.map(
       (plantId) => new mongoose.Types.ObjectId(plantId),
    )
    
     const updatedData = {
       name,

       affectedPlants: convertedAffectedPlants,
       speciesCommonName,
       roleInGarden,
       identificationTips,
       attractionMethods,
     }

     if (imageUrl) {
       updatedData.imageUrl = imageUrl // Only add image if updated
     }

    const beneficialCritter = await BeneficialCritter.findByIdAndUpdate(
      id,
      updatedData,
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


const getCritterByPlantSlug = async (req, res) => {
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
    const pests = await BeneficialCritter.find({ affectedPlants: plant._id })
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
  createBeneficialCritter,
  getAllBeneficialCritters,
  getBeneficialCritterById,
  updateBeneficialCritter,
  deleteBeneficialCritter,
  getCritterByPlantSlug,
  getBeneficialCritterByIdAdmin,
  getAllAllCritters
}
