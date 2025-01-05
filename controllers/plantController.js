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
      quickInfo,
      pests,
      diseases,
      beneficialCritters,
      nutrients,
      vitamins,
      combativeRelationships,
      companionRelationships,
    } = req.body;

    const images = req.files;

    const existingPlant = await Plant.findOne({ name: name.toLowerCase() });
    if (existingPlant) {
      return res.status(400).json({ error: 'A plant with this name already exists.' });
    }

    const parsedQuickInfo = quickInfo
      ? Array.isArray(quickInfo)
        ? quickInfo
        : JSON.parse(quickInfo)
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
      quickInfo: parsedQuickInfo,
      image1: images?.image1 ? images.image1[0].path : null,
      image2: images?.image2 ? images.image2[0].path : null,
      image3: images?.image3 ? images.image3[0].path : null,
      image4: images?.image4 ? images.image4[0].path : null,
      gardenImage: images?.gardenImage ? images.gardenImage[0].path : null,
      pests,
      diseases,
      beneficialCritters,
      nutrients,
      vitamins,
      combativeRelationships,
      companionRelationships,
      createdBy: req.user.id,
    });

    const savedPlant = await plant.save();
    res.status(201).json({ message: 'Plant created successfully', data: savedPlant });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};



// Get All Plants
// Get all plants
exports.getPlants = async (req, res) => {
  const { search, page = 1, limit = 10, sun, frost, season, sort } = req.query;

  try {
    // Build the search query for name and description
    const searchQuery = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } }, // Case insensitive search for name
            { description: { $regex: search, $options: 'i' } }, // Case insensitive search for description
          ],
        }
      : {};

    // Build the filter query for quickInfo.title
    const filterConditions = [];
    if (sun) {
      filterConditions.push({ title: { $in: sun.split(',') } });
    }
    if (frost) {
      filterConditions.push({ title: { $in: frost.split(',') } });
    }
    if (season) {
      filterConditions.push({ title: { $in: season.split(',') } });
    }

    // Add quickInfo filter if any condition is provided
    if (filterConditions.length > 0) {
      searchQuery.quickInfo = {
        $elemMatch: {
          $or: filterConditions,
        },
      };
    }

    // Pagination logic
    const skip = (page - 1) * limit;

    // Sorting logic
    const sortOptions = {};
    if (sort === 'name') {
      sortOptions.name = 1; // Sort by name in ascending order
    } else if (sort === 'category') {
      sortOptions.category = 1; // Sort by category in ascending order
    }

    // Fetch plants with the built query, apply sorting and pagination
    const plants = await Plant.find(searchQuery)
      .populate('quickInfo.infoId') // Populate related fields
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Count total plants matching the search and filters
    const totalPlants = await Plant.countDocuments(searchQuery);

    // Return response
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

exports.updatePlant = async (req, res) => {
  try {
    const { name, quickInfo, pests, diseases, beneficialCritters, nutrients, vitamins, combativeRelationships, companionRelationships, ...updates } = req.body;

    // Ensure 'name' is not duplicated
    if (name) {
      const existingPlant = await Plant.findOne({
        name: name.toLowerCase(),
        _id: { $ne: req.params.id },
      });
      if (existingPlant) {
        return res.status(400).json({ error: 'A plant with this name already exists.' });
      }
      updates.name = name.toLowerCase();
    }

    // Handle 'quickInfo' - parsing if it's a string
    if (quickInfo) {
      updates.quickInfo = Array.isArray(quickInfo) ? quickInfo : JSON.parse(quickInfo);
    }

    console.log(typeof pests);
    console.log(Array.isArray(pests)); // Check if it's an array or string
    
    // Handle array fields (e.g., pests, diseases, etc.)
    if (pests) {
      // If pests is a string that looks like an array, parse it
      if (typeof pests === 'string') {
        try {
          updates.pests = JSON.parse(pests); // Parse the string as JSON if it's a stringified array
        } catch (error) {
          return res.status(400).json({ error: 'Invalid format for pests field.' });
        }
      } else if (Array.isArray(pests)) {
        updates.pests = pests; // If it's already an array, use it directly
      } else {
        return res.status(400).json({ error: 'Pests field must be an array or a valid stringified array.' });
      }
    }
    if (diseases) updates.diseases = Array.isArray(diseases) ? diseases : JSON.parse(diseases);
    if (beneficialCritters) updates.beneficialCritters = Array.isArray(beneficialCritters) ? beneficialCritters : JSON.parse(beneficialCritters);
    if (nutrients) updates.nutrients = Array.isArray(nutrients) ? nutrients : JSON.parse(nutrients);
    if (vitamins) updates.vitamins = Array.isArray(vitamins) ? vitamins : JSON.parse(vitamins);

    // Handle combative relationships (assuming it's an array)
    if (combativeRelationships) {
      updates.combativeRelationships = Array.isArray(combativeRelationships)
        ? combativeRelationships
        : JSON.parse(combativeRelationships);
    }

    // Handle companion relationships (assuming it's an array)
    if (companionRelationships) {
      updates.companionRelationships = Array.isArray(companionRelationships)
        ? companionRelationships
        : JSON.parse(companionRelationships);
    }

    // Update the plant
    const updatedPlant = await Plant.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    // If plant is not found
    if (!updatedPlant) {
      return res.status(404).json({ error: 'Plant not found' });
    }

    res.status(200).json({ message: 'Plant updated successfully', data: updatedPlant });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};




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



exports.updateRelationships = async (req, res) => {
  const { id } = req.params; // Plant ID
  const { relationships, relationshipType } = req.body; // `relationships` contains the updated data, and `relationshipType` decides which relationship to update.

  if (!['combativeRelationships', 'companionRelationships'].includes(relationshipType)) {
    return res.status(400).json({ error: 'Invalid relationship type provided.' });
  }

  try {
    const updateField = { [relationshipType]: relationships };

    const updatedPlant = await Plant.findByIdAndUpdate(
      id,
      updateField,
      { new: true }
    ).populate(`${relationshipType}.plant ${relationshipType}.effects.effect`);

    if (!updatedPlant) {
      return res.status(404).json({ error: 'Plant not found' });
    }

    res.status(200).json({ 
      message: `${relationshipType.replace(/([A-Z])/g, ' $1').toLowerCase()} updated successfully`, 
      data: updatedPlant 
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

