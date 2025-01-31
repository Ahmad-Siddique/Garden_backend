const express = require('express');
const router = express.Router();
const featureRequestController = require('../controllers/featurerequestController');
const upload = require('../middleware/multer')
const { protect, authorize } = require('../middleware/auth')
// Routes
router.post('/', protect,featureRequestController.createFeatureRequest); // Create a feature request
router.get('/', featureRequestController.getAllFeatureRequests); // Get all feature requests
router.get('/:id', featureRequestController.getFeatureRequestById); // Get a specific feature request
router.put('/:id/status',protect, featureRequestController.updateFeatureRequestStatus ); // Update a feature request
router.patch('/:id/upvote', protect,featureRequestController.upvoteFeatureRequest); // Increment upvote
router.delete('/:id',protect, featureRequestController.deleteFeatureRequest); // Delete a feature request

module.exports = router;
