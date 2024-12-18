const express = require('express')
const router = express.Router()
const {
  createCalendar,
  getAllCalendars,
  getCalendarById,
  updateCalendar,
  deleteCalendar,
  getCalenderByPlantSlug
} = require('../controllers/calenderController')
const { protect, authorize } = require('../middleware/auth')

// CRUD routes
router.post('/',protect, createCalendar)
router.get('/', getAllCalendars)
router.get('/:id', getCalendarById)
router.put('/:id',protect, updateCalendar)
router.delete('/:id',protect, deleteCalendar)
router.get('/name/:name', protect, getCalenderByPlantSlug)
module.exports = router
