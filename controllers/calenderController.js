const Calendar = require('../models/Calender')
const Plant = require('../models/Plant')

// Create new calendar
const createCalendar = async (req, res) => {
  try {
    const { startInside, transplant, sowOutside, harvest, userId, plantId, country, state, city, place } =
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
    if (country) {
      validSections.country = country
    }
    if (state) {
      validSections.state = state
    } if (city) {
      validSections.city = city
    } if (place) {
      validSections.place = place
    } 

    // Create calendar entry
    const calendar = new Calendar({
      ...validSections,
      userId:req.user.id,
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
    const { search, page = 1, limit = 10 } = req.query;

    // Pagination
    const skip = (page - 1) * limit;

    // Base query
    const query = {};

    // If a search term is provided, filter by plant name
    if (search) {
      const plantIds = await Plant.find({
        name: { $regex: search, $options: 'i' },
      }).select('_id');

      query.plantId = { $in: plantIds.map((plant) => plant._id) };
    }

    // Fetch filtered and paginated calendars
    const calendars = await Calendar.find(query)
      .populate('userId', 'name') // Adjust fields as needed
      .populate('plantId', 'name scientificName') // Adjust fields as needed
      .skip(skip)
      .limit(parseInt(limit));

    // Count total matching calendars
    const totalCalendars = await Calendar.countDocuments(query);

    res.status(200).json({
      success: true,
      calendars,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCalendars / limit),
      totalCalendars,
    });
  } catch (error) {
    console.error('Error fetching calendars:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};



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
    const { startInside, transplant, sowOutside, harvest, plantId, country, state, city, place } =
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
    if (country) {
      updatedFields.country = country
    }
    if (state) {
      updatedFields.state= state
    } if (city) {
      updatedFields.city = city
    } if (place) {
      updatedFields.place = place
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


const getCalendarsByCategoryName = async (req, res) => {
  const { category } = req.params; // Extract category from route parameters
  const { search, page = 1, limit = 10 } = req.query; // Extract query parameters

  try {
    // Pagination logic
    const skip = (page - 1) * limit; // Calculate number of records to skip

    // Build the search query
    const searchQuery = {
      ...(search && {
        $or: [
          { 'plantId.name': { $regex: search, $options: 'i' } }, // Search by plant name
          { 'plantId.scientificName': { $regex: search, $options: 'i' } }, // Search by scientific name
          { 'plantId.description': { $regex: search, $options: 'i' } }, // Search by plant description
        ],
      }),
    };

    // Fetch calendars with associated plant data
    const calendars = await Calendar.find()
      .populate({
        path: 'plantId',
        match: { category }, // Filter by category
        select: 'name scientificName description category', // Select relevant plant fields
      })
      .skip(skip)
      .limit(parseInt(limit));

    // Filter out calendars where the plant doesn't match the category
    const filteredCalendars = calendars.filter((calendar) => calendar.plantId);

    // Count total matching calendars (before pagination)
    const totalCalendars = await Calendar.countDocuments({
      ...searchQuery,
      plantId: { $ne: null }, // Ensure the plant exists and matches the category
    });

    if (filteredCalendars.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No calendars found for category: ${category}`,
      });
    }

    // Respond with calendars and pagination data
    res.status(200).json({
      success: true,
      calendars: filteredCalendars,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCalendars / limit),
      totalCalendars,
    });
  } catch (error) {
    console.error('Error fetching calendars by category:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



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



const getCalenderByPlantSlug = async (req, res) => {
  try {
    const { name } = req.params

    // Convert the slug back to the proper plant name
    const plantName = name.replace(/-/g, ' ') // Replace hyphens with spaces

    // Find the plant by its name
    const plant = await Plant.findOne({
      name: new RegExp(`^${plantName}$`, 'i'),
    }).exec()
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found.' })
    }

    // Use the plant's _id to find pests
    const calender = await Calendar.find({ plantId: plant._id })
      .populate('plantId', 'name scientificName') // Optionally populate the plant name
      .exec()

    if (!calender || calender.length === 0) {
      return res
        .status(404)
        .json({ message: 'No calender found for the specified plant.' })
    }

    res.status(200).json(calender)
  } catch (error) {
    console.error('Error fetching diseases:', error)
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message })
  }
}


const getCalendarsGroupedByCategory = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Extract pagination parameters with defaults
  const skip = (page - 1) * limit;

  try {
    // Fetch calendars with their associated plants
    const calendars = await Calendar.find()
      .populate({
        path: 'plantId',
        select: 'name category', // Only fetch necessary fields from Plant
      });

    // Group calendars by plant category
    const groupedCalendars = calendars.reduce((acc, calendar) => {
      const category = calendar.plantId?.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(calendar);
      return acc;
    }, {});

    // Paginate each category
    const paginatedCategories = {};
    for (const [category, categoryCalendars] of Object.entries(groupedCalendars)) {
      paginatedCategories[category] = {
        totalCalendars: categoryCalendars.length,
        totalPages: Math.ceil(categoryCalendars.length / limit),
        currentPage: parseInt(page),
        calendars: categoryCalendars.slice(skip, skip + limit), // Apply pagination
      };
    }

    res.status(200).json({
      success: true,
      groupedCalendars: paginatedCategories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

module.exports = {
  createCalendar,
  getAllCalendars,
  getCalendarById,
  updateCalendar,
  deleteCalendar,
  getCalenderByPlantSlug,
  getCalendarsGroupedByCategory,
  getCalendarsByCategoryName
}
