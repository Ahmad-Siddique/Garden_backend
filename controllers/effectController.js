const Effect = require('../models/effect');

// Create a new Effect
exports.createEffect = async (req, res) => {
  const { name, type } = req.body;

  // Log for debugging
  console.log("Request Body:", req.body);
  console.log("Uploaded File:", req.file);

  // Validation for required fields
  if (!name || !type) {
    return res.status(400).json({ 
      success: false, 
      message: 'Name and type are required.' 
    });
  }

  if (!['companion', 'combative'].includes(type)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid type. Type must be either "companion" or "combative".' 
    });
  }

  // Handle image upload
  let imageUrl = null;
  if (req.file) {
    imageUrl = req.file.path; // Replace with req.file.location if using S3 or Cloudinary
  } else {
    return res.status(400).json({ 
      success: false, 
      message: 'Image is required.' 
    });
  }

  try {
    // Create a new Effect
    const newEffect = new Effect({ name, type, image: imageUrl });

    // Save to the database
    await newEffect.save();

    // Respond with the created Effect
    res.status(201).json({ 
      success: true, 
      effect: newEffect 
    });
  } catch (error) {
    console.error('Error creating effect:', error);

    // Handle duplicate name error
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Effect with this name already exists.' 
      });
    }

    // Handle server error
    res.status(500).json({ 
      success: false, 
      message: 'Server error.' 
    });
  }
};

// Get all Effects with Pagination and Search
exports.getAllPaginationEffects = async (req, res) => {
  try {
    // Extract search, page, limit, and type from query params, with defaults
    const { search, page = 1, limit = 10, type } = req.query;

    // Build the search query
    const searchQuery = {
      ...(search && {
        $or: [
          { name: { $regex: search, $options: 'i' } }, // Search by name (case-insensitive)
        ],
      }),
      ...(type && { type }), // Filter by type if provided
    };

    // Fetch effects with search and pagination logic
    const effects = await Effect.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Get total effects count matching the search query
    const totalEffects = await Effect.countDocuments(searchQuery);

    // Respond with effects and pagination details
    res.status(200).json({
      success: true,
      effects,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalEffects / limit),
      totalEffects,
    });
  } catch (error) {
    console.error('Error fetching effects:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Get all Effects
exports.getAllEffects = async (req, res) => {
  try {
    const effects = await Effect.find();
    res.status(200).json({ success: true, effects });
  } catch (error) {
    console.error('Error fetching effects:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Get a single Effect by ID
exports.getEffectById = async (req, res) => {
  const { id } = req.params;

  try {
    const effect = await Effect.findById(id);
    if (!effect) {
      return res.status(404).json({ success: false, message: 'Effect not found.' });
    }
    res.status(200).json({ success: true, effect });
  } catch (error) {
    console.error('Error fetching effect:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Update an Effect by ID
exports.updateEffect = async (req, res) => {
  const { id } = req.params;
  const { name, type } = req.body;
  let imageUrl = null;

  if (req.file) {
    imageUrl = req.file.path; // Cloudinary URL or file path
  }

  if (!name && !type && !imageUrl) {
    return res.status(400).json({ success: false, message: 'At least one field is required to update.' });
  }

  if (type && !['companion', 'combative'].includes(type)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid type. Type must be either "companion" or "combative".' 
    });
  }

  try {
    // Find the effect to retrieve the current image
    const effect = await Effect.findById(id);

    if (!effect) {
      return res.status(404).json({ success: false, message: 'Effect not found.' });
    }

    // Update only the provided fields, keeping the previous image if no new one is uploaded
    const updatedEffect = await Effect.findByIdAndUpdate(
      id,
      {
        name: name || effect.name,
        type: type || effect.type,
        image: imageUrl || effect.image, // Retain previous image if no new image is provided
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, effect: updatedEffect });
  } catch (error) {
    console.error('Error updating effect:', error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Effect with this name already exists.' });
    }
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Delete an Effect by ID
exports.deleteEffect = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEffect = await Effect.findByIdAndDelete(id);

    if (!deletedEffect) {
      return res.status(404).json({ success: false, message: 'Effect not found.' });
    }

    res.status(200).json({ success: true, message: 'Effect deleted successfully.' });
  } catch (error) {
    console.error('Error deleting effect:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
