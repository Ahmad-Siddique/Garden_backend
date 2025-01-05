const FeatureRequest = require('../models/featurerequest');

// Utility function for validating request body
const validateFeatureRequest = (body) => {
  const errors = [];
  if (!body.title || body.title.trim().length === 0) {
    errors.push('Title is required.');
  }
  if (!body.description || body.description.trim().length === 0) {
    errors.push('Description is required.');
  }
  if (!['Feature', 'Plant', 'Variety', 'Bug', 'Other'].includes(body.requestType)) {
    errors.push('Request type must be one of Feature, Plant, Variety, Bug, or Other.');
  }
  if (body.status && !['In Progress', 'In Review', 'Planned'].includes(body.status)) {
    errors.push('Status must be one of In Progress, In Review, or Planned.');
  }
  return errors;
};

// Create a feature request
exports.createFeatureRequest = async (req, res) => {
  const validationErrors = validateFeatureRequest(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  try {
    const featureRequest = new FeatureRequest(req.body);
    const savedFeatureRequest = await featureRequest.save();
    res.status(201).json(savedFeatureRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all feature requests
exports.getAllFeatureRequests = async (req, res) => {
    const { search, page = 1, limit = 10 } = req.query; // Extract search, page, and limit from query params
  
    try {
      // Build the search query
      const searchQuery = search
        ? {
            $or: [
              { title: { $regex: search, $options: 'i' } }, // Case insensitive search by title
              { description: { $regex: search, $options: 'i' } }, // Case insensitive search by description
              { requestType: { $regex: search, $options: 'i' } }, // Case insensitive search by request type
            ],
          }
        : {}; // No search criteria if no search query is provided
  
      // Pagination logic
      const skip = (page - 1) * limit; // Calculate how many records to skip
  
      // Fetch feature requests based on search criteria and apply pagination
      const featureRequests = await FeatureRequest.find(searchQuery)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }); // Sort by creation date (most recent first)
  
      // Get the total number of feature requests that match the search query
      const totalFeatureRequests = await FeatureRequest.countDocuments(searchQuery);
  
      // Return the feature requests along with pagination data
      res.status(200).json({
        success: true,
        featureRequests,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalFeatureRequests / limit),
        totalFeatureRequests,
      });
    } catch (error) {
      console.error('Error fetching feature requests:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  

// Get a specific feature request by ID
exports.getFeatureRequestById = async (req, res) => {
  try {
    const featureRequest = await FeatureRequest.findById(req.params.id);
    if (!featureRequest) {
      return res.status(404).json({ message: 'Feature request not found.' });
    }
    res.status(200).json(featureRequest);
  } catch (error) {
    res.status(500).json({ message: 'Invalid ID format or other server error.' });
  }
};

// Update a feature request
exports.updateFeatureRequest = async (req, res) => {
  const validationErrors = validateFeatureRequest(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  try {
    const updatedFeatureRequest = await FeatureRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedFeatureRequest) {
      return res.status(404).json({ message: 'Feature request not found.' });
    }
    res.status(200).json(updatedFeatureRequest);
  } catch (error) {
    res.status(500).json({ message: 'Invalid ID format or other server error.' });
  }
};

// Increment upvote for a feature request
exports.upvoteFeatureRequest = async (req, res) => {
  try {
    const featureRequest = await FeatureRequest.findById(req.params.id);
    if (!featureRequest) {
      return res.status(404).json({ message: 'Feature request not found.' });
    }
    featureRequest.upvote += 1;
    await featureRequest.save();
    res.status(200).json({ message: 'Upvoted successfully.', upvotes: featureRequest.upvote });
  } catch (error) {
    res.status(500).json({ message: 'Invalid ID format or other server error.' });
  }
};

// Delete a feature request
exports.deleteFeatureRequest = async (req, res) => {
  try {
    const deletedFeatureRequest = await FeatureRequest.findByIdAndDelete(req.params.id);
    if (!deletedFeatureRequest) {
      return res.status(404).json({ message: 'Feature request not found.' });
    }
    res.status(200).json({ message: 'Feature request deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Invalid ID format or other server error.' });
  }
};
