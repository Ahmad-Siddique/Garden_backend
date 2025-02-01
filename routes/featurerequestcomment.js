const express = require('express');
const router = express.Router();
const commentController = require('../controllers/featurerequestcommentController');
const { protect, authorize } = require('../middleware/auth')
// Create a new comment
router.post('/comments',protect, commentController.createComment);

// Get all comments for a specific feature request (paginated)
router.get('/comments/:id',protect, commentController.getCommentsByFeatureRequest);

// Delete a comment by ID
router.delete('/comments/:id',protect, commentController.deleteComment);

module.exports = router;
