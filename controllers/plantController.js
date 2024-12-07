const Plant = require('../models/Plant')

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
      quickInfo, // Receive quickInfo as an array
    } = req.body

    const images = req.files

    // Check for case-insensitive duplicate name
    const existingPlant = await Plant.findOne({ name: name.toLowerCase() })
    if (existingPlant) {
      return res
        .status(400)
        .json({ error: 'A plant with this name already exists.' })
    }

    // Ensure quickInfo is an array, even if it's sent as a string
    const parsedQuickInfo = quickInfo ? Array.isArray(quickInfo)
      ? quickInfo
      : JSON.parse(quickInfo)  // Parse if it's a string
      : [];
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
      quickInfo: parsedQuickInfo, // Use the parsed array here
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
    console.log(error)
    res.status(400).json({ error: error.message })
  }
}


// Get All Plants
// Get all plants
exports.getPlants = async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query; // Extract search, page, and limit from query params

  try {
    // Build the search query
    const searchQuery = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } }, // Case insensitive search by plant name
            { description: { $regex: search, $options: 'i' } }, // Case insensitive search by description
          ],
        }
      : {}; // No search criteria if no search query is provided

    // Pagination logic
    const skip = (page - 1) * limit; // Calculate how many records to skip

    // Fetch plants based on search criteria and apply pagination
    const plants = await Plant.find(searchQuery)
      .populate('category quickInfo.infoId') // Populate related fields
      .skip(skip)
      .limit(parseInt(limit));

    // Get the total number of plants that match the search query
    const totalPlants = await Plant.countDocuments(searchQuery);

    // Return the plants along with the pagination data
    res.status(200).json({
      success: true,
      plants,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPlants / limit),
      totalPlants,
    });
  } catch (error) {
    console.error('Error fetching plants:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getAllPlants = async (req, res) => {
  try {
    const plants = await Plant.find().populate('category quickInfo.infoId')
    res.status(200).json(plants)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


// Get plants by category with pagination and search
exports.getPlantsByCategoryName = async (req, res) => {
  const { category } = req.params; // Extract category from route parameters
  const { search, page = 1, limit = 10 } = req.query; // Extract query parameters

  try {
    // Build the search query
    const searchQuery = {
      category: category, // Filter by category
      ...(search && {
        $or: [
          { name: { $regex: search, $options: 'i' } }, // Search by plant name
          { scientificName: { $regex: search, $options: 'i' } }, // Search by scientific name
          { description: { $regex: search, $options: 'i' } }, // Search by description
        ],
      }),
    };

    // Pagination logic
    const skip = (page - 1) * limit; // Calculate number of records to skip

    // Fetch plants and apply pagination
    const plants = await Plant.find(searchQuery)
      .populate('quickInfo.infoId') // Populate related fields
      .skip(skip)
      .limit(parseInt(limit));

    // Count total plants matching the search query
    const totalPlants = await Plant.countDocuments(searchQuery);

    if (plants.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No plants found for category: ${category}`,
      });
    }

    // Respond with plants and pagination data
    res.status(200).json({
      success: true,
      plants,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPlants / limit),
      totalPlants,
    });
  } catch (error) {
    console.error('Error fetching plants by category:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// Get Plant By ID
exports.getPlantById = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id).populate(
      'quickInfo.infoId',
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
    const { name, quickInfo, ...updates } = req.body // Destructure quickInfo
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

    // Ensure quickInfo is handled as an array (like in createPlant)
    if (quickInfo) {
      updates.quickInfo = Array.isArray(quickInfo)
        ? quickInfo
        : JSON.parse(quickInfo) // Parse if it's a string
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



exports.getPlantsGroupedByCategory = async (req, res) => {
  try {
    const plants = await Plant.find().populate('category', 'name') // Populate category field to get category name

    // Group plants by category
    const groupedPlants = plants.reduce((acc, plant) => {
      const category = plant.category ? plant.category : 'Uncategorized'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(plant)
      return acc
    }, {})

    res.status(200).json({
      success: true,
      groupedPlants,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    })
  }
}
