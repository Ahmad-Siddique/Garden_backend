const express = require('express')
const router = express.Router()
const {
  createCalendar,
  getAllCalendars,
  getCalendarById,
  updateCalendar,
  deleteCalendar,
  getCalenderByPlantSlug,
  getCalendarsByCategoryName,
  getCalendarsGroupedByCategory
} = require('../controllers/calenderController')
const { protect, authorize } = require('../middleware/auth')

// CRUD routes
router.post('/',protect, createCalendar)
router.get('/', getAllCalendars)
router.get('/grouped-by-category', getCalendarsGroupedByCategory)
router.get('/category/:category', getCalendarsByCategoryName)
router.get('/:id', getCalendarById)
router.put('/:id',protect, updateCalendar)
router.delete('/:id',protect, deleteCalendar)
router.get('/name/:name', protect, getCalenderByPlantSlug)
module.exports = router
