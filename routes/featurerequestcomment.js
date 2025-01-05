const express = require('express');
const router = express.Router();
const commentController = require('../controllers/featurerequestcommentController');

// Create a new comment
router.post('/comments', commentController.createComment);

// Get all comments for a specific feature request (paginated)
router.get('/comments/:id', commentController.getCommentsByFeatureRequest);

// Delete a comment by ID
router.delete('/comments/:id', commentController.deleteComment);

module.exports = router;
