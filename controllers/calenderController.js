const Calendar = require('../models/calendarModel')

// Create new calendar
const createCalendar = async (req, res) => {
  try {
    const { startInside, transplant, sowOutside, harvest, userId, plantId } =
      req.body

    // Helper function to validate date fields
    const validateDates = (section) => {
      return (
        !section ||
        (section.startDate && section.endDate) ||
        (!section.startDate && !section.endDate)
      )
    }

    // Prepare valid sections
    const validSections = {}
    if (startInside && validateDates(startInside)) {
      validSections.startInside = startInside
    }
    if (transplant && validateDates(transplant)) {
      validSections.transplant = transplant
    }
    if (sowOutside && validateDates(sowOutside)) {
      validSections.sowOutside = sowOutside
    }
    if (harvest && validateDates(harvest)) {
      validSections.harvest = harvest
    }

    // Create calendar entry
    const calendar = new Calendar({
      ...validSections,
      userId,
      plantId,
    })

    await calendar.save()
    res.status(201).json({ success: true, data: calendar })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}



// Get all calendars
const getAllCalendars = async (req, res) => {
  try {
    const { userId, plantId } = req.query

    // Optionally filter by userId and/or plantId
    const filter = {}
    if (userId) filter.userId = userId
    if (plantId) filter.plantId = plantId

    const calendars = await Calendar.find(filter)
      .populate('userId')
      .populate('plantId')
    res.status(200).json({ success: true, data: calendars })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get calendar by ID
const getCalendarById = async (req, res) => {
  try {
    const { id } = req.params

    const calendar = await Calendar.findById(id)
      .populate('userId')
      .populate('plantId')

    if (!calendar) {
      return res
        .status(404)
        .json({ success: false, message: 'Calendar not found' })
    }

    res.status(200).json({ success: true, data: calendar })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Update calendar by ID
const updateCalendar = async (req, res) => {
  try {
    const { id } = req.params
    const { startInside, transplant, sowOutside, harvest, userId, plantId } =
      req.body

    // Helper function to validate date fields
    const validateDates = (section) => {
      return (
        !section ||
        (section.startDate && section.endDate) ||
        (!section.startDate && !section.endDate)
      )
    }

    // Prepare the updated fields
    const updatedFields = {}

    if (startInside && validateDates(startInside)) {
      updatedFields.startInside = startInside
    }
    if (transplant && validateDates(transplant)) {
      updatedFields.transplant = transplant
    }
    if (sowOutside && validateDates(sowOutside)) {
      updatedFields.sowOutside = sowOutside
    }
    if (harvest && validateDates(harvest)) {
      updatedFields.harvest = harvest
    }
    if (userId) {
      updatedFields.userId = userId
    }
    if (plantId) {
      updatedFields.plantId = plantId
    }

    // Update the calendar
    const calendar = await Calendar.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    })

    if (!calendar) {
      return res.status(404).json({
        success: false,
        message: 'Calendar not found',
      })
    }

    res.status(200).json({ success: true, data: calendar })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}


// Delete calendar by ID
const deleteCalendar = async (req, res) => {
  try {
    const { id } = req.params

    const calendar = await Calendar.findByIdAndDelete(id)

    if (!calendar) {
      return res
        .status(404)
        .json({ success: false, message: 'Calendar not found' })
    }

    res
      .status(200)
      .json({ success: true, message: 'Calendar deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = {
  createCalendar,
  getAllCalendars,
  getCalendarById,
  updateCalendar,
  deleteCalendar,
}
