const express = require('express');
const router = express.Router();
const bugReportController = require('../controllers/bugreportController');
const upload = require('../middleware/multer')
const { protect, authorize } = require('../middleware/auth')
// Create a new bug report
router.post('/', upload.array('images', 5), protect, bugReportController.createBugReport);

// Get all bug reports (paginated, optional status filter)
router.get('/', bugReportController.getAllBugReports);
// Get a single bug report by ID
router.get('/:id', bugReportController.getBugReportById);

// Update bug report status
router.patch('/:id/status',protect, bugReportController.updateBugReportStatus);

// Delete a bug report by ID
router.delete('/:id', bugReportController.deleteBugReport);

module.exports = router;
