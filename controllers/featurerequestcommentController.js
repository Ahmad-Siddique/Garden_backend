const Comment = require('../models/featurerequestcomment');

// Create a new comment
exports.createComment = async (req, res) => {
  const { name, comment, featureRequestId } = req.body;

  if (!comment || !featureRequestId) {
    return res.status(400).json({ success: false, message: 'Comment and featureRequestId are required.' });
  }

  try {
    const newComment = new Comment({ name: name || 'Anonymous', comment, featureRequestId });
    const savedComment = await newComment.save();
    res.status(201).json({ success: true, comment: savedComment });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Get all comments for a specific feature request (paginated)
exports.getCommentsByFeatureRequest = async (req, res) => {
  const { id } = req.params; // featureRequestId
  const { page = 1, limit = 10 } = req.query;

  try {
    const skip = (page - 1) * limit;

    // Fetch comments with pagination
    const comments = await Comment.find({ featureRequestId: id })
      .sort({ createdAt: -1 }) // Sort by newest comments first
      .skip(skip)
      .limit(parseInt(limit));

    // Get total comment count for the feature request
    const totalComments = await Comment.countDocuments({ featureRequestId: id });

    res.status(200).json({
      success: true,
      comments,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalComments / limit),
      totalComments,
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  const { id } = req.params; // comment ID

  try {
    const deletedComment = await Comment.findByIdAndDelete(id);

    if (!deletedComment) {
      return res.status(404).json({ success: false, message: 'Comment not found.' });
    }

    res.status(200).json({ success: true, message: 'Comment deleted successfully.' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
