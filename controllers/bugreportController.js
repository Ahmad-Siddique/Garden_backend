const BugReport = require('../models/bugreport');

// Create a new bug report
exports.createBugReport = async (req, res) => {
  const { description, emailUpdates } = req.body;

  if (!description) {
    return res.status(400).json({ success: false, message: 'Description is required.' });
  }

  let imageUrls = [];
  if (req.files) {
    imageUrls = req.files.map((file) => file.path); // Assuming Cloudinary or local storage
  }

  try {
    const newBugReport = new BugReport({
      description,
      userId: req.user.id, // Assuming authentication middleware sets req.user
      images: imageUrls, // Store multiple images
      emailUpdates: emailUpdates || null, // Optional field
      status: 'New',
    });

    const savedBugReport = await newBugReport.save();
    res.status(201).json({ success: true, bugReport: savedBugReport });
  } catch (error) {
    console.error('Error creating bug report:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Update bug report status
exports.updateBugReportStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['New', 'In Progress', 'Resolved', 'Closed'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Allowed values are: New, In Progress, Resolved, Closed.',
    });
  }

  try {
    const updatedBugReport = await BugReport.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedBugReport) {
      return res.status(404).json({ success: false, message: 'Bug report not found.' });
    }

    res.status(200).json({ success: true, bugReport: updatedBugReport });
  } catch (error) {
    console.error('Error updating bug report status:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Get all bug reports (with pagination)
exports.getAllBugReports = async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  try {
    const skip = (page - 1) * limit;

    const filter = status ? { status } : {};

    const bugReports = await BugReport.find(filter)
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(parseInt(limit));

    const totalBugReports = await BugReport.countDocuments(filter);

    res.status(200).json({
      success: true,
      bugReports,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalBugReports / limit),
      totalBugReports,
    });
  } catch (error) {
    console.error('Error fetching bug reports:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Delete a bug report
exports.deleteBugReport = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBugReport = await BugReport.findByIdAndDelete(id);

    if (!deletedBugReport) {
      return res.status(404).json({ success: false, message: 'Bug report not found.' });
    }

    res.status(200).json({ success: true, message: 'Bug report deleted successfully.' });
  } catch (error) {
    console.error('Error deleting bug report:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Get a single bug report by ID
exports.getBugReportById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const bugReport = await BugReport.findById(id);
  
      if (!bugReport) {
        return res.status(404).json({ success: false, message: 'Bug report not found.' });
      }
  
      res.status(200).json({ success: true, bugReport });
    } catch (error) {
      console.error('Error fetching bug report:', error);
      res.status(500).json({ success: false, message: 'Server error.' });
    }
  };
  