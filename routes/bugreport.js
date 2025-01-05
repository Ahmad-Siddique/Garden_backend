const express = require('express');
const router = express.Router();
const bugReportController = require('../controllers/bugreportController');

// Create a new bug report
router.post('/bug-reports', bugReportController.createBugReport);

// Get all bug reports (paginated, optional status filter)
router.get('/bug-reports', bugReportController.getAllBugReports);
// Get a single bug report by ID
router.get('/bug-reports/:id', bugReportController.getBugReportById);

// Update bug report status
router.patch('/bug-reports/:id/status', bugReportController.updateBugReportStatus);

// Delete a bug report by ID
router.delete('/bug-reports/:id', bugReportController.deleteBugReport);

module.exports = router;
