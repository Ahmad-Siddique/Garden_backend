const express = require('express');
const router = express.Router();
const featureRequestController = require('../controllers/featurerequestController');

// Routes
router.post('/', featureRequestController.createFeatureRequest); // Create a feature request
router.get('/', featureRequestController.getAllFeatureRequests); // Get all feature requests
router.get('/:id', featureRequestController.getFeatureRequestById); // Get a specific feature request
router.put('/:id', featureRequestController.updateFeatureRequest); // Update a feature request
router.patch('/:id/upvote', featureRequestController.upvoteFeatureRequest); // Increment upvote
router.delete('/:id', featureRequestController.deleteFeatureRequest); // Delete a feature request

module.exports = router;
