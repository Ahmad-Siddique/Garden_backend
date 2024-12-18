const Nutrition = require('../models/vitamin')

// Create new nutrition
const createNutrition = async (req, res) => {
  try {
    const { name, affectedPlants } = req.body
    let imageUrl = '' 
    if (req.file) {
      // Assuming the file is uploaded successfully and the storage middleware sets `req.file.path`
      imageUrl = req.file.path // Adjust based on your storage setup (e.g., S3, local, etc.)
    }

    const parsedAffectedPlants = Array.isArray(affectedPlants)
      ? affectedPlants // Already an array
      : JSON.parse(affectedPlants || '[]') // Parse if stringified

    // Convert to ObjectId if necessary
    const convertedAffectedPlants = parsedAffectedPlants.map(
      (plantId) => new mongoose.Types.ObjectId(plantId),
    )

    const nutrition = new Nutrition({
      name,
      image: imageUrl,
      affectedPlants: convertedAffectedPlants,
    })
    await nutrition.save()

    res.status(201).json({ success: true, data: nutrition })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get all nutritions
// const getAllNutritions = async (req, res) => {
//   try {
//     const nutritions = await Nutrition.find().populate('affectedPlants')
//     res.status(200).json({ success: true, data: nutritions })
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message })
//   }
// }


const getAllNutritions = async (req, res) => {
  try {
    // Extract search, page, and limit from query params, with defaults
    const { search, page = 1, limit = 10 } = req.query

    // Build the search query
    const searchQuery = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
          ],
        }
      : {}

    // Fetch pests with search and pagination logic
    const vitamins = await Nutrition.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))

    // Get total pests count matching the search query
    const totalVitamins = await Nutrition.countDocuments(searchQuery)

    // Respond with pests and pagination details
    res.status(200).json({
      success: true,
      vitamins: vitamins,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalVitamins / limit),
        totalVitamins,
      },
    })
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
        .json({ success: false, message: 'Vitamin not found' })
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
    const { name, image, affectedPlants } = req.body

    let imageUrl = user.image // Retain the current image URL if no new image is uploaded
    if (req.file) {
      // Assuming the file is uploaded successfully and the storage middleware sets `req.file.path`
      imageUrl = req.file.path // Adjust based on your storage setup (e.g., S3, local, etc.)
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
     
    }

    if (imageUrl) {
      updatedData.image = imageUrl // Only add image if updated
    }


    const nutrition = await Nutrition.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true },
    )

    if (!nutrition) {
      return res
        .status(404)
        .json({ success: false, message: 'Vitamin not found' })
    }

    res.status(200).json({ success: true, data: nutrition })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const getNutritionByIdAdmin = async (req, res) => {
  try {
    const { id } = req.params

    const pest = await Nutrition.findById(id)
    if (!pest) {
      return res.status(404).json({ success: false, message: 'Vitamin not found' })
    }

    res.status(200).json({ success: true, data: pest })
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
        .json({ success: false, message: 'Vitamin not found' })
    }

    res
      .status(200)
      .json({ success: true, message: 'Vitamin deleted successfully' })
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
  getNutritionByIdAdmin,
}
