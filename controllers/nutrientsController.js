const Nutrition = require('../models/nutrient')

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
    console.log(error)
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
    const nutrients = await Nutrition.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))

    // Get total pests count matching the search query
    const totalNutrients = await Nutrition.countDocuments(searchQuery)

    // Respond with pests and pagination details
    res.status(200).json({
      success: true,
      nutrients: nutrients,
     
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalNutrients / limit),
        totalNutrients,
      
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const getAllAllNutrition = async (req, res) => {
  try {
    // Fetch all pests with only `name`, `slug`, and `image` fields
    const nutrition = await Nutrition.find({}, 'name slug image');

    // Return the nutrition
    res.status(200).json({
      success: true,
      nutrition,
    });
  } catch (error) {
    console.error('Error fetching nutrition:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// Get nutrition by ID
const getNutritionById = async (req, res) => {
  try {
    const { id } = req.params

    const nutrition = await Nutrition.findById(id).populate('affectedPlants')
    if (!nutrition) {
      return res
        .status(404)
        .json({ success: false, message: 'Nutrient not found' })
    }

    res.status(200).json({ success: true, data: nutrition })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Update nutrition by ID
const updateNutrition = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, affectedPlants } = req.body;

    // Retain current image URL if no new image is uploaded
    let imageUrl = undefined;
    if (req.file) {
      // Assuming the file is uploaded successfully and the storage middleware sets `req.file.path`
      imageUrl = req.file.path; // Adjust based on your storage setup (e.g., S3, local, etc.)
    }

    // Parse `affectedPlants` safely into an array
    const parsedAffectedPlants = Array.isArray(affectedPlants)
      ? affectedPlants // Already an array
      : JSON.parse(affectedPlants || '[]'); // Parse if stringified

    // Convert to ObjectId if necessary
    const convertedAffectedPlants = parsedAffectedPlants.map(
      (plantId) => new mongoose.Types.ObjectId(plantId)
    );

    // Prepare the updated data
    const updatedData = {
      name,
      affectedPlants: convertedAffectedPlants,
    };

    // Add the `image` field only if a new image is provided
    if (imageUrl) {
      updatedData.image = imageUrl;
    }

    // Update the document
    const nutrition = await Nutrition.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    // Handle case where the document is not found
    if (!nutrition) {
      return res
        .status(404)
        .json({ success: false, message: 'Nutrient not found' });
    }

    // Send the successful response
    res.status(200).json({ success: true, data: nutrition });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


const getNutritionByIdAdmin = async (req, res) => {
  try {
    const { id } = req.params

    const pest = await Nutrition.findById(id)
    if (!pest) {
      return res.status(404).json({ success: false, message: 'Nutrient not found' })
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
        .json({ success: false, message: 'Nutrient not found' })
    }

    res
      .status(200)
      .json({ success: true, message: 'Nutrient deleted successfully' })
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
  getAllAllNutrition
}
